<?php
/**
 * Emmasco Reinigungsteam - Core Theme Functions and Bootloader
 * Refactored into highly modular, clean, and secure architecture patterns.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Silence is golden.
}

/* ==========================================================================
   1. CORE THEME CONFIGURATION
   ========================================================================== */
function emmasco_theme_setup() {
    // Enable manual and responsive document page headers
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails
    add_theme_support( 'post-thumbnails' );

    // Render HTML5 standard tags cleanly
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Register primary menus
    register_nav_menus( array(
        'primary-menu' => esc_html__( 'Primary Header Menu', 'emmasco-theme' ),
        'footer-menu'  => esc_html__( 'Footer Links Menu', 'emmasco-theme' ),
    ) );
}
add_action( 'after_setup_theme', 'emmasco_theme_setup' );


/* ==========================================================================
   2. REQUIRE AND LOAD MODULAR INTERNAL LIBRARIES
   ========================================================================== */
$companion_dir = get_template_directory() . '/inc';

// Seeding standard setup configs and options databases
require_once $companion_dir . '/database-migration.php';

// Security layer & Custom Post Types definitions
require_once $companion_dir . '/security.php';

// Asset and style enqueuing mechanisms
require_once $companion_dir . '/enqueue.php';

// Auxiliary features and transient cache API values
require_once $companion_dir . '/api.php';

// WordPress Ajax action routers
require_once $companion_dir . '/ajax/response.php';
require_once $companion_dir . '/ajax/rate-limit.php';
require_once $companion_dir . '/ajax/validation.php';
require_once $companion_dir . '/ajax/booking-handler.php';
require_once $companion_dir . '/ajax/contact-handler.php';
require_once $companion_dir . '/ajax/invoice-handler.php';

// Instantiate our modern administrative dashboard systems
if ( is_admin() ) {
    require_once $companion_dir . '/admin/class-emmasco-admin-controller.php';
}

