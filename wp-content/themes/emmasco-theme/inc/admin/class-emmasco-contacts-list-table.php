<?php
/**
 * Emmasco Theme Companion - Contact Inquiries List Table Manager
 * Extends WP_List_Table to supply professional list interfaces for contact messages.
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class Emmasco_Contacts_List_Table extends WP_List_Table {

    public function __construct() {
        parent::__construct( array(
            'singular' => 'contact',
            'plural'   => 'contacts',
            'ajax'     => false,
        ) );
    }

    /**
     * Set up default column headers.
     */
    public function get_columns() {
        return array(
            'cb'           => '<input type="checkbox" />',
            'contact_name' => esc_html__( 'Absender', 'emmasco-theme' ),
            'contact_info' => esc_html__( 'E-Mail & Telefon', 'emmasco-theme' ),
            'subject'      => esc_html__( 'Nachrichten-Betreff', 'emmasco-theme' ),
            'message'      => esc_html__( 'Inhalt der Nachricht', 'emmasco-theme' ),
            'date'         => esc_html__( 'Erhalt am', 'emmasco-theme' ),
        );
    }

    /**
     * Define columns that can be ordered.
     */
    protected function get_sortable_columns() {
        return array(
            'contact_name' => array( 'contact_name', true ),
            'date'         => array( 'date', false ),
        );
    }

    /**
     * Checkbox column.
     */
    protected function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="contacts[]" value="%d" />', $item->ID );
    }

    /**
     * Dynamic column mappings.
     */
    protected function column_default( $item, $column_name ) {
        switch ( $column_name ) {
            case 'contact_name':
                $name = get_post_meta( $item->ID, 'contact_name', true );
                if ( empty( $name ) ) {
                    $name = esc_html__( 'Unbekannt', 'emmasco-theme' );
                }
                $actions = array();
                
                if ( current_user_can( 'manage_options' ) ) {
                    $actions['delete'] = sprintf(
                        '<a class="submitdelete" onclick="return confirm(\'Nachricht endgültig löschen?\')" href="%s">%s</a>',
                        esc_url( wp_nonce_url( admin_url( 'admin.php?page=emmasco-messages&action=delete&id=' . $item->ID ), 'emmasco_admin_bulk_' . $item->ID, 'security_nonce' ) ),
                        esc_html__( 'Löschen', 'emmasco-theme' )
                    );
                }

                return sprintf( '<strong>%s</strong><br><span class="row-actions-visible">%s</span>', esc_html( $name ), $this->row_actions( $actions, true ) );

            case 'contact_info':
                $email = get_post_meta( $item->ID, 'contact_email', true );
                $phone = get_post_meta( $item->ID, 'contact_phone', true );
                return sprintf( '<a href="mailto:%s">%s</a><br><span class="description">%s</span>', esc_attr( $email ), esc_html( $email ), esc_html( $phone ) );

            case 'subject':
                return esc_html( $item->post_title );

            case 'message':
                return sprintf( '<p style="white-space: pre-wrap; margin:0; line-height: 1.5; color: #334155; font-size: 12px;">%s</p>', esc_html( $item->post_content ) );

            case 'date':
                return esc_html( get_the_date( 'd.m.Y H:i', $item->ID ) );

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
     * Query and load current contact message payload.
     */
    public function prepare_items() {
        $per_page = 15;
        $current_page = $this->get_pagenum();

        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array( $columns, $hidden, $sortable );

        // Dynamic arguments based on Search
        $args = array(
            'post_type'      => 'emmasco_contact',
            'posts_per_page' => $per_page,
            'paged'          => $current_page,
            'post_status'    => 'publish',
        );

        $orderby = isset( $_GET['orderby'] ) ? sanitize_sql_orderby( $_GET['orderby'] ) : 'id';
        $order = isset( $_GET['order'] ) && strtolower( $_GET['order'] ) === 'asc' ? 'ASC' : 'DESC';

        if ( $orderby === 'contact_name' ) {
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
