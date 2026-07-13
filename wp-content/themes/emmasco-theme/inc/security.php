<?php
/**
 * Emmasco Theme Companion - Security & CPT Registration Layer
 * Establishes custom post types (booking, invoice, contact_message) and strict input scrubbing.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Silence is golden.
}

/* ==========================================================================
   1. REGISTER NEW WORDPRESS CUSTOM POST TYPES (CPTs)
   ========================================================================== */
function emmasco_register_cpts() {
    // 1. Booking CPT
    register_post_type( 'emmasco_booking', array(
        'labels'      => array(
            'name'          => __( 'EMMASCO Buchungen', 'emmasco-theme' ),
            'singular_name' => __( 'Buchung', 'emmasco-theme' ),
            'add_new_item'  => __( 'Neue Buchung erstellen', 'emmasco-theme' ),
            'edit_item'     => __( 'Buchung bearbeiten', 'emmasco-theme' ),
            'all_items'     => __( 'Alle Buchungen', 'emmasco-theme' ),
        ),
        'public'      => false,
        'show_ui'     => true,
        'has_archive' => false,
        'menu_icon'   => 'dashicons-calendar-alt',
        'supports'    => array( 'title', 'custom-fields' ),
        'capabilities' => array(
            'edit_post'          => 'manage_options',
            'read_post'          => 'manage_options',
            'delete_post'        => 'manage_options',
            'edit_posts'         => 'manage_options',
            'edit_others_posts'  => 'manage_options',
            'publish_posts'      => 'manage_options',
            'read_private_posts' => 'manage_options',
        ),
    ) );

    // 2. Invoice CPT
    register_post_type( 'emmasco_invoice', array(
        'labels'      => array(
            'name'          => __( 'EMMASCO Rechnungen', 'emmasco-theme' ),
            'singular_name' => __( 'Rechnung', 'emmasco-theme' ),
            'add_new_item'  => __( 'Neue Rechnung erstellen', 'emmasco-theme' ),
            'edit_item'     => __( 'Rechnung bearbeiten', 'emmasco-theme' ),
            'all_items'     => __( 'Alle Rechnungen', 'emmasco-theme' ),
        ),
        'public'      => false,
        'show_ui'     => true,
        'has_archive' => false,
        'menu_icon'   => 'dashicons-media-document',
        'supports'    => array( 'title', 'custom-fields' ),
        'capabilities' => array(
            'edit_post'          => 'manage_options',
            'read_post'          => 'manage_options',
            'delete_post'        => 'manage_options',
            'edit_posts'         => 'manage_options',
            'edit_others_posts'  => 'manage_options',
            'publish_posts'      => 'manage_options',
            'read_private_posts' => 'manage_options',
        ),
    ) );

    // 3. Contact Inquiries CPT
    register_post_type( 'emmasco_contact', array(
        'labels'      => array(
            'name'          => __( 'EMMASCO Anfragen', 'emmasco-theme' ),
            'singular_name' => __( 'Kontaktanfrage', 'emmasco-theme' ),
            'edit_item'     => __( 'Nachricht ansehen', 'emmasco-theme' ),
            'all_items'     => __( 'Alle Kontaktanfragen', 'emmasco-theme' ),
        ),
        'public'      => false,
        'show_ui'     => true,
        'has_archive' => false,
        'menu_icon'   => 'dashicons-email',
        'supports'    => array( 'title', 'editor', 'custom-fields' ),
        'capabilities' => array(
            'edit_post'          => 'manage_options',
            'read_post'          => 'manage_options',
            'delete_post'        => 'manage_options',
            'edit_posts'         => 'manage_options',
            'edit_others_posts'  => 'manage_options',
            'publish_posts'      => 'manage_options',
            'read_private_posts' => 'manage_options',
        ),
    ) );
}
add_action( 'init', 'emmasco_register_cpts' );

/* ==========================================================================
   2. ANTI-XSS & ANTI-CSRF VALIDATION ROUTINES
   ========================================================================== */
function emmasco_validate_request( $nonce_action, $param_name = 'security' ) {
    // 1. Verify standard request origin
    if ( ! isset( $_POST[ $param_name ] ) || ! wp_verify_nonce( $_POST[ $param_name ], $nonce_action ) ) {
        wp_send_json_error( array( 'message' => 'CSRF Security Violation. Refresh page and try again.' ), 403 );
    }

    // 2. Rate-Limiting Protection (simple transient-based limiter to stop flood spamming)
    $ip_address = preg_replace( '/[^0-9a-fA-F:.,]/', '', $_SERVER['REMOTE_ADDR'] );
    $transient_key = 'emmasco_rate_limit_' . md5( $ip_address );
    $request_count = get_transient( $transient_key );

    if ( $request_count === false ) {
        // Set rate limit block: Max 4 submissions per 60 seconds
        set_transient( $transient_key, 1, 60 );
    } else {
        $count = (int) $request_count;
        if ( $count >= 4 ) {
            wp_send_json_error( array( 'message' => 'Spam-Schutz: Zu viele Anfragen in kurzer Zeit. Bitte warten Sie 1 Minute.' ), 429 );
        }
        set_transient( $transient_key, $count + 1, 60 );
    }

    // 3. Spambot Honeypot execution (if 'honeypot_field' is completed, silently dump execution as success to cheat bots)
    if ( ! empty( $_POST['honey_pot'] ) ) {
        wp_send_json_success( array( 'message' => 'Successfully processed.' ) ); // Trick spam bots
    }
}
