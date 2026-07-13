<?php
/**
 * Emmasco Theme Companion - AJAX Rate Limiter Layer
 * Keeps endpoints safe from Denial of Service (DoS), brute force, and robotic automation.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Validates request count per IP address against an action key threshold.
 * Uses secure WordPress transient keys for dynamic caching.
 *
 * @param string $action_key    Name of the action being executed (e.g., 'emmasco_book', 'emmasco_invoice_lookup').
 * @param int    $max_attempts  Max allowed requests within the rate limit window.
 * @param int    $decay_seconds Reset duration in seconds.
 * @return true|void            Returns true on success or halts process with correct 429 status code.
 */
function emmasco_verify_rate_limit( $action_key, $max_attempts = 5, $decay_seconds = 60 ) {
    $ip_address = preg_replace( '/[^0-9a-fA-F:.,]/', '', isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0' );
    
    // Hash IP address with the specific endpoint tag to form a unique key
    $hash_key      = md5( $ip_address . '_' . $action_key );
    $transient_key = 'em_rate_limit_' . $hash_key;

    $attempts = get_transient( $transient_key );

    if ( $attempts === false ) {
        set_transient( $transient_key, 1, $decay_seconds );
        return true;
    }

    $attempts_count = (int) $attempts;

    if ( $attempts_count >= $max_attempts ) {
        // Log throttling event to the security audit trails
        emmasco_log_security_event( 'RATE_LIMIT_EXCEEDED', array(
            'action'       => $action_key,
            'max_attempts' => $max_attempts,
            'decay'        => $decay_seconds,
            'ip'           => $ip_address,
        ) );

        emmasco_ajax_error(
            __( 'Spam-Schutz: Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in Kürze erneut.', 'emmasco-theme' ),
            array( 'retry_after' => $decay_seconds ),
            429
        );
    }

    update_option( '_transient_' . $transient_key, $attempts_count + 1 ); // increment raw transient value safely
    return true;
}
