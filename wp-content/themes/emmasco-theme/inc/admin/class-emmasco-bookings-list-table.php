<?php
/**
 * Emmasco Theme Companion - Bookings List Table Manager
 * Extends WP_List_Table to supply professional list interfaces with sorting, searching, and status operations.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class Emmasco_Bookings_List_Table extends WP_List_Table {

    public function __construct() {
        parent::__construct( array(
            'singular' => 'booking',
            'plural'   => 'bookings',
            'ajax'     => false,
        ) );
    }

    /**
     * Set up default column headers.
     */
    public function get_columns() {
        return array(
            'cb'            => '<input type="checkbox" />',
            'customer_name' => esc_html__( 'Kunde', 'emmasco-theme' ),
            'contact_info'  => esc_html__( 'E-Mail & Telefon', 'emmasco-theme' ),
            'address'       => esc_html__( 'Adresse', 'emmasco-theme' ),
            'service'       => esc_html__( 'Leistung', 'emmasco-theme' ),
            'datetime'      => esc_html__( 'Datum & Zeit', 'emmasco-theme' ),
            'price'         => esc_html__( 'Betrag', 'emmasco-theme' ),
            'status'        => esc_html__( 'Status', 'emmasco-theme' ),
        );
    }

    /**
     * Define columns that can be ordered.
     */
    protected function get_sortable_columns() {
        return array(
            'customer_name' => array( 'customer_name', false ),
            'datetime'      => array( 'booking_date', true ),
            'price'         => array( 'total_price', false ),
        );
    }

    /**
     * Checkbox column.
     */
    protected function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="bookings[]" value="%d" />', $item->ID );
    }

    /**
     * Dynamic column mappings.
     */
    protected function column_default( $item, $column_name ) {
        switch ( $column_name ) {
            case 'customer_name':
                $name = get_post_meta( $item->ID, 'customer_name', true );
                $actions = array();
                $nonce = wp_create_nonce( 'emmasco_admin_action_' . $item->ID );

                if ( current_user_can( 'manage_options' ) ) {
                    $status = get_post_meta( $item->ID, 'status', true );
                    if ( $status !== 'confirmed' ) {
                        $actions['confirm'] = sprintf(
                            '<a href="%s">%s</a>',
                            esc_url( wp_nonce_url( admin_url( 'admin.php?page=emmasco-bookings&action=confirm&id=' . $item->ID ), 'emmasco_admin_bulk_' . $item->ID, 'security_nonce' ) ),
                            esc_html__( 'Bestätigen', 'emmasco-theme' )
                        );
                    }
                    if ( $status !== 'cancelled' ) {
                        $actions['cancel'] = sprintf(
                            '<a href="%s">%s</a>',
                            esc_url( wp_nonce_url( admin_url( 'admin.php?page=emmasco-bookings&action=cancel&id=' . $item->ID ), 'emmasco_admin_bulk_' . $item->ID, 'security_nonce' ) ),
                            esc_html__( 'Stornieren', 'emmasco-theme' )
                        );
                    }
                    $actions['delete'] = sprintf(
                        '<a class="submitdelete" onclick="return confirm(\'Endgültig löschen?\')" href="%s">%s</a>',
                        esc_url( wp_nonce_url( admin_url( 'admin.php?page=emmasco-bookings&action=delete&id=' . $item->ID ), 'emmasco_admin_bulk_' . $item->ID, 'security_nonce' ) ),
                        esc_html__( 'Löschen', 'emmasco-theme' )
                    );
                }

                return sprintf( '<strong>%s</strong><br><span class="row-actions-visible">%s</span>', esc_html( $name ), $this->row_actions( $actions, true ) );

            case 'contact_info':
                $email = get_post_meta( $item->ID, 'email', true );
                $phone = get_post_meta( $item->ID, 'phone', true );
                return sprintf( '<a href="mailto:%s">%s</a><br><span class="description">%s</span>', esc_attr( $email ), esc_html( $email ), esc_html( $phone ) );

            case 'address':
                return esc_html( get_post_meta( $item->ID, 'address', true ) );

            case 'service':
                return sprintf( '<span class="post-state" style="background: #E0F2FE; color: #0369A1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">%s</span>', esc_html( get_post_meta( $item->ID, 'service_name', true ) ) );

            case 'datetime':
                $date = get_post_meta( $item->ID, 'booking_date', true );
                $time = get_post_meta( $item->ID, 'booking_time', true );
                return esc_html( $date . ' um ' . $time );

            case 'price':
                $price = floatval( get_post_meta( $item->ID, 'total_price', true ) );
                return sprintf( '<strong>%s €</strong>', number_format( $price, 2 ) );

            case 'status':
                $status = get_post_meta( $item->ID, 'status', true );
                if ( $status === 'confirmed' ) {
                    return '<span class="badge" style="background:#DEF7EC; color:#03543F; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">Bestätigt</span>';
                } elseif ( $status === 'cancelled' ) {
                    return '<span class="badge" style="background:#FDE8E8; color:#9B1C1C; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">Storniert</span>';
                }
                return '<span class="badge" style="background:#FEF3C7; color:#D97706; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">Ausstehend</span>';

            default:
                return '';
        }
    }

    /**
     * Define list dropdown-based bulk actions.
     */
    protected function get_bulk_actions() {
        return array(
            'bulk-confirm' => esc_html__( 'Bestätigen', 'emmasco-theme' ),
            'bulk-cancel'  => esc_html__( 'Stornieren', 'emmasco-theme' ),
            'bulk-delete'  => esc_html__( 'Endgültig löschen', 'emmasco-theme' ),
        );
    }

    /**
     * Process list page table filters.
     */
    protected function extra_tablenav( $which ) {
        if ( $which === 'top' ) {
            $current_status = isset( $_GET['booking_status'] ) ? sanitize_key( $_GET['booking_status'] ) : '';
            ?>
            <div class="alignleft actions">
                <select name="booking_status" id="booking_status">
                    <option value=""><?php esc_html_e( 'Alle Statuswerte', 'emmasco-theme' ); ?></option>
                    <option value="pending" <?php selected( $current_status, 'pending' ); ?>><?php esc_html_e( 'Ausstehend', 'emmasco-theme' ); ?></option>
                    <option value="confirmed" <?php selected( $current_status, 'confirmed' ); ?>><?php esc_html_e( 'Bestätigt', 'emmasco-theme' ); ?></option>
                    <option value="cancelled" <?php selected( $current_status, 'cancelled' ); ?>><?php esc_html_e( 'Storniert', 'emmasco-theme' ); ?></option>
                </select>
                <?php submit_button( esc_html__( 'Filtern', 'emmasco-theme' ), 'button', 'filter_action', false ); ?>
            </div>
            <?php
        }
    }

    /**
     * Query and load current bookings payload.
     */
    public function prepare_items() {
        $per_page = 15;
        $current_page = $this->get_pagenum();

        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array( $columns, $hidden, $sortable );

        // Dynamic arguments based on Search, Sort & Status Filters
        $args = array(
            'post_type'      => 'emmasco_booking',
            'posts_per_page' => $per_page,
            'paged'          => $current_page,
            'post_status'    => 'publish',
        );

        $orderby = isset( $_GET['orderby'] ) ? sanitize_sql_orderby( $_GET['orderby'] ) : 'id';
        $order = isset( $_GET['order'] ) && strtolower( $_GET['order'] ) === 'asc' ? 'ASC' : 'DESC';

        if ( $orderby === 'customer_name' || $orderby === 'booking_date' || $orderby === 'total_price' ) {
            $args['meta_key'] = $orderby;
            $args['orderby']  = 'meta_value';
            $args['order']    = $order;
        } else {
            $args['orderby'] = 'ID';
            $args['order']   = $order;
        }

        // Search Input
        if ( ! empty( $_GET['s'] ) ) {
            $args['s'] = sanitize_text_field( $_GET['s'] );
        }

        // Booking Status Dropdown Filter
        $status_filter = isset( $_GET['booking_status'] ) ? sanitize_key( $_GET['booking_status'] ) : '';
        if ( ! empty( $status_filter ) ) {
            $args['meta_query'] = array(
                array(
                    'key'     => 'status',
                    'value'   => $status_filter,
                    'compare' => '=',
                ),
            );
        }

        $query = new WP_Query( $args );
        $this->items = $query->posts;

        $total_items = $query->found_posts;
        $this->set_pagination_args( array(
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil( $total_items / $per_page ),
        ) );
    }
}
