<?php
/**
 * Emmasco Reinigungsteam Functions and Definitions
 *
 * @package Emmasco_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/* ==========================================================================
   1. THEME SUPPORT & SETUP
   ========================================================================== */
function emmasco_theme_setup() {
	// Enable automatic title tag management
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails on posts and pages
	add_theme_support( 'post-thumbnails' );

	// Enable HTML5 markup support
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );

	// Register Navigation Menus
	register_nav_menus( array(
		'primary-menu' => esc_html__( 'Primary Header Menu', 'emmasco-theme' ),
		'footer-menu'  => esc_html__( 'Footer Quick Links Menu', 'emmasco-theme' ),
	) );
}
add_action( 'after_setup_theme', 'emmasco_theme_setup' );


/* ==========================================================================
   2. ENQUEUE STYLES AND SCRIPTS
   ========================================================================== */
function emmasco_theme_scripts() {
	// Enqueue Google Fonts (Inter & Poppins)
	wp_enqueue_style( 'emmasco-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&display=swap', array(), null );

	// Enqueue Main Theme Stylesheet
	wp_enqueue_style( 'emmasco-main-style', get_stylesheet_uri(), array(), '1.0.0' );

	// Enqueue Custom JS Theme Script
	wp_enqueue_script( 'emmasco-theme-js', get_template_directory_uri() . '/assets/js/theme.js', array( 'jquery' ), '1.0.0', true );

	// Localize dynamic WP parameters for our JS booking/contact engine
	wp_localize_script( 'emmasco-theme-js', 'emmasco_ajax', array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'emmasco-security-nonce' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'emmasco_theme_scripts' );


/* ==========================================================================
   3. AUTOMATIC DATABASE SETUP FOR BOOKINGS & INQUIRIES
   ========================================================================== */
function emmasco_theme_install_db_tables() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();

	// 1. Table for Bookings
	$table_bookings = $wpdb->prefix . 'emmasco_bookings';
	$sql_bookings = "CREATE TABLE $table_bookings (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		customer_name varchar(100) NOT NULL,
		email varchar(100) NOT NULL,
		phone varchar(50) NOT NULL,
		address text NOT NULL,
		service_id varchar(50) NOT NULL,
		service_name varchar(100) NOT NULL,
		booking_date date NOT NULL,
		booking_time varchar(20) NOT NULL,
		notes text,
		total_price decimal(10,2) NOT NULL,
		status varchar(30) DEFAULT 'pending' NOT NULL,
		created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

	// 2. Table for Contact Messages
	$table_contacts = $wpdb->prefix . 'emmasco_contacts';
	$sql_contacts = "CREATE TABLE $table_contacts (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name varchar(100) NOT NULL,
		email varchar(100) NOT NULL,
		phone varchar(50) DEFAULT NULL,
		subject varchar(200) NOT NULL,
		message text NOT NULL,
		created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql_bookings );
	dbDelta( $sql_contacts );

	// Seed dummy bookings if empty to map the default high-fidelity experience
	$count = $wpdb->get_var( "SELECT COUNT(*) FROM $table_bookings" );
	if ( (int) $count === 0 ) {
		$wpdb->insert( $table_bookings, array(
			'customer_name' => 'Regina Keller',
			'email'          => 'r.keller@web.de',
			'phone'          => '0304729103',
			'address'       => 'Kollwitzstraße 14, 10435 Berlin',
			'service_id'    => 'alltagsbegleitung',
			'service_name'  => 'Alltagsbegleitung',
			'booking_date'  => date( 'Y-m-d', strtotime( '+2 days' ) ),
			'booking_time'  => '14:00',
			'notes'         => 'Begleitung zum Hausarzt und anschließender kleiner Einkauf.',
			'total_price'   => 58.00,
			'status'        => 'confirmed'
		) );
		$wpdb->insert( $table_bookings, array(
			'customer_name' => 'Dr. Michael Wagner',
			'email'          => 'info@praxis-wagner.de',
			'phone'          => '01729384729',
			'address'       => 'Schönhauser Allee 82, 10439 Berlin',
			'service_id'    => 'buero',
			'service_name'  => 'Büroreinigung',
			'booking_date'  => date( 'Y-m-d', strtotime( '+3 days' ) ),
			'booking_time'  => '18:30',
			'notes'         => 'Regelmäßige Praxisreinigung wöchentlich. Schlüsselbox vorhanden.',
			'total_price'   => 119.70,
			'status'        => 'confirmed'
		) );
	}
}
// Run database script on theme activation
add_action( 'after_switch_theme', 'emmasco_theme_install_db_tables' );


