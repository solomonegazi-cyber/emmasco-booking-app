<?php
/**
 * Emmasco Theme Companion - Booking Form AJAX Handler
 * Securely logs booking inquiries inside a Custom Post Type, generates connected invoices, and sends mail notifications.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Incorporate AJAX architecture components explicitly
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/rate-limit.php';
require_once __DIR__ . '/validation.php';

/**
 * Handles the secure booking inquiry ajax submission.
 */
function emmasco_ajax_book_handler() {
    // 1. Audit and secure request fundamentals
    emmasco_validate_ajax_security( 'emmasco-security-nonce' );

    // 2. Apply strict IP-based rate limiting (Max 5 booking requests per 10 minutes)
    emmasco_verify_rate_limit( 'emmasco_book', 5, 600 );

    // 3. Retrieve, validate and sanitize parameters defensively
    $name    = isset( $_POST['customerName'] ) ? emmasco_validate_name( $_POST['customerName'] ) : '';
    $email   = isset( $_POST['email'] ) ? emmasco_validate_email( $_POST['email'] ) : '';
    $phone   = isset( $_POST['phone'] ) ? emmasco_validate_phone( $_POST['phone'] ) : '';
    $address = isset( $_POST['address'] ) ? emmasco_validate_address( $_POST['address'] ) : '';
    $service = isset( $_POST['serviceId'] ) ? sanitize_key( wp_unslash( $_POST['serviceId'] ) ) : 'haushaltshilfe';
    $dateVal = isset( $_POST['date'] ) ? emmasco_validate_date( $_POST['date'] ) : '';
    $timeVal = isset( $_POST['time'] ) ? emmasco_validate_time( $_POST['time'] ) : '';
    $notes   = isset( $_POST['notes'] ) ? emmasco_validate_message( $_POST['notes'] ) : '';

    // Validate chosen service against price catalog
    $catalog = emmasco_get_service_price_catalog();
    if ( ! isset( $catalog[ $service ] ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Die ausgewählte Dienstleistung ist ungültig.', 'emmasco-theme' ) );
    }

    $chosen_service_display = $catalog[ $service ]['label'];
    $unit_rate              = $catalog[ $service ]['rate'];
    
    // Calculate estimated price based on initial duration (2 hours)
    $total_price_estimate = $unit_rate * 2;

    // 4. Duplicate Booking Prevention (Verify if identical booking exists in the last 5 minutes)
    $duplicate_query = new WP_Query( array(
        'post_type'              => 'emmasco_booking',
        'post_status'            => 'publish',
        'posts_per_page'         => 1,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
        'update_post_meta_cache' => false,
        'date_query'             => array(
            array(
                'after' => '5 minutes ago',
            ),
        ),
        'meta_query'             => array(
            'relation' => 'AND',
            array(
                'key'     => 'email',
                'value'   => $email,
                'compare' => '=',
            ),
            array(
                'key'     => 'booking_date',
                'value'   => $dateVal,
                'compare' => '=',
            ),
            array(
                'key'     => 'booking_time',
                'value'   => $timeVal,
                'compare' => '=',
            ),
        ),
    ) );

    if ( $duplicate_query->have_posts() ) {
        emmasco_log_security_event( 'DUPLICATE_BOOKING_PREVENTED', array(
            'email'   => $email,
            'date'    => $dateVal,
            'time'    => $timeVal,
            'service' => $service,
        ) );
        emmasco_ajax_error(
            __( 'Buchungsfehler: Es liegt bereits eine identische Buchungsanfrage vor. Bitte warten Sie 5 Minuten.', 'emmasco-theme' ),
            array( 'error' => 'duplicate' ),
            409
        );
    }

    // 5. Transactional insert simulator
    $post_title = sprintf( '%s - %s (%s)', $name, $chosen_service_display, $dateVal );
    $booking_id = wp_insert_post( array(
        'post_title'   => $post_title,
        'post_type'    => 'emmasco_booking',
        'post_status'  => 'publish',
        'post_content' => $notes,
    ) );

    if ( is_wp_error( $booking_id ) || ! $booking_id ) {
        emmasco_log_security_event( 'BOOKING_CPT_INSERTION_FAILED', array(
            'name'  => $name,
            'email' => $email,
        ) );
        emmasco_ajax_error( __( 'Datenbankfehler: Die Buchung konnte nicht erstellt werden.', 'emmasco-theme' ), array(), 500 );
    }

    // Write meta configurations securely
    update_post_meta( $booking_id, 'customer_name', $name );
    update_post_meta( $booking_id, 'email', $email );
    update_post_meta( $booking_id, 'phone', $phone );
    update_post_meta( $booking_id, 'address', $address );
    update_post_meta( $booking_id, 'service_id', $service );
    update_post_meta( $booking_id, 'service_name', $chosen_service_display );
    update_post_meta( $booking_id, 'booking_date', $dateVal );
    update_post_meta( $booking_id, 'booking_time', $timeVal );
    update_post_meta( $booking_id, 'total_price', $total_price_estimate );
    update_post_meta( $booking_id, 'status', 'pending' );

    // 6. Connected Invoice Generation (Transactional Verification)
    $invoice_no    = 'EMMA-' . date( 'Ymd' ) . '-' . str_pad( (string) $booking_id, 3, '0', STR_PAD_LEFT );
    $invoice_title = sprintf( 'Rechnung %s für %s', $invoice_no, $name );
    
    $invoice_id = wp_insert_post( array(
        'post_title'  => $invoice_title,
        'post_type'   => 'emmasco_invoice',
        'post_status' => 'publish',
    ) );

    if ( is_wp_error( $invoice_id ) || ! $invoice_id ) {
        // Rollback strategy: Clean up created booking post to avoid orphaned records
        wp_delete_post( $booking_id, true );

        emmasco_log_security_event( 'INVOICE_CPT_INSERTION_FAILED_ROLLBACK_TRIGGERED', array(
            'booking_id' => $booking_id,
            'email'      => $email,
        ) );

        emmasco_ajax_error( __( 'Systemfehler: Die Rechnungserstellung ist fehlgeschlagen. Der Vorgang wurde abgebrochen.', 'emmasco-theme' ), array(), 500 );
    }

    // Write Invoice meta details securely
    update_post_meta( $invoice_id, 'invoice_no', $invoice_no );
    update_post_meta( $invoice_id, 'booking_id', $booking_id );
    update_post_meta( $invoice_id, 'customer_name', $name );
    update_post_meta( $invoice_id, 'email', $email );
    update_post_meta( $invoice_id, 'phone', $phone );
    update_post_meta( $invoice_id, 'address', $address );
    update_post_meta( $invoice_id, 'service_id', $service );
    update_post_meta( $invoice_id, 'service_name', $chosen_service_display );
    update_post_meta( $invoice_id, 'total_price', $total_price_estimate );
    update_post_meta( $invoice_id, 'invoice_date', date( 'd.m.Y' ) );

    // 7. Fire notification email securely
    $admin_email = get_option( 'admin_email' );
    $subject     = sprintf( '[EMMASCO] Neue %s Buchungsanfrage von %s', $chosen_service_display, $name );
    
    // Escape contexts and build plain text email
    $body = sprintf(
        "Hallo Emmanuel Isodje,\n\neine neue Buchungsanfrage von unserer Webseite ist eingegangen:\n\n" .
        "Kunde: %s\nE-Mail: %s\nTelefonnummer: %s\nAdresse: %s\nDienstleistung: %s\n" .
        "Wunschtermin: %s um %s\nNetto-Schätzung: %s EUR\n\nSpezielle Wünsche:\n%s\n\n" .
        "Diese Buchung verwalten: %s\n\nBeste Grüße,\nEMMASCO Web-Integrator",
        $name, $email, $phone, $address, $chosen_service_display, $dateVal, $timeVal, $total_price_estimate, $notes,
        admin_url( 'edit.php?post_type=emmasco_booking' )
    );

    wp_mail( $admin_email, wp_strip_all_tags( $subject ), $body );

    // 8. Log success audit trails
    emmasco_log_security_event( 'BOOKING_SUCCESSFUL', array(
        'booking_id' => $booking_id,
        'invoice_id' => $invoice_id,
        'invoice_no' => $invoice_no,
    ) );

    // 9. Standardized return outcome
    emmasco_ajax_success(
        __( 'Ihre Buchungsanfrage wurde erfolgreich übermittelt.', 'emmasco-theme' ),
        array(
            'booking_id'  => $booking_id,
            'invoice_no'  => $invoice_no,
            'date'        => date( 'd.m.Y' ),
            'total_price' => $total_price_estimate,
        )
    );
}
add_action( 'wp_ajax_emmasco_book', 'emmasco_ajax_book_handler' );
add_action( 'wp_ajax_nopriv_emmasco_book', 'emmasco_ajax_book_handler' );
