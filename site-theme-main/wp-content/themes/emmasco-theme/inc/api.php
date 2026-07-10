<?php
/**
 * Emmasco Theme Companion - Settings & API Export Layer
 * Manages configuration getters, transient caches, and secure, memory-optimized CSV admin exports.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Get service prices with transient cache (expires in 12 hours)
 */
function emmasco_get_service_price_catalog() {
    $cache_key = 'emmasco_service_prices';
    $prices = get_transient( $cache_key );

    if ( $prices === false ) {
        // Load dynamically from database Options if populated
        $prices = get_option( 'emmasco_service_catalog' );
        
        if ( empty( $prices ) || ! is_array( $prices ) ) {
            // Fallback default prices if config is blank
            $prices = array(
                'haushaltshilfe'     => array( 'rate' => 29.90, 'label' => 'Haushaltshilfe SGB XI' ),
                'reinigung'          => array( 'rate' => 34.90, 'label' => 'Unterhaltsreinigung' ),
                'einkaufshilfe'      => array( 'rate' => 28.50, 'label' => 'Einkaufshilfe SGB XI' ),
                'alltagsbegleitung'  => array( 'rate' => 29.00, 'label' => 'Alltagsbegleitung SGB XI' ),
                'angehoerige'        => array( 'rate' => 31.50, 'label' => 'Entlastung für Angehörige' ),
                'fenster'            => array( 'rate' => 45.00, 'label' => 'Fensterreinigung' ),
                'buero'              => array( 'rate' => 39.90, 'label' => 'Büroreinigung (B2B)' ),
                'deepclean'          => array( 'rate' => 44.95, 'label' => 'Deep Cleaning (Frühjahrsputz)' ),
            );
            update_option( 'emmasco_service_catalog', $prices );
        }
        set_transient( $cache_key, $prices, 12 * HOUR_IN_SECONDS );
    }

    return $prices;
}

/**
 * Escapes values specifically to prevent CSV Injection / Excel formula injections.
 * If a value begins with special prefix keys like '=', '+', '-', or '@', it is prepended with a single quote '.
 *
 * @param  mixed $value Unrefined input cell value.
 * @return string Safe representation cell value.
 */
function emmasco_safe_csv_value( $value ) {
    if ( ! is_scalar( $value ) ) {
        return '';
    }

    $value = (string) $value;

    // Remove any leading/trailing whitespace
    $trimmed_value = trim( $value );

    // Look for dangerous starting symbols commonly used for Excel Formulas/DDE execution
    $dangerous_prefixes = array( '=', '+', '-', '@', "\t", "\r", "\n" );

    if ( ! empty( $trimmed_value ) ) {
        $first_char = substr( $trimmed_value, 0, 1 );
        if ( in_array( $first_char, $dangerous_prefixes, true ) ) {
            // Prepend a single quote ' to force Excel to render as raw string text
            $value = "'" . $value;
        }
    }

    return $value;
}

/**
 * CSV Exporter Endpoint for Admin Users.
 * Optimized with WP_Query streaming chunks, memory limit controls, caching flushing, nonces, and capability overrides.
 */
