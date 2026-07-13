<?php
/**
 * Emmasco Theme Companion - Database Setup and Migration Routine
 * Seeds default configuration options, flushes rewrite rules, and prepares capabilities.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Emmasco_DB_Migration {

    /**
     * Initializes setting defaults and database triggers.
     */
    public static function run() {
        self::seed_default_options();
        self::create_custom_indexes();
        self::verify_administrative_capabilities();
    }

    /**
     * Seed initial configuration options into wp_options for the settings panel.
     */
    private static function seed_default_options() {
        // Default Service Catalog pricing & details
        $default_catalog = array(
            'haushaltshilfe'    => array( 'rate' => 29.90, 'label' => 'Haushaltshilfe SGB XI' ),
            'reinigung'         => array( 'rate' => 34.90, 'label' => 'Unterhaltsreinigung' ),
            'einkaufshilfe'     => array( 'rate' => 28.50, 'label' => 'Einkaufshilfe SGB XI' ),
            'alltagsbegleitung' => array( 'rate' => 29.00, 'label' => 'Alltagsbegleitung SGB XI' ),
            'angehoerige'       => array( 'rate' => 31.50, 'label' => 'Entlastung für Angehörige' ),
            'fenster'           => array( 'rate' => 45.00, 'label' => 'Fensterreinigung' ),
            'buero'             => array( 'rate' => 39.90, 'label' => 'Büroreinigung (B2B)' ),
            'deepclean'         => array( 'rate' => 44.95, 'label' => 'Grundreinigung / Deep Clean' ),
        );

        if ( false === get_option( 'emmasco_service_catalog' ) ) {
            update_option( 'emmasco_service_catalog', $default_catalog );
        }

        // Default WhatsApp Configuration options
        if ( false === get_option( 'emmasco_whatsapp_phone' ) ) {
            update_option( 'emmasco_whatsapp_phone', '4917621856044' );
        }

        if ( false === get_option( 'emmasco_invoice_prefix' ) ) {
            update_option( 'emmasco_invoice_prefix', 'EMMA' );
        }
    }

    /**
     * Optional postmeta optimizations or index verification.
     */
    private static function create_custom_indexes() {
        global $wpdb;
        // In WordPress, custom taxonomy and custom postmeta indexes are handled by standard schema checks.
        // We ensure flush_rewrite_rules is run once, safely guarded by theme activation transient.
        if ( get_transient( 'emmasco_theme_activated_flush' ) ) {
            flush_rewrite_rules();
            delete_transient( 'emmasco_theme_activated_flush' );
        }
    }

    /**
     * Confirms or adds custom permissions to standard admin roles.
     */
    private static function verify_administrative_capabilities() {
        $admin_role = get_role( 'administrator' );
        if ( $admin_role ) {
            $admin_role->add_cap( 'manage_emmasco_bookings' );
        }
    }
}

// Hook registration on setup
add_action( 'after_setup_theme', array( 'Emmasco_DB_Migration', 'run' ) );

// Flush rewrites on theme switch
function emmasco_theme_activation_hook() {
    set_transient( 'emmasco_theme_activated_flush', true, 60 );
}
add_action( 'after_switch_theme', 'emmasco_theme_activation_hook' );
