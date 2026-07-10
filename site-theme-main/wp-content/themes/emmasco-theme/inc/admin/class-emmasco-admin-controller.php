<?php
/**
 * Emmasco Theme Companion - Administrative Hub Orchestrator
 * Registers admin menus, executes secure database modifications, and handles dashboard visualizations.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Emmasco_Admin_Controller {

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_admin_menus' ) );
        add_action( 'admin_init', array( __CLASS__, 'process_admin_actions' ) );
        add_action( 'admin_init', array( __CLASS__, 'register_settings_fields' ) );
        add_action( 'admin_notices', array( __CLASS__, 'display_admin_feedback' ) );
    }

    /**
     * Set up EMMASCO administrative dashboard sub-menu pages.
     */
    public static function register_admin_menus() {
        add_menu_page(
            'EMMASCO Admin',
            'EMMASCO Hub',
            'manage_options',
            'emmasco-dashboard',
            array( __CLASS__, 'render_dashboard_page' ),
            'dashicons-chart-area',
            6
        );

        add_submenu_page(
            'emmasco-dashboard',
            'Dashboard Analytics',
            'Dashboard',
            'manage_options',
            'emmasco-dashboard',
            array( __CLASS__, 'render_dashboard_page' )
        );

        add_submenu_page(
            'emmasco-dashboard',
            'EMMASCO Buchungen',
            'Buchungen',
            'manage_options',
            'emmasco-bookings',
            array( __CLASS__, 'render_bookings_page' )
        );

        add_submenu_page(
            'emmasco-dashboard',
            'EMMASCO Rechnungen',
            'Rechnungen',
            'manage_options',
            'emmasco-invoices',
            array( __CLASS__, 'render_invoices_page' )
        );

        add_submenu_page(
            'emmasco-dashboard',
            'EMMASCO Nachrichten',
            'Nachrichten',
            'manage_options',
            'emmasco-messages',
            array( __CLASS__, 'render_messages_page' )
        );

        add_submenu_page(
            'emmasco-dashboard',
            'EMMASCO Einstellungen',
            'Einstellungen',
            'manage_options',
            'emmasco-settings',
            array( __CLASS__, 'render_settings_page' )
        );
    }

    /**
     * Intercept and process bulk and single booking/invoice/contact operations safely with nonces.
     */
    public static function process_admin_actions() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $action = isset( $_GET['action'] ) ? sanitize_key( $_GET['action'] ) : '';
        $id     = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
        $page   = isset( $_GET['page'] ) ? sanitize_key( $_GET['page'] ) : '';

        // Standard Single Action Nonce Validation
        if ( $action && $id ) {
            // Check nonce
            if ( ! isset( $_GET['security_nonce'] ) || ! wp_verify_nonce( $_GET['security_nonce'], 'emmasco_admin_bulk_' . $id ) ) {
                self::set_feedback( 'nonce_error', 'Rechtssicherheitsfehler: Nonce-Validierung fehlgeschlagen.' );
                wp_safe_redirect( admin_url( 'admin.php?page=' . $page ) );
                exit;
            }

            switch ( $action ) {
                case 'confirm':
                    update_post_meta( $id, 'status', 'confirmed' );
                    self::set_feedback( 'success', 'Buchung #' . $id . ' erfolgreich bestätigt!' );
                    break;
                case 'cancel':
                    update_post_meta( $id, 'status', 'cancelled' );
                    self::set_feedback( 'success', 'Buchung #' . $id . ' erfolgreich storniert.' );
                    break;
                case 'delete':
                    wp_delete_post( $id, true );
                    self::set_feedback( 'success', 'Eintrag #' . $id . ' endgültig gelöscht.' );
                    break;
            }

            wp_safe_redirect( admin_url( 'admin.php?page=' . $page ) );
            exit;
        }

        // List Table Bulk Action Interceptions
        $wp_list_action = isset( $_REQUEST['action'] ) ? sanitize_key( $_REQUEST['action'] ) : '';
        if ( empty( $wp_list_action ) && isset( $_REQUEST['action2'] ) ) {
            $wp_list_action = sanitize_key( $_REQUEST['action2'] );
        }

        if ( ! empty( $wp_list_action ) && strpos( $wp_list_action, 'bulk-' ) === 0 ) {
            // Check list table nonce
            check_admin_referer( 'bulk-toplevel_page_emmasco-dashboard' ); // fallback standard fallback

            $target_action = str_replace( 'bulk-', '', $wp_list_action );
            $items_key     = isset( $_REQUEST['bookings'] ) ? 'bookings' : ( isset( $_REQUEST['invoices'] ) ? 'invoices' : ( isset( $_REQUEST['contacts'] ) ? 'contacts' : '' ) );

            if ( ! empty( $items_key ) && isset( $_REQUEST[ $items_key ] ) ) {
                $ids = array_map( 'intval', $_REQUEST[ $items_key ] );
                $count = 0;
                foreach ( $ids as $item_id ) {
                    if ( $target_action === 'confirm' ) {
                        update_post_meta( $item_id, 'status', 'confirmed' );
                        $count++;
                    } elseif ( $target_action === 'cancel' ) {
                        update_post_meta( $item_id, 'status', 'cancelled' );
                        $count++;
                    } elseif ( $target_action === 'delete' ) {
                        wp_delete_post( $item_id, true );
                        $count++;
                    }
                }
                self::set_feedback( 'success', sprintf( '%d Einträge erfolgreich aktualisiert.', $count ) );
                wp_safe_redirect( admin_url( 'admin.php?page=' . $page ) );
                exit;
            }
        }
    }

    /**
     * Define core custom options registers for settings form.
     */
    public static function register_settings_fields() {
        register_setting( 'emmasco_settings_group', 'emmasco_service_catalog', array(
            'sanitize_callback' => array( __CLASS__, 'sanitize_catalog_rates' )
        ) );
        register_setting( 'emmasco_settings_group', 'emmasco_whatsapp_phone', 'sanitize_text_field' );
        register_setting( 'emmasco_settings_group', 'emmasco_invoice_prefix', 'sanitize_text_field' );
    }

    /**
     * Secures and filters direct servicecatalog entries.
     */
    public static function sanitize_catalog_rates( $input ) {
        $clean = array();
        if ( is_array( $input ) ) {
            foreach ( $input as $key => $val ) {
                $clean[ sanitize_key( $key ) ] = array(
                    'rate'  => floatval( $val['rate'] ),
                    'label' => sanitize_text_field( $val['label'] ),
                );
            }
        }
        // Force-clear transient cache representation
        delete_transient( 'emmasco_service_prices' );
        return $clean;
    }

    /**
     * Set transient variable feedback to show administrative messages.
     */
    private static function set_feedback( $type, $message ) {
        set_transient( 'emmasco_admin_notice_' . get_current_user_id(), array(
            'type'    => $type,
            'message' => $message,
        ), 30 );
    }

    /**
     * Renders success / warning notices in WP Admin Header.
     */
    public static function display_admin_feedback() {
        $key = 'emmasco_admin_notice_' . get_current_user_id();
        $notice = get_transient( $key );
        if ( $notice ) {
            delete_transient( $key );
            $class = ( $notice['type'] === 'success' ) ? 'notice-success' : 'notice-error';
            printf( '<div class="notice %s is-dismissible"><p>%s</p></div>', esc_attr( $class ), esc_html( $notice['message'] ) );
        }
    }

    /* ==========================================================================
       ADMIN VIEW RENDERERS (Clean, Highly Polished Aesthetics and Grids)
       ========================================================================== */

    /**
     * Dashboard View Renderer
     */
    public static function render_dashboard_page() {
        // Compute Database Metrics safely
        $b_total = wp_count_posts( 'emmasco_booking' )->publish;
        $i_total = wp_count_posts( 'emmasco_invoice' )->publish;
        $c_total = wp_count_posts( 'emmasco_contact' )->publish;

        // Fetch pending/confirmed revenue values dynamically using low cost SQL
        global $wpdb;
        $revenue_confirmed = $wpdb->get_var( "
            SELECT SUM(CAST(pm.meta_value AS DECIMAL(10,2))) 
            FROM {$wpdb->postmeta} pm 
            INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id 
            WHERE p.post_type = 'emmasco_booking' 
            AND pm.meta_key = 'total_price' 
            AND p.ID IN (
                SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'status' AND meta_value = 'confirmed'
            )
        " );

        $revenue_pending = $wpdb->get_var( "
            SELECT SUM(CAST(pm.meta_value AS DECIMAL(10,2))) 
            FROM {$wpdb->postmeta} pm 
            INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id 
            WHERE p.post_type = 'emmasco_booking' 
            AND pm.meta_key = 'total_price' 
            AND p.ID IN (
                SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'status' AND meta_value = 'pending'
            )
        " );

        $revenue_total = floatval( $revenue_confirmed ) + floatval( $revenue_pending );

        // Render dashboard page layout
        ?>
        <style>
            .emmasco-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .emmasco-stat-card { background: #fff; border-radius: 8px; border: 1px solid #E2E8F0; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .emmasco-stat-title { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.05em; margin: 0 0 10px 0; }
            .emmasco-stat-value { font-size: 28px; font-weight: 800; color: #0F172A; margin: 0; }
            .emmasco-stat-footer { font-size: 12px; color: #64748B; margin: 5px 0 0 0; }
        </style>

        <div class="wrap" style="max-width: 1200px; padding-top: 15px;">
            <h1 style="font-size: 24px; font-weight: 800; color: #0056D6; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                <span>EMMASCO REINIGUNGSTEAM</span>
                <span style="font-size: 11px; background: #0056D6; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: 600;">PORTAL INSIGHTS</span>
            </h1>

            <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h2 style="margin:0; font-size:18px; font-weight:700; color:#0F172A;">Willkommen zurück im Dienstleister-Zentrum</h2>
                    <p style="margin: 5px 0 0 0; color:#64748B; font-size:13px;">Verwalten und exportieren Sie alle Kundenbuchungen und generierten Belege.</p>
                </div>
                <!-- Export Utility Links via admin-post.php -->
                <div style="display: flex; gap: 10px;">
                    <a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=emmasco_export_csv&export=bookings' ), 'emmasco_export_security' ) ); ?>" class="button button-primary">📊 Buchungen (CSV)</a>
                    <a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=emmasco_export_csv&export=invoices' ), 'emmasco_export_security' ) ); ?>" class="button button-secondary">🧾 Rechnungen (CSV)</a>
                    <a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=emmasco_export_csv&export=contacts' ), 'emmasco_export_security' ) ); ?>" class="button button-secondary">✉️ Anfragen (CSV)</a>
                </div>
            </div>

            <!-- Metric Statistics Grid -->
            <div class="emmasco-grid">
                <div class="emmasco-stat-card">
                    <p class="emmasco-stat-title">Umsatz Gesamt (Schätzung)</p>
                    <p class="emmasco-stat-value" style="color: #10B981;"><?php echo esc_html( number_format( $revenue_total, 2 ) ); ?> €</p>
                    <p class="emmasco-stat-footer">Beinhaltet Bestätigte & Ausstehende</p>
                </div>
                <div class="emmasco-stat-card">
                    <p class="emmasco-stat-title">Umsatz Bestätigt</p>
                    <p class="emmasco-stat-value" style="color: #059669;"><?php echo esc_html( number_format( floatval( $revenue_confirmed ), 2 ) ); ?> €</p>
                    <p class="emmasco-stat-footer">Realisierter Umsatz</p>
                </div>
                <div class="emmasco-stat-card">
                    <p class="emmasco-stat-title">Aktive Buchungen</p>
                    <p class="emmasco-stat-value" style="color: #3B82F6;"><?php echo esc_html( $b_total ); ?></p>
                    <p class="emmasco-stat-footer">Registrierte Aufgaben im System</p>
                </div>
                <div class="emmasco-stat-card">
                    <p class="emmasco-stat-title">Kundennachrichten</p>
                    <p class="emmasco-stat-value" style="color: #D97706;"><?php echo esc_html( $c_total ); ?></p>
                    <p class="emmasco-stat-footer">Über das Kontaktformular erhalten</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <!-- Recent Bookings Table Preview -->
                <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size:16px; font-weight:700;">Letzte Buchungsanfragen</h3>
                    <?php
                    $recent_query = new WP_Query( array(
                        'post_type'      => 'emmasco_booking',
                        'post_status'    => 'publish',
                        'posts_per_page' => 5,
                    ) );

                    if ( $recent_query->have_posts() ) : ?>
                        <table classclass="wp-list-table widefat fixed striped" style="width:100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 2px solid #F1F5F9; text-align: left;">
                                    <th style="padding: 10px 0;">Kunde</th>
                                    <th>Service</th>
                                    <th>Wunschtermin</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ( $recent_query->have_posts() ) : $recent_query->the_post(); 
                                    $b_id = get_the_ID();
                                    $status = get_post_meta( $b_id, 'status', true );
                                ?>
                                    <tr style="border-bottom: 1px solid #F1F5F9;">
                                        <td style="padding: 12px 0; font-weight: 600;"><?php echo esc_html( get_post_meta( $b_id, 'customer_name', true ) ); ?></td>
                                        <td><?php echo esc_html( get_post_meta( $b_id, 'service_name', true ) ); ?></td>
                                        <td><?php echo esc_html( get_post_meta( $b_id, 'booking_date', true ) ); ?></td>
                                        <td>
                                            <?php if ( $status === 'confirmed' ) : ?>
                                                <span style="color:#059669; font-weight:600; font-size:11px;">Bestätigt</span>
                                            <?php elseif ( $status === 'cancelled' ) : ?>
                                                <span style="color:#DC2626; font-weight:600; font-size:11px;">Storniert</span>
                                            <?php else : ?>
                                                <span style="color:#D97706; font-weight:600; font-size:11px;">Ausstehend</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endwhile; wp_reset_postdata(); ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p style="color: #64748B;">Keine Buchungen registriert.</p>
                    <?php endif; ?>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=emmasco-bookings' ) ); ?>" style="display:inline-block; margin-top:15px; font-weight:600; text-decoration:none;">Alle Buchungen verwalten &rarr;</a>
                </div>

                <!-- Fast Statistics breakdown -->
                <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size:16px; font-weight:700;">System-Übersicht</h3>
                    <ul style="list-style:none; padding:0; margin:0; font-size:13px; color:#475569;">
                        <li style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
                            <span>Registrierte Rechnungen:</span>
                            <strong style="color:#0F172A;"><?php echo esc_html( $i_total ); ?></strong>
                        </li>
                        <li style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
                            <span>PHP-Version:</span>
                            <strong><?php echo esc_html( phpversion() ); ?></strong>
                        </li>
                        <li style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
                            <span>Datenbank-Sicherheit:</span>
                            <strong style="color:#059669;">Aktiviert (Nonce API)</strong>
                        </li>
                        <li style="display:flex; justify-content:space-between;">
                            <span>Letzter Daten-Export:</span>
                            <strong>Stand Heute</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Bookings Management sub-page
     */
    public static function render_bookings_page() {
        require_once dirname( __FILE__ ) . '/class-emmasco-bookings-list-table.php';
        $table = new Emmasco_Bookings_List_Table();
        $table->prepare_items();
        ?>
        <div class="wrap">
            <h1 style="font-size: 22px; font-weight: 800; color: #0056D6; margin-bottom: 15px;"><?php esc_html_e( 'Buchungstermine verwalten', 'emmasco-theme' ); ?></h1>
            
            <form method="get" action="">
                <input type="hidden" name="page" value="emmasco-bookings" />
                <?php
                // Render Search Bar
                $table->search_box( esc_html__( 'Kunden suchen', 'emmasco-theme' ), 'emmasco-search-input' );
                // Display Table Header/Footer Navigation with pagination & bulk inputs
                $table->display();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Invoices Management sub-page
     */
    public static function render_invoices_page() {
        require_once dirname( __FILE__ ) . '/class-emmasco-invoices-list-table.php';
        $table = new Emmasco_Invoices_List_Table();
        $table->prepare_items();
        ?>
        <div class="wrap">
            <h1 style="font-size: 22px; font-weight: 800; color: #0056D6; margin-bottom: 15px;"><?php esc_html_e( 'Erstellte Rechnungen (Archiv)', 'emmasco-theme' ); ?></h1>
            
            <form method="get" action="">
                <input type="hidden" name="page" value="emmasco-invoices" />
                <?php
                $table->search_box( esc_html__( 'Rechnungen suchen', 'emmasco-theme' ), 'emmasco-search-input' );
                $table->display();
                ?>
            </form>
        </div>

        <!-- Inline script to hook live PDF downloads inside admin table context -->
        <script>
        jQuery(document).ready(function($) {
            $('.emmasco-trigger-pdf').on('click', function(e) {
                e.preventDefault();
                var invoiceId = $(this).data('invoice-id');
                var buttonEl = $(this);
                buttonEl.text('⏳ Generieren...');

                $.ajax({
                    url: emmasco_ajax.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'emmasco_invoice_load',
                        invoice_id: invoiceId,
                        security: emmasco_ajax.nonce
                    },
                    success: function(response) {
                        buttonEl.text('🧾 PDF Download');
                        if (response.success && window.EMMASCO_PDF_COMPILER) {
                            var invoiceData = response.data;
                            // Execute high performance PDF creation using the standard client-side jsPDF model
                            window.EMMASCO_PDF_COMPILER.generateAndSave(invoiceData);
                        } else {
                            alert('Fehler beim Abrufen der Rechnungsdaten: ' + (response.data ? response.data.message : 'Unbekannt.'));
                        }
                    },
                    error: function() {
                        buttonEl.text('🧾 PDF Download');
                        alert('Netzwerkfehler beim Abrufen der Rechnungsdaten.');
                    }
                });
            });
        });
        </script>
        <?php
    }

    /**
     * Messages Management sub-page
     */
    public static function render_messages_page() {
        require_once dirname( __FILE__ ) . '/class-emmasco-contacts-list-table.php';
        $table = new Emmasco_Contacts_List_Table();
        $table->prepare_items();
        ?>
        <div class="wrap">
            <h1 style="font-size: 22px; font-weight: 800; color: #0056D6; margin-bottom: 15px;"><?php esc_html_e( 'Eingegangene Nachrichten', 'emmasco-theme' ); ?></h1>
            
            <form method="get" action="">
                <input type="hidden" name="page" value="emmasco-messages" />
                <?php
                $table->search_box( esc_html__( 'Inhalte filtern', 'emmasco-theme' ), 'emmasco-search-input' );
                $table->display();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Settings Page configuration view
     */
    public static function render_settings_page() {
        $catalog = get_option( 'emmasco_service_catalog', array() );
        $whatsapp = get_option( 'emmasco_whatsapp_phone', '4917621856044' );
        $prefix   = get_option( 'emmasco_invoice_prefix', 'EMMA' );
        ?>
        <div class="wrap" style="max-width: 800px; padding-top: 15px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #0056D6; margin-bottom: 10px;"><?php esc_html_e( 'EMMASCO Systemeinstellungen', 'emmasco-theme' ); ?></h1>
            <p style="color: #64748B; margin-bottom: 30px; font-size:13px;">Passen Sie die Stundensätze Ihrer Reinigungsdienstleistungen, WhatsApp-Schnittstellen und Rechnungsnummernkreise flexibel an.</p>

            <form method="post" action="options.php">
                <?php settings_fields( 'emmasco_settings_group' ); ?>
                
                <h2 style="font-size:16px; font-weight:700; border-bottom:1px solid #E2E8F0; padding-bottom:8px; margin-bottom:15px; color:#0F172A;">⚙️ Globale Parameter</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="emmasco_whatsapp_phone">WhatsApp Kontaktnummer:</label></th>
                        <td>
                            <input type="text" id="emmasco_whatsapp_phone" name="emmasco_whatsapp_phone" value="<?php echo esc_attr( $whatsapp ); ?>" class="regular-text" />
                            <p class="description">Ländervorwahl hinzufügen ohne '+' (z.B. 4917621856044 für Deutschland).</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="emmasco_invoice_prefix">Rechnungsnummer-Präfix:</label></th>
                        <td>
                            <input type="text" id="emmasco_invoice_prefix" name="emmasco_invoice_prefix" value="<?php echo esc_attr( $prefix ); ?>" class="regular-text" />
                            <p class="description">Der Präfix für die fortlaufenden Rechnungsnummern (z.B. EMMA).</p>
                        </td>
                    </tr>
                </table>

                <h2 style="font-size:16px; font-weight:700; border-bottom:1px solid #E2E8F0; padding-bottom:8px; margin-top:30px; margin-bottom:15px; color:#0F172A;">💰 Service-Katalog & Stundensätze</h2>
                <table class="wp-list-table widefat fixed striped" style="margin-bottom: 25px; border:1px solid #E2E8F0; border-radius:4px;">
                    <thead>
                        <tr>
                            <th style="font-weight:700; padding:10px;">Dienstleistung (System-ID)</th>
                            <th style="font-weight:700; padding:10px;">Anzeigename (Kunde)</th>
                            <th style="font-weight:700; padding:10px; text-align:right;">Stundensatz (€ / Std. Brutto)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $catalog as $key => $values ) : ?>
                            <tr>
                                <td style="padding:10px; font-family: monospace; font-weight:600;"><?php echo esc_html( $key ); ?></td>
                                <td style="padding:10px;">
                                    <input type="text" name="emmasco_service_catalog[<?php echo esc_attr( $key ); ?>][label]" value="<?php echo esc_attr( $values['label'] ); ?>" style="width: 100%;" />
                                </td>
                                <td style="padding:10px; text-align:right;">
                                    <input type="number" step="0.01" name="emmasco_service_catalog[<?php echo esc_attr( $key ); ?>][rate]" value="<?php echo esc_attr( $values['rate'] ); ?>" style="width: 90px; text-align:right;" />
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <?php submit_button( esc_html__( 'Einstellungen sichern', 'emmasco-theme' ), 'button-primary button-large' ); ?>
            </form>
        </div>
        <?php
    }
}

// Instantiate
Emmasco_Admin_Controller::init();