/* ==========================================================================
   4. AJAX SERVICE INQUIRY AND CONTACT PROCESSING
   ========================================================================== */
function emmasco_ajax_book_handler() {
	check_ajax_referer( 'emmasco-security-nonce', 'security' );

	global $wpdb;
	$table_name = $wpdb->prefix . 'emmasco_bookings';

	// Sanitize form inputs
	$name       = sanitize_text_field( $_POST['customerName'] );
	$email      = sanitize_email( $_POST['email'] );
	$phone      = sanitize_text_field( $_POST['phone'] );
	$address    = sanitize_textarea_field( $_POST['address'] );
	$service_id = sanitize_text_field( $_POST['serviceId'] );
	$date       = sanitize_text_field( $_POST['date'] );
	$time       = sanitize_text_field( $_POST['time'] );
	$notes      = sanitize_textarea_field( $_POST['notes'] );

	// Calculate prices dynamically based on actual business rates
	$prices = array(
		'haushaltshilfe'     => 29.90,
		'reinigung'          => 34.90,
		'einkaufshilfe'      => 28.50,
		'alltagsbegleitung'  => 29.00,
		'angehoerige'        => 31.50,
		'fenster'            => 45.00,
		'buero'              => 39.90,
		'deepclean'          => 44.95,
	);
	$service_names = array(
		'haushaltshilfe'     => 'Haushaltshilfe',
		'reinigung'          => 'Unterhaltsreinigung',
		'einkaufshilfe'      => 'Einkaufshilfe',
		'alltagsbegleitung'  => 'Alltagsbegleitung',
		'angehoerige'        => 'Entlastung für Angehörige',
		'fenster'            => 'Fensterreinigung',
		'buero'              => 'Büroreinigung',
		'deepclean'          => 'Deep Cleaning (Frühjahrsputz)',
	);

	$service_rate  = isset( $prices[ $service_id ] ) ? $prices[ $service_id ] : 29.90;
	$service_name  = isset( $service_names[ $service_id ] ) ? $service_names[ $service_id ] : 'Haushaltshilfe';
	$total_price   = $service_rate * 2; // Default mock 2 hours or base visitation

	// Insert into local Hostinger MySQL database
	$inserted = $wpdb->insert( $table_name, array(
		'customer_name' => $name,
		'email'         => $email,
		'phone'         => $phone,
		'address'       => $address,
		'service_id'    => $service_id,
		'service_name'  => $service_name,
		'booking_date'  => $date,
		'booking_time'  => $time,
		'notes'         => $notes,
		'total_price'   => $total_price,
		'status'        => 'pending'
	) );

	if ( $inserted ) {
		$booking_id = $wpdb->insert_id;
		$invoice_no = 'RE-2026-' . strtoupper( dechex( $booking_id ) );

		// Send e-mail confirmation to Admin and customer
		$admin_email = get_option( 'admin_email' );
		$subject = 'Neue Buchungsanfrage #' . $booking_id . ' von ' . $name;
		$message = "Eine neue Buchung wurde über die Website getätigt:\n\n" .
		           "Kunde: $name\n" .
		           "E-Mail: $email\n" .
		           "Mobilnr.: $phone\n" .
		           "Adresse: $address\n" .
		           "Dienstleistung: $service_name\n" .
		           "Datum/Uhrzeit: $date um $time Uhr\n" .
		           "Betrag: " . number_format( $total_price, 2 ) . " €\n" .
		           "Notiz: $notes\n\n" .
		           "Bitte loggen Sie sich ins WordPress-Backend ein, um diese Anfrage zu verarbeiten.";

		wp_mail( $admin_email, $subject, $message );

		wp_send_json_success( array(
			'message'     => 'Buchung erfolgreich eingetragen.',
			'booking_id'  => $booking_id,
			'invoice_no'  => $invoice_no,
			'total_price' => $total_price,
			'date'        => date( 'd.m.Y', strtotime( $date ) )
		) );
	} else {
		wp_send_json_error( array( 'message' => 'Fehler beim DB-Eintrag.' ) );
	}
}
add_action( 'wp_ajax_emmasco_book', 'emmasco_ajax_book_handler' );
add_action( 'wp_ajax_nopriv_emmasco_book', 'emmasco_ajax_book_handler' );


