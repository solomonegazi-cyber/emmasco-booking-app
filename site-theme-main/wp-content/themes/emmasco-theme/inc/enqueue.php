<?php
/**
 * Emmasco Theme Companion - Script Enqueuer
 * Handles precise enqueuing and localization for stylesheets and modularized companion scripts.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Avoid direct calls.
}

function emmasco_theme_enqueue_assets() {
    $uri_theme = get_template_directory_uri();
    
    // 1. Enqueue Google Fonts
    wp_enqueue_style( 'emmasco-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&display=swap', array(), null );

    // 2. Enqueue Core Theme Stylesheet (style.css)
    wp_enqueue_style( 'emmasco-main-style', get_stylesheet_uri(), array(), '1.1.0' );

    // 3. Enqueue Custom CSS Additions
    wp_enqueue_style( 'emmasco-app-css', $uri_theme . '/assets/css/app.css', array( 'emmasco-main-style' ), '1.1.0' );

    // 4. Register and Enqueue jsPDF (Umd bundle for client-side compiler)
    wp_enqueue_script( 'emmasco-jspdf', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', array(), '2.5.1', true );

    // 5. Enqueue Modular Companion Scripts sequentially based on dependencies
    wp_enqueue_script( 'emmasco-translations', $uri_theme . '/assets/js/translations.js', array( 'jquery' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-services', $uri_theme . '/assets/js/services.js', array( 'emmasco-translations' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-calculator', $uri_theme . '/assets/js/calculator.js', array( 'emmasco-services' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-invoices', $uri_theme . '/assets/js/invoices.js', array( 'emmasco-translations', 'emmasco-jspdf' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-booking', $uri_theme . '/assets/js/booking.js', array( 'emmasco-invoices' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-whatsapp', $uri_theme . '/assets/js/whatsapp.js', array( 'emmasco-translations' ), '1.1.0', true );
    wp_enqueue_script( 'emmasco-animations', $uri_theme . '/assets/js/animations.js', array( 'jquery' ), '1.1.0', true );

    // 6. Enqueue main orchestrator script
    wp_enqueue_script( 'emmasco-app-js', $uri_theme . '/assets/js/app.js', array(
        'jquery',
        'emmasco-translations',
        'emmasco-services',
        'emmasco-calculator',
        'emmasco-invoices',
        'emmasco-booking',
        'emmasco-whatsapp',
        'emmasco-animations'
    ), '1.1.0', true );

    // Localize key parameters directly to app.js
    wp_localize_script( 'emmasco-app-js', 'emmasco_ajax', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => wp_create_nonce( 'emmasco-security-nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'emmasco_theme_enqueue_assets' );
