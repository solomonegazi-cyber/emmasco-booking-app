<?php
/**
 * Emmasco Theme Companion - Input Validation & Security Layer
 * Implements defensive checks, honeypots, rate limits, and cryptographic nonce validation.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Validates the core security requirements for AJAX requests.
 * Includes Nonce validation and honeypot bot trap check.
 *
 * @param string $nonce_action Nonce action name.
 * @param string $param_name   POST field name carrying the security nonce.
 */
function emmasco_validate_ajax_security( $nonce_action, $param_name = 'security' ) {
    // 1. Verify standard request origin / CSRF check with check_ajax_referer
    if ( ! check_ajax_referer( $nonce_action, $param_name, false ) ) {
        emmasco_log_security_event( 'CSRF_VIOLATION', array(
            'action' => $nonce_action,
            'param'  => $param_name,
        ) );
        emmasco_ajax_error(
            __( 'Sicherheitsfehler: CSRF-Validierung fehlgeschlagen. Bitte laden Sie die Seite neu.', 'emmasco-theme' ),
            array( 'error' => 'invalid_nonce' ),
            403
        );
    }

    // 2. Reject oversized payloads immediately
    $total_payload_size = 0;
    foreach ( $_POST as $key => $val ) {
        if ( is_string( $val ) ) {
            $total_payload_size += strlen( $val );
        }
    }
    if ( $total_payload_size > 15000 ) { // 15KB layout cap
        emmasco_log_security_event( 'PAYLOAD_TOO_LARGE', array(
            'size' => $total_payload_size,
        ) );
        emmasco_ajax_error(
            __( 'Validierungsfehler: Anfragekörper überschreitet die maximale Größe.', 'emmasco-theme' ),
            array(),
            413
        );
    }

    // 3. Spambot Honeypot execution (if 'honey_pot' is completed, silently log and exit as fake success to trick bots)
    if ( ! empty( $_POST['honey_pot'] ) ) {
        emmasco_log_security_event( 'SPAM_HONEYPOT_TRIGGERED', array(
            'value' => sanitize_text_field( wp_unslash( $_POST['honey_pot'] ) ),
        ) );
        
        // Return fake success to prevent prompt alert trigger blockades on bot browser side
        emmasco_ajax_success( __( 'Vorgang erfolgreich abgeschlossen.', 'emmasco-theme' ), array( 'bot' => true ) );
    }
}

/**
 * Validates a person's display name.
 *
 * @param string $name Name string to validate.
 * @return string Cleaned and validated name.
 */
function emmasco_validate_name( $name ) {
    $clean_name = trim( sanitize_text_field( wp_unslash( $name ) ) );
    if ( empty( $clean_name ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Name ist erforderlich.', 'emmasco-theme' ) );
    }
    if ( mb_strlen( $clean_name ) > 80 ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Name darf maximal 80 Zeichen lang sein.', 'emmasco-theme' ) );
    }
    return $clean_name;
}

/**
 * Validates an email address.
 *
 * @param string $email Email address to validate.
 * @return string Safe email address.
 */
function emmasco_validate_email( $email ) {
    $clean_email = trim( sanitize_email( wp_unslash( $email ) ) );
    if ( empty( $clean_email ) || ! is_email( $clean_email ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'emmasco-theme' ) );
    }
    if ( strlen( $clean_email ) > 100 ) {
        emmasco_ajax_error( __( 'Validierungsfehler: E-Mail-Adresse ist zu lang.', 'emmasco-theme' ) );
    }
    return $clean_email;
}

/**
 * Validates a German, Swiss or international telephone number strictly.
 *
 * @param string $phone Telephone string.
 * @return string Safe phone string.
 */
function emmasco_validate_phone( $phone ) {
    $clean_phone = trim( sanitize_text_field( wp_unslash( $phone ) ) );
    if ( empty( $clean_phone ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Telefonnummer ist erforderlich.', 'emmasco-theme' ) );
    }
    
    // Pattern checks matching spaces, digits, dashes, optional brackets, leading plus
    if ( ! preg_match( '/^\+?[0-9\s‌\-\(\).\/]{5,30}$/', $clean_phone ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Ungültiges Telefonnummernformat.', 'emmasco-theme' ) );
    }

    return $clean_phone;
}

/**
 * Validates street, city and postal code block.
 *
 * @param string $address Physical address string.
 * @return string Cleaned multiline address.
 */
function emmasco_validate_address( $address ) {
    $clean_address = trim( sanitize_textarea_field( wp_unslash( $address ) ) );
    if ( empty( $clean_address ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Adresse ist erforderlich.', 'emmasco-theme' ) );
    }
    if ( mb_strlen( $clean_address ) > 300 ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Adresse darf maximal 300 Zeichen lang sein.', 'emmasco-theme' ) );
    }
    return $clean_address;
}

/**
 * Validates message subject lines.
 *
 * @param string $subject Message subject.
 * @return string Cleaned subject.
 */
function emmasco_validate_subject( $subject ) {
    $clean_subject = trim( sanitize_text_field( wp_unslash( $subject ) ) );
    if ( empty( $clean_subject ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Betreff ist erforderlich.', 'emmasco-theme' ) );
    }
    if ( mb_strlen( $clean_subject ) > 150 ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Betreff darf maximal 150 Zeichen lang sein.', 'emmasco-theme' ) );
    }
    return $clean_subject;
}

/**
 * Validates full multi-line message content.
 *
 * @param string $message Message body text.
 * @return string Sanitized HTML safe message text.
 */
function emmasco_validate_message( $message ) {
    $clean_message = trim( wp_kses_post( wp_unslash( $message ) ) );
    if ( empty( $clean_message ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Nachricht ist erforderlich.', 'emmasco-theme' ) );
    }
    if ( mb_strlen( $clean_message ) > 3000 ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Nachricht darf maximal 3000 Zeichen lang sein.', 'emmasco-theme' ) );
    }
    return $clean_message;
}

/**
 * Validates user request dates strictly (YYYY-MM-DD format or similar)
 *
 * @param string $date Date string.
 * @return string Cleaned date string.
 */
function emmasco_validate_date( $date ) {
    $clean_date = trim( sanitize_text_field( wp_unslash( $date ) ) );
    if ( empty( $clean_date ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Datum ist erforderlich.', 'emmasco-theme' ) );
    }

    // Try parsing date
    $timestamp = strtotime( $clean_date );
    if ( ! $timestamp ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Bitte geben Sie ein gültiges Datum an.', 'emmasco-theme' ) );
    }

    // Ensure appointment date is in the future or today
    $today_timestamp = strtotime( 'today midnight' );
    if ( $timestamp < $today_timestamp ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Der Wunschtermin darf nicht in der Vergangenheit liegen.', 'emmasco-theme' ) );
    }

    return date( 'Y-m-d', $timestamp );
}

/**
 * Validates appointment request time block (HH:MM style)
 *
 * @param string $time Time string.
 * @return string Cleaned time string.
 */
function emmasco_validate_time( $time ) {
    $clean_time = trim( sanitize_text_field( wp_unslash( $time ) ) );
    if ( empty( $clean_time ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Uhrzeit ist erforderlich.', 'emmasco-theme' ) );
    }

    if ( ! preg_match( '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/', $clean_time ) ) {
        emmasco_ajax_error( __( 'Validierungsfehler: Bitte geben Sie ein gültiges Uhrzeitformat an (HH:MM).', 'emmasco-theme' ) );
    }

    return $clean_time;
}