function emmasco_handle_csv_exports() {
    // 1. Verify administrative privileges strictly
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( esc_html__( 'Sicherheitsfehler: Sie haben keine Berechtigung für diesen Export.', 'emmasco-theme' ), 403 );
    }

    // 2. Validate request nonce integrity
    check_admin_referer( 'emmasco_export_security' );

    // 3. Extract and validate requested export file content type
    $export_type = isset( $_GET['export'] ) ? sanitize_key( $_GET['export'] ) : '';
    if ( ! in_array( $export_type, array( 'bookings', 'invoices', 'contacts' ), true ) ) {
        wp_die( esc_html__( 'Sicherheitsfehler: Ungültiger Export-Typ.', 'emmasco-theme' ), 400 );
    }

    // 4. Secure process timeout limits and increase execution allocation safely
    if ( function_exists( 'set_time_limit' ) ) {
        set_time_limit( 300 );
    }
    if ( function_exists( 'ini_set' ) ) {
        ini_set( 'memory_limit', '512M' );
    }

    // 5. Clean output buffering to prevent nested HTML/CSS payload inclusion
    while ( ob_get_level() ) {
        ob_end_clean();
    }

    // 6. Push secure transport headers
    nocache_headers();
    header( 'Content-Type: text/csv; charset=utf-8' );
    header( 'Content-Disposition: attachment; filename=emmasco_' . $export_type . '_export_' . date( 'Ymd_His' ) . '.csv' );
    header( 'X-Content-Type-Options: nosniff' );
    header( 'X-Frame-Options: SAMEORIGIN' );

    // 7. Write directly to standard PHP output channel stream
    $output = fopen( 'php://output', 'w' );
    if ( ! $output ) {
        wp_die( esc_html__( 'Verbindungsfehler: Das Export-Streaming konnte nicht gestartet werden.', 'emmasco-theme' ), 500 );
    }

    // 8. Log export event securely to error log / audit trails (Phase 5)
    $current_user = wp_get_current_user();
    error_log( sprintf(
        '[EMMASCO SECURITY BRIEF] Secure CSV Export initiated by Admin User %s (ID: %d) of type: "%s" at %s',
        $current_user->user_login,
        $current_user->ID,
        $export_type,
        current_time( 'mysql' )
    ) );

    // 9. Write UTF-8 Byte Order Mark (BOM) for bulletproof Microsoft Excel compatibility
    fwrite( $output, chr(0xEF) . chr(0xBB) . chr(0xBF) );

    // Batch configs
    $batch_size = 500;
    $paged      = 1;

    if ( 'bookings' === $export_type ) {
        fputcsv( $output, array( 'Post ID', 'Kunde Name', 'E-Mail', 'Telefon', 'Adresse', 'Service', 'Datum', 'Uhrzeit', 'Preis Netto', 'Status', 'Erstellt am' ) );

        while ( true ) {
            $args = array(
                'post_type'              => 'emmasco_booking',
                'posts_per_page'         => $batch_size,
                'paged'                  => $paged,
                'post_status'            => 'any',
                'orderby'                => 'ID',
                'order'                  => 'ASC',
                'fields'                 => 'ids', // Memory optimized: fetch IDs only
                'no_found_rows'          => true,  // Performance optimized: omit subcount
                'update_post_term_cache' => false, // Performance optimized: skip terms
                'update_post_meta_cache' => false, // Memory optimized: parse batch metadata only
            );

            $query = new WP_Query( $args );

            if ( ! $query->have_posts() || empty( $query->posts ) ) {
                break;
            }

            foreach ( $query->posts as $post_id ) {
                $post_obj = get_post( $post_id );
                if ( ! $post_obj ) {
                    continue;
                }

                $customer_name = get_post_meta( $post_id, 'customer_name', true );
                $email         = get_post_meta( $post_id, 'email', true );
                $phone         = get_post_meta( $post_id, 'phone', true );
                $address       = get_post_meta( $post_id, 'address', true );
                $service_name  = get_post_meta( $post_id, 'service_name', true );
                $booking_date  = get_post_meta( $post_id, 'booking_date', true );
                $booking_time  = get_post_meta( $post_id, 'booking_time', true );
                $total_price   = get_post_meta( $post_id, 'total_price', true );
                $status        = get_post_meta( $post_id, 'status', true );

                fputcsv( $output, array(
                    $post_id,
                    emmasco_safe_csv_value( $customer_name ),
                    emmasco_safe_csv_value( $email ),
                    emmasco_safe_csv_value( $phone ),
                    emmasco_safe_csv_value( $address ),
                    emmasco_safe_csv_value( $service_name ),
                    emmasco_safe_csv_value( $booking_date ),
                    emmasco_safe_csv_value( $booking_time ),
                    emmasco_safe_csv_value( $total_price . ' €' ),
                    emmasco_safe_csv_value( $status ),
                    $post_obj->post_date
                ) );

                // Secure cleanup of WordPress meta & post memory registries
                clean_post_cache( $post_id );
            }

            wp_reset_postdata();
            $paged++;

            // Periodically flush output system
            if ( function_exists( 'flush' ) ) {
                flush();
            }
        }

    } elseif ( 'invoices' === $export_type ) {
        fputcsv( $output, array( 'Post ID', 'Rechnungsnummer', 'Kunde Name', 'E-Mail', 'Dienstleistung', 'Datum', 'Gesamtpreis', 'Erstellt am' ) );

        while ( true ) {
            $args = array(
                'post_type'              => 'emmasco_invoice',
                'posts_per_page'         => $batch_size,
                'paged'                  => $paged,
                'post_status'            => 'any',
                'orderby'                => 'ID',
                'order'                  => 'ASC',
                'fields'                 => 'ids',
                'no_found_rows'          => true,
                'update_post_term_cache' => false,
                'update_post_meta_cache' => false,
            );

            $query = new WP_Query( $args );

            if ( ! $query->have_posts() || empty( $query->posts ) ) {
                break;
            }

            foreach ( $query->posts as $post_id ) {
                $post_obj = get_post( $post_id );
                if ( ! $post_obj ) {
                    continue;
                }

                $invoice_no   = get_post_meta( $post_id, 'invoice_no', true );
                $customer_name = get_post_meta( $post_id, 'customer_name', true );
                $email         = get_post_meta( $post_id, 'email', true );
                $service_name  = get_post_meta( $post_id, 'service_name', true );
                $invoice_date  = get_post_meta( $post_id, 'invoice_date', true );
                $total_price   = get_post_meta( $post_id, 'total_price', true );

                fputcsv( $output, array(
                    $post_id,
                    emmasco_safe_csv_value( $invoice_no ),
                    emmasco_safe_csv_value( $customer_name ),
                    emmasco_safe_csv_value( $email ),
                    emmasco_safe_csv_value( $service_name ),
                    emmasco_safe_csv_value( $invoice_date ),
                    emmasco_safe_csv_value( $total_price . ' €' ),
                    $post_obj->post_date
                ) );

                clean_post_cache( $post_id );
            }

            wp_reset_postdata();
            $paged++;

            if ( function_exists( 'flush' ) ) {
                flush();
            }
        }

    } else {
        fputcsv( $output, array( 'Post ID', 'Absender', 'E-Mail', 'Betreff', 'Nachricht', 'Erstellt am' ) );

        while ( true ) {
            $args = array(
                'post_type'              => 'emmasco_contact',
                'posts_per_page'         => $batch_size,
                'paged'                  => $paged,
                'post_status'            => 'any',
                'orderby'                => 'ID',
                'order'                  => 'ASC',
                'fields'                 => 'ids',
                'no_found_rows'          => true,
                'update_post_term_cache' => false,
                'update_post_meta_cache' => false,
            );

            $query = new WP_Query( $args );

            if ( ! $query->have_posts() || empty( $query->posts ) ) {
                break;
            }

            foreach ( $query->posts as $post_id ) {
                $post_obj = get_post( $post_id );
                if ( ! $post_obj ) {
                    continue;
                }

                $contact_name  = get_post_meta( $post_id, 'contact_name', true );
                $contact_email = get_post_meta( $post_id, 'contact_email', true );

                fputcsv( $output, array(
                    $post_id,
                    emmasco_safe_csv_value( $contact_name ),
                    emmasco_safe_csv_value( $contact_email ),
                    emmasco_safe_csv_value( $post_obj->post_title ),
                    emmasco_safe_csv_value( $post_obj->post_content ),
                    $post_obj->post_date
                ) );

                clean_post_cache( $post_id );
            }

            wp_reset_postdata();
            $paged++;

            if ( function_exists( 'flush' ) ) {
                flush();
            }
        }
    }

    fclose( $output );
    exit;
}
add_action( 'admin_post_emmasco_export_csv', 'emmasco_handle_csv_exports' );
