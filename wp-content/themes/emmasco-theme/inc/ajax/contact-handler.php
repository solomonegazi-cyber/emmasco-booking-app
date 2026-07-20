<?php
/**
 * Emmasco Theme Companion - Contact Inquiry Form Handler
 * Validates entries, adds a timeline post inside 'emmasco_contact' CPT, and fires email notifications.
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
 * Handles secure contact message inquiry ajax submission.
 */
function emmasco_ajax_contact_handler() {
    // 1. Audit and secure request fundamentals
    emmasco_validate_ajax_security( 'emmasco-security-nonce' );

    // 2. Apply strict IP-based rate limiting (Max 5 contact requests per 10 minutes)
    emmasco_verify_rate_limit( 'emmasco_contact', 5, 600 );

    // 3. Retrieve, validate and sanitize parameters defensively
    $name    = isset( $_POST['name'] ) ? emmasco_validate_name( $_POST['name'] ) : '';
    $email   = isset( $_POST['email'] ) ? emmasco_validate_email( $_POST['email'] ) : '';
    $phone   = isset( $_POST['phone'] ) ? emmasco_validate_phone( $_POST['phone'] ) : '';
    $subject = isset( $_POST['subject'] ) ? emmasco_validate_subject( $_POST['subject'] ) : '';
    $message = isset( $_POST['message'] ) ? emmasco_validate_message( $_POST['message'] ) : '';

    // 4. Contact Double Submissions Prevention (Identical email in last 2 minutes)
    $duplicate_query = new WP_Query( array(
        'post_type'              => 'emmasco_contact',
        'post_status'            => 'publish',
        'posts_per_page'         => 1,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
        'update_post_meta_cache' => false,
        'date_query'             => array(
            array(
                'after' => '2 minutes ago',
            ),
        ),
        'meta_query'             => array(
            'relation' => 'AND',
            array(
                'key'     => 'contact_email',
                'value'   => $email,
                'compare' => '=',
            ),
        ),
    ) );

    if ( $duplicate_query->have_posts() ) {
        emmasco_log_security_event( 'DUPLICATE_CONTACT_PREVENTED', array(
            'email'   => $email,
            'subject' => $subject,
        ) );
        emmasco_ajax_error(
            __( 'Fehler: Sie haben vor Kurzem bereits eine Nachricht gesendet. Bitte warten Sie 2 Minuten.', 'emmasco-theme' ),
            array( 'error' => 'duplicate' ),
            409
        );
    }

    // 5. Transactional insert simulator
    $post_id = wp_insert_post( array(
        'post_title'   => sprintf( 'Inquiry: %s from %s', $subject, $name ),
        'post_type'    => 'emmasco_contact',
        'post_status'  => 'publish',
        'post_content' => $message,
    ) );

    if ( is_wp_error( $post_id ) || ! $post_id ) {
        emmasco_log_security_event( 'CONTACT_CPT_INSERTION_FAILED', array(
            'name'  => $name,
            'email' => $email,
        ) );
        emmasco_ajax_error( __( 'Datenbankfehler: Die Nachricht konnte nicht gesichert werden.', 'emmasco-theme' ), array(), 500 );
    }

    // Write meta configurations securely
    update_post_meta( $post_id, 'contact_name', $name );
    update_post_meta( $post_id, 'contact_email', $email );
    update_post_meta( $post_id, 'contact_phone', $phone );

    // 6. Direct secure email notification to the business lead
    $admin_email = get_option( 'admin_email' );
    $mail_title  = sprintf( '[EMMASCO Kontakt] %s - %s', $subject, $name );
    $mail_body   = sprintf(
        "Hallo Emmanuel Isodje,\n\neine neue Kontaktanfrage wurde gesendet:\n\n" .
        "Name: %s\nE-Mail: %s\nTelefon: %s\nBetreff: %s\n\nNachricht:\n%s\n\n" .
        "In Anfragen verwalten: %s\n\nBeste Grüße,\nEMMASCO Web-Integrator",
        $name, $email, $phone, $subject, $message,
        admin_url( 'edit.php?post_type=emmasco_contact' )
    );

    wp_mail( $admin_email, wp_strip_all_tags( $mail_title ), $mail_body );

    // 7. Log success audit trails
    emmasco_log_security_event( 'CONTACT_SUCCESSFUL', array(
        'contact_id' => $post_id,
        'email'      => $email,
    ) );

    // 8. Standardized return outcome
    emmasco_ajax_success( __( 'Ihre Nachricht wurde erfolgreich übermittelt.', 'emmasco-theme' ) );
}
add_action( 'wp_ajax_emmasco_contact', 'emmasco_ajax_contact_handler' );
add_action( 'wp_ajax_nopriv_emmasco_contact', 'emmasco_ajax_contact_handler' );