function emmasco_ajax_contact_handler() {
	check_ajax_referer( 'emmasco-security-nonce', 'security' );

	global $wpdb;
	$table_name = $wpdb->prefix . 'emmasco_contacts';

	$name    = sanitize_text_field( $_POST['name'] );
	$email   = sanitize_email( $_POST['email'] );
	$phone   = sanitize_text_field( $_POST['phone'] );
	$subject = sanitize_text_field( $_POST['subject'] );
	$msg     = sanitize_textarea_field( $_POST['message'] );

	$inserted = $wpdb->insert( $table_name, array(
		'name'    => $name,
		'email'   => $email,
		'phone'   => $phone,
		'subject' => $subject,
		'message' => $msg
	) );

	if ( $inserted ) {
		$admin_email = get_option( 'admin_email' );
		$email_subject = 'Neue Kontaktanfrage: ' . $subject;
		$email_body = "Neue Nachricht von $name ($email, Tel: $phone):\n\n" .
		              "Betreff: $subject\n" .
		              "Nachricht:\n$msg";

		wp_mail( $admin_email, $email_subject, $email_body );
		wp_send_json_success( array( 'message' => 'Ihre Nachricht wurde erfolgreich gesendet!' ) );
	} else {
		wp_send_json_error( array( 'message' => 'Senden fehlgeschlagen.' ) );
	}
}
add_action( 'wp_ajax_emmasco_contact', 'emmasco_ajax_contact_handler' );
add_action( 'wp_ajax_nopriv_emmasco_contact', 'emmasco_ajax_contact_handler' );


/* ==========================================================================
   5. BACKEND WP CUSTOM ADMIN PANEL
   ========================================================================== */
function emmasco_add_admin_pages() {
	add_menu_page(
		'EMMASCO Admin',
		'EMMASCO Bookings',
		'manage_options',
		'emmasco-bookings',
		'emmasco_render_admin_bookings',
		'dashicons-clipboard',
		6
	);
}
add_action( 'admin_menu', 'emmasco_add_admin_pages' );

