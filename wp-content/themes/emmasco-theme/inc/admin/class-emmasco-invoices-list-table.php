<?php
/**
 * Emmasco Theme Companion - Invoices List Table Manager
 * Extends WP_List_Table to supply professional list interfaces for invoices.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class Emmasco_Invoices_List_Table extends WP_List_Table {

    public function __construct() {
        parent::__construct( array(
            'singular' => 'invoice',
            'plural'   => 'invoices',
            'ajax'     => false,
        ) );
    }

    /**
     * Set up default column headers.
     */
    public function get_columns() {
        return array(
            'cb'            => '<input type="checkbox" />',
            'invoice_no'    => esc_html__( 'Rechnungsnr.', 'emmasco-theme' ),
            'customer_name' => esc_html__( 'Kunde', 'emmasco-theme' ),
            'contact_info'  => esc_html__( 'E-Mail & Telefon', 'emmasco-theme' ),
            'service'       => esc_html__( 'Leistung', 'emmasco-theme' ),
            'invoice_date'  => esc_html__( 'Rechnungsdatum', 'emmasco-theme' ),
            'price'         => esc_html__( 'Betrag', 'emmasco-theme' ),
        );
    }

    /**
     * Define columns that can be ordered.
     */
    protected function get_sortable_columns() {
        return array(
            'invoice_no'   => array( 'invoice_no', true ),
            'invoice_date' => array( 'invoice_date', false ),
            'price'        => array( 'total_price', false ),
        );
    }

    /**
     * Checkbox column.
     */
    protected function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="invoices[]" value="%d" />', $item->ID );
    }

    /**
     * Dynamic column mappings.
     */
    protected function column_default( $item, $column_name ) {
        switch ( $column_name ) {
            case 'invoice_no':
                $inv_no = get_post_meta( $item->ID, 'invoice_no', true );
                if ( empty( $inv_no ) ) {
                    $inv_no = 'EMMA-' . $item->ID;
                }
                $actions = array();
                
                if ( current_user_can( 'manage_options' ) ) {
                    // Action URL with security nonces
                    $actions['pdf_download'] = sprintf(
                        '<a href="#" class="emmasco-trigger-pdf" data-invoice-id="%d">%s</a>',
                        $item->ID,
                        esc_html__( '🧾 PDF Download', 'emmasco-theme' )
                    );
                    $actions['delete'] = sprintf(
                        '<a class="submitdelete" onclick="return confirm(\'Rechnung endgültig löschen?\')" href="%s">%s</a>',
                        esc_url( wp_nonce_url( admin_url( 'admin.php?page=emmasco-invoices&action=delete&id=' . $item->ID ), 'emmasco_admin_bulk_' . $item->ID, 'security_nonce' ) ),
                        esc_html__( 'Löschen', 'emmasco-theme' )
                    );
                }

                return sprintf( '<strong>%s</strong><br><span class="row-actions-visible">%s</span>', esc_html( $inv_no ), $this->row_actions( $actions, true ) );

            case 'customer_name':
                return esc_html( get_post_meta( $item->ID, 'customer_name', true ) );

            case 'contact_info':
                $email = get_post_meta( $item->ID, 'email', true );
                $phone = get_post_meta( $item->ID, 'phone', true );
                return sprintf( '<a href="mailto:%s">%s</a><br><span class="description">%s</span>', esc_attr( $email ), esc_html( $email ), esc_html( $phone ) );

            case 'service':
                return sprintf( '<span class="post-state" style="background: #FFF1F2; color: #BE123C; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">%s</span>', esc_html( get_post_meta( $item->ID, 'service_name', true ) ) );

            case 'invoice_date':
                return esc_html( get_post_meta( $item->ID, 'invoice_date', true ) );

            case 'price':
                $price = floatval( get_post_meta( $item->ID, 'total_price', true ) );
                return sprintf( '<strong>%s €</strong>', number_format( $price, 2 ) );

            default:
                return '';
        }
    }

    /**
     * Define list dropdown-based bulk actions.
     */
    protected function get_bulk_actions() {
        return array(
            'bulk-delete'  => esc_html__( 'Endgültig löschen', 'emmasco-theme' ),
        );
    }

    /**
     * Query and load current invoices payload.
     */
    public function prepare_items() {
        $per_page = 15;
        $current_page = $this->get_pagenum();

        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array( $columns, $hidden, $sortable );

        // Dynamic arguments based on Search & Sort
        $args = array(
            'post_type'      => 'emmasco_invoice',
            'posts_per_page' => $per_page,
            'paged'          => $current_page,
            'post_status'    => 'publish',
        );

        $orderby = isset( $_GET['orderby'] ) ? sanitize_sql_orderby( $_GET['orderby'] ) : 'id';
        $order = isset( $_GET['order'] ) && strtolower( $_GET['order'] ) === 'asc' ? 'ASC' : 'DESC';

        if ( $orderby === 'invoice_no' || $orderby === 'invoice_date' || $orderby === 'total_price' ) {
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
