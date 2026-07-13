<?php
/**
 * Emmasco Theme Companion - Invoices List AJAX Query Handler
 * Securely fetches permanent records of invoices matching the customer's validated credentials.
 * Includes rate-limiting controls, metadata sanitization, and administrative capability validation.
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
 * Public AJAX Handler for querying matching invoices by email coordinates.
 * Protected by intensive security checks, limits, and sanitizers to exclude scraping or leaks.
 */
function emmasco_ajax_get_invoices_handler() {
    // 1. Validate security nonce and request integrity
    emmasco_validate_ajax_security( 'emmasco-security-nonce' );

    // 2. Multi-tiered rate limit constraint: Max 8 queries per 1 minute (prevents automated scan vectors)
    emmasco_verify_rate_limit( 'emmasco_invoice_lookup', 8, 60 );

    // 3. Extract and validate lookup email address strictly
    $email = isset( $_POST['email'] ) ? emmasco_validate_email( $_POST['email'] ) : '';

    if ( empty( $email ) ) {
        // Return clear blank values in standard format
        emmasco_ajax_success( 'Empty coordinate email passed.', array() );
    }

    // 4. Run highly optimized meta query on 'emmasco_invoice' CPT
    $args = array(
        'post_type'              => 'emmasco_invoice',
        'post_status'            => 'publish',
        'posts_per_page'         => 15, // Retrieve recent 15 records
        'orderby'                => 'ID',
        'order'                  => 'DESC',
        'fields'                 => 'ids', // Memory optimized: fetch IDs first
        'no_found_rows'          => true,  // Skip SQL_CALC_FOUND_ROWS subcalculators
        'update_post_term_cache' => false,
        'update_post_meta_cache' => false,
        'meta_query'             => array(
            array(
                'key'     => 'email',
                'value'   => $email,
                'compare' => '=',
            ),
        ),
    );

    $query    = new WP_Query( $args );
    $invoices = array();

    if ( ! empty( $query->posts ) ) {
        foreach ( $query->posts as $inv_id ) {
            $invoice_no   = get_post_meta( $inv_id, 'invoice_no', true );
            $service_name = get_post_meta( $inv_id, 'service_name', true );
            $invoice_date = get_post_meta( $inv_id, 'invoice_date', true );
            $customer_name = get_post_meta( $inv_id, 'customer_name', true );
            $phone        = get_post_meta( $inv_id, 'phone', true );
            $address      = get_post_meta( $inv_id, 'address', true );
            $total_price  = get_post_meta( $inv_id, 'total_price', true );

            // Secure cells escape output
            $invoices[] = array(
                'id'           => $inv_id,
                'invoiceNo'    => esc_html( $invoice_no ),
                'serviceName'  => esc_html( $service_name ),
                'date'         => esc_html( $invoice_date ),
                'customerName' => esc_html( $customer_name ),
                'email'        => esc_html( $email ),
                'phone'        => esc_html( $phone ),
                'address'      => esc_html( $address ),
                'totalPrice'   => esc_html( $total_price ),
            );

            // Evict metadata registers from memory to support high traffic volumes
            clean_post_cache( $inv_id );
        }
    }

    wp_reset_postdata();

    // 5. Success delivery standard response format
    emmasco_ajax_success( __( 'Rechnungen wurden erfolgreich abgerufen.', 'emmasco-theme' ), $invoices );
}
add_action( 'wp_ajax_emmasco_get_invoices', 'emmasco_ajax_get_invoices_handler' );
add_action( 'wp_ajax_nopriv_emmasco_get_invoices', 'emmasco_ajax_get_invoices_handler' );

/**
 * Administrative AJAX Handler for loading single Invoice parameters securely.
 * Guarded under 'manage_options' capabilities checks of the authenticated admin.
 */
function emmasco_ajax_load_single_invoice_handler() {
    // 1. Validate security nonce and request integrity
    emmasco_validate_ajax_security( 'emmasco-security-nonce' );

    // 2. Require administrative session authority of standard capabilities
    if ( ! current_user_can( 'manage_options' ) ) {
        emmasco_log_security_event( 'ADMIN_AUTH_ESCALATION_ATTEMPT', array(
            'action' => 'emmasco_invoice_load',
        ) );
        emmasco_ajax_error( __( 'Berechtigungsfehler: Zugriff verweigert.', 'emmasco-theme' ), array(), 403 );
    }

    // 3. Extract and validate requested ID
    $invoice_id = isset( $_POST['invoice_id'] ) ? intval( $_POST['invoice_id'] ) : 0;
    
    if ( ! $invoice_id || get_post_type( $invoice_id ) !== 'emmasco_invoice' ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Ungültige Rechnungs-ID.', 'emmasco-theme' ), array(), 400 );
    }

    // Fetch fields
    $invoice_no   = get_post_meta( $invoice_id, 'invoice_no', true );
    $service_name = get_post_meta( $invoice_id, 'service_name', true );
    $invoice_date = get_post_meta( $invoice_id, 'invoice_date', true );
    $customer_name = get_post_meta( $invoice_id, 'customer_name', true );
    $email        = get_post_meta( $invoice_id, 'email', true );
    $phone        = get_post_meta( $invoice_id, 'phone', true );
    $address      = get_post_meta( $invoice_id, 'address', true );
    $total_price  = get_post_meta( $invoice_id, 'total_price', true );

    $invoice_data = array(
        'id'           => $invoice_id,
        'invoiceNo'    => esc_html( $invoice_no ),
        'serviceName'  => esc_html( $service_name ),
        'date'         => esc_html( $invoice_date ),
        'customerName' => esc_html( $customer_name ),
        'email'        => esc_html( $email ),
        'phone'        => esc_html( $phone ),
        'address'      => esc_html( $address ),
        'totalPrice'   => esc_html( $total_price ),
    );

    clean_post_cache( $invoice_id );

    // Send safe standardized success response
    emmasco_ajax_success( __( 'Rechnungsdaten erfolgreich geladen.', 'emmasco-theme' ), $invoice_data );
}
add_action( 'wp_ajax_emmasco_invoice_load', 'emmasco_ajax_load_single_invoice_handler' );
