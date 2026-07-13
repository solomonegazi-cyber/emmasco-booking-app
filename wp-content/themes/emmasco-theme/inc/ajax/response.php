<?php
/**
 * Emmasco Theme Companion - AJAX Response & Logging Layer
 * Standardizes API responses with correct HTTP status codes and coordinates secure audit trails.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Sends a standardized AJAX success payload in JSON format.
 *
 * @param string $message User friendly or system completion message.
 * @param array  $data    Context-specific return variables.
 * @param int    $code    HTTP Status code (standard: 200).
 */
function emmasco_ajax_success( $message, $data = array(), $code = 200 ) {
    status_header( $code );
    
    // Inject the success message if the data array is associative or empty, so javascript can read it as needed
    if ( is_array( $data ) ) {
        $is_assoc = empty( $data ) || array_keys( $data ) !== range( 0, count( $data ) - 1 );
        if ( $is_assoc ) {
            $data['message'] = $message;
        }
    } elseif ( is_object( $data ) ) {
        $data->message = $message;
    }

    wp_send_json_success( $data );
}

/**
 * Sends a standardized AJAX error payload in JSON format.
 *
 * @param string $message User-friendly or security failure message to alert caller.
 * @param array  $data    Contextual debugging information or error fields.
 * @param int    $code    HTTP Status code (standard: 400, or 401/403/429/500).
 */
function emmasco_ajax_error( $message, $data = array(), $code = 400 ) {
    status_header( $code );
    
    if ( is_array( $data ) ) {
        $data['message'] = $message;
    } elseif ( is_object( $data ) ) {
        $data->message = $message;
    } else {
        $data = array( 'message' => $message );
    }

    wp_send_json_error( $data );
}

/**
 * Core security logger to write trace messages & audit events to error logs.
 * Includes precise user context and IP location maps to trace malicious behaviors.
 *
 * @param string $event_type Event category (e.g., 'SECURITY_AUTH', 'SPAM_HONEYPOT', 'RATE_LIMIT').
 * @param mixed  $details    Array or string of context coordinates.
 */
function emmasco_log_security_event( $event_type, $details ) {
    $current_user = wp_get_current_user();
    $user_id      = $current_user && $current_user->ID ? $current_user->ID : 0;
    $user_login   = $current_user && $current_user->user_login ? $current_user->user_login : 'anonymous';
    $ip_address   = preg_replace( '/[^0-9a-fA-F:.,]/', '', isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0' );

    $payload = array(
        'timestamp'  => current_time( 'mysql' ),
        'event_type' => $event_type,
        'user_id'    => $user_id,
        'user_login' => $user_login,
        'ip_address' => $ip_address,
        'details'    => $details,
    );

    error_log( '[EMMASCO AUDIT EVENT] ' . wp_json_encode( $payload ) );
}