function emmasco_render_admin_bookings() {
	global $wpdb;
	$table_bookings = $wpdb->prefix . 'emmasco_bookings';
	$table_contacts = $wpdb->prefix . 'emmasco_contacts';

	// Handle Status change operations
	if ( isset( $_GET['action'], $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		if ( $_GET['action'] === 'confirm' ) {
			$wpdb->update( $table_bookings, array( 'status' => 'confirmed' ), array( 'id' => $id ) );
		} elseif ( $_GET['action'] === 'cancel' ) {
			$wpdb->update( $table_bookings, array( 'status' => 'cancelled' ), array( 'id' => $id ) );
		} elseif ( $_GET['action'] === 'delete' ) {
			$wpdb->delete( $table_bookings, array( 'id' => $id ) );
		}
	}

	$bookings = $wpdb->get_results( "SELECT * FROM $table_bookings ORDER BY created_at DESC" );
	$contacts = $wpdb->get_results( "SELECT * FROM $table_contacts ORDER BY created_at DESC" );
	?>
	<div class="wrap" style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 1200px;">
		<h1 style="font-size: 24px; font-weight: 800; color: #0056D6; margin-bottom: 25px;">
			EMMASCO REINIGUNGSTEAM - Admin Dashboard
		</h1>

		<!-- Cards Dashboard Grid -->
		<div style="display: flex; gap: 20px; margin-bottom: 30px;">
			<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); flex: 1;">
				<h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94A3B8;">Aktive Buchungen</h3>
				<p style="font-size: 32px; font-weight: 800; margin: 10px 0 0 0; color: #0056D6;">
					<?php echo count($bookings); ?> Real-time
				</p>
			</div>
			<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); flex: 1;">
				<h3 style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94A3B8;">Kontaktanfragen</h3>
				<p style="font-size: 32px; font-weight: 800; margin: 10px 0 0 0; color: #2FB5FF;">
					<?php echo count($contacts); ?> Nachrichten
				</p>
			</div>
		</div>

		<!-- Bookings Table Section -->
		<h2 style="font-weight: 700; margin-top: 40px; color: #1E293B;">Verwalte Service-Termine</h2>
		<table class="wp-list-table widefat fixed striped table-view-list" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
			<thead>
				<tr>
					<th>ID</th>
					<th>Kunde</th>
					<th>Kontakt</th>
					<th>Adresse</th>
					<th>Dienstleistung</th>
					<th>Datum & Zeit</th>
					<th>Preis</th>
					<th>Status</th>
					<th>Aktion</th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $bookings ) ) : ?>
					<tr><td colspan="9">Keine Buchungen vorhanden.</td></tr>
				<?php else : ?>
					<?php foreach ( $bookings as $b ) : ?>
						<tr>
							<td><strong>#<?php echo esc_html( $b->id ); ?></strong></td>
							<td><strong><?php echo esc_html( $b->customer_name ); ?></strong></td>
							<td><?php echo esc_html( $b->email ); ?><br><span style="color: grey;"><?php echo esc_html( $b->phone ); ?></span></td>
							<td><?php echo esc_html( $b->address ); ?></td>
							<td>
								<span style="background: #E0F2FE; color: #0369A1; font-weight: 800; font-size: 10px; display: inline-block; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
									<?php echo esc_html( $b->service_name ); ?>
								</span>
							</td>
							<td><?php echo esc_html( $b->booking_date ); ?> um <?php echo esc_html( $b->booking_time ); ?></td>
							<td><strong><?php echo esc_html( number_format($b->total_price, 2) ); ?> €</strong></td>
							<td>
								<?php if ( $b->status === 'confirmed' ) : ?>
									<span style="background: #DCFCE7; color: #166534; font-weight: bold; padding: 2px 6px; border-radius: 4px;">Bestätigt</span>
								<?php elseif ( $b->status === 'cancelled' ) : ?>
									<span style="background: #FEE2E2; color: #991B1B; font-weight: bold; padding: 2px 6px; border-radius: 4px;">Abgesagt</span>
								<?php else : ?>
									<span style="background: #FEF3C7; color: #92400E; font-weight: bold; padding: 2px 6px; border-radius: 4px;">Ausstehend</span>
								<?php endif; ?>
							</td>
							<td>
								<?php if ($b->status === 'pending') : ?>
									<a href="?page=emmasco-bookings&action=confirm&id=<?php echo $b->id; ?>" class="button button-primary button-small" style="background:#166534; border:0;">Bestätigen</a>
								<?php endif; ?>
								<a href="?page=emmasco-bookings&action=cancel&id=<?php echo $b->id; ?>" class="button button-secondary button-small" style="background:#991B1B; color:white; border:0;">Absagen</a>
								<a href="?page=emmasco-bookings&action=delete&id=<?php echo $b->id; ?>" class="button button-small" onclick="return confirm('Möchten Sie diese Buchung löschen?')" style="background:#64748B; color:white; border:0;">Löschen</a>
							</td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>

		<!-- Inquiries Section -->
		<h2 style="font-weight: 700; margin-top: 50px; color: #1E293B;">Eingegangene Kontakt-Mitteilungen</h2>
		<table class="wp-list-table widefat fixed striped table-view-list" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>E-Mail / Tel.</th>
					<th>Betreff</th>
					<th>Mitteilung</th>
					<th>Gesendet am</th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $contacts ) ) : ?>
					<tr><td colspan="6">Keine Kontaktanfragen vorhanden.</td></tr>
				<?php else : ?>
					<?php foreach ( $contacts as $c ) : ?>
						<tr>
							<td>#<?php echo esc_html( $c->id ); ?></td>
							<td><strong><?php echo esc_html( $c->name ); ?></strong></td>
							<td><?php echo esc_html( $c->email ); ?><br><?php echo esc_html( $c->phone ); ?></td>
							<td><strong><?php echo esc_html( $c->subject ); ?></strong></td>
							<td><p style="white-space: pre-wrap; margin:0; line-height: 1.4; color: #334155;"><?php echo esc_html( $c->message ); ?></p></td>
							<td><?php echo esc_html( $c->created_at ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}
