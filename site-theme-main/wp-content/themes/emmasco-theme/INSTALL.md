# INSTALLATION & ARCHITECTURE GUIDE
## EMMASCO REINIGUNGSTEAM - WordPress Production-Grade Framework

This guide outlines the system architecture, security structures, database schemas, and migration mechanics compiled for **EMMASCO REINIGUNGSTEAM**.

---

## 1. Directory Structure

The theme files are modularized according to strict object-oriented, clean-separation principles:

```text
wp-content/themes/emmasco-theme/
├── INSTALL.md                      # Complete system & installation architecture manual
├── Functions.php                   # Core theme setup and bootloader imports
├── Style.css                       # Element stylesheets
├── Inc/
│   ├── Database-migration.php     # Options tables & custom index installer
│   ├── Security.php                # Honeypot, dynamic rate limiters & CPT registers
│   ├── Enqueue.php                 # Stylesheet dependencies, scripts and nonces
│   ├── Api.php                     # Price catalogs caching & dynamic CSV export post handlers
│   ├── Ajax/
│   │   ├── Booking-handler.php     # Public AJAX bookings receiver
│   │   ├── Contact-handler.php     # Public AJAX messages receiver
│   │   └── Invoice-handler.php     # Secure Client & Administrative invoice payload queries
│   └── Admin/
│       ├── Class-emmasco-admin-controller.php    # Parent administrative hub & settings API
│       ├── Class-emmasco-bookings-list-table.php # Bookings WP_List_Table controller
│       ├── Class-emmasco-invoices-list-table.php # Invoices WP_List_Table controller
│       └── Class-emmasco-contacts-list-table.php # Contacts/Messages WP_List_Table controller
└── Assets/
    ├── Css/
    │   └── App.css                 # Consolidated frontend Tailwind directives
    └── Js/
        ├── Translations.js         # Multilingual translation dictionaries (FR/EN/DE)
        ├── Calculator.js           # Live interactive cost estimations engine
        ├── Invoices.js             # Client-side pdf compiler utilizing jsPDF library
        ├── Booking.js              # Booking controller
        └── App.js                  # Master orchestration layer
```

---

## 2. Core Security Hardening Layer

1. **Anti-CSRF Tokens**: All client-side Ajax actions and admin-side state mutations are validated against cryptographic nonces created dynamically utilizing `wp_create_nonce('emmasco-security-nonce')`, verified via WP default structures.
2. **Access & Capabilities**: Execution of administrative actions (Confirm, Cancel, Delete, CSV Exports, Custom settings triggers) is guarded strictly under `current_user_can('manage_options')` checks.
3. **Database Guardrails (Escape & Sanitize)**: Every single parameter retrieved via request scopes is sanitized using precise WordPress sanitization wrappers (`sanitize_text_field`, `sanitize_email`, `sanitize_key`, `sanitize_textarea_field`). All HTML outputs are escaped using `esc_html`, `esc_attr`, or `esc_url`.
4. **Flood Rate-Limiter**: Spammable request routes apply transient keys indexed dynamically on user IP addresses, blocking clients from performing more than 4 form completions in 60 seconds (returns HTTP Status Code `429`).
5. **Anti-Bot Honeypot**: Form structures include an invisible field (`honey_pot`). If spambots complete this field, execution halts silently, returning success payload parameters to effectively confuse the automatic bot systems.

---

## 3. Database Schema Overview

We map booking metadata, messages, and invoices inside the WordPress core database cleanly utilizing custom metadata tables, ensuring full-integrity, compatibility with Astra or other core child architectures, and seamless indexing.

### A. Bookings CPT (`emmasco_booking`)
Stores pending or confirmed service client appointments.
* Meta variables:
  * `customer_name` (Text)
  * `email` (Sanitized email string)
  * `phone` (Cleaned text string)
  * `address` (Text)
  * `service_id` (Lookup index)
  * `service_name` (Label)
  * `booking_date` (Date)
  * `booking_time` (Time reference)
  * `total_price` (Decimal float value)
  * `status` (`pending` | `confirmed` | `cancelled`)

### B. Invoices CPT (`emmasco_invoice`)
Tracks client invoicing records permanently in the central administrative ledger.
* Meta variables:
  * `invoice_no` (Unique sequential identifier formatted as `EMMA-YYYYMMDD-ID`)
  * `booking_id` (Mapped appointment identifier)
  * `customer_name` (Text)
  * `email` (Text)
  * `phone` (Text)
  * `address` (Text)
  * `service_name` (Text)
  * `total_price` (Decimal float value)
  * `invoice_date` (Date formatted text string)

### C. Contact messages CPT (`emmasco_contact`)
Holds customer inquiries compiled through standard frontend query portals.
* Fields:
  * Title (`post_title` -> Inquiry Subject)
  * Content (`post_content` -> Message Body)
* Meta variables:
  * `contact_name` (Sender Name)
  * `contact_email` (Sender Email)
  * `contact_phone` (Sender Phone)

---

## 4. Administrative Hub Controls

The admin center has been divided into five custom submenus:

1. **Dashboard (Analytics)**: Renders live summary blocks featuring total revenues (confirmed vs. pending estimations), message volumes, active bookings, recent activity logs, and secure dynamic links to export CSV collections.
2. **Bookings (`WP_List_Table`)**: Comprehensive datatable with complete pagination, full-text keyword searches, dropdown filter tools, bulk and action rows (Confirm / Cancel / Delete) guarded by nonces.
3. **Invoices (`WP_List_Table`)**: Displays permanent transactional invoices with row-triggers to fetch JSON parameters and generate elegant Client-side PDFs dynamically using jsPDF.
4. **Nachrichten (`WP_List_Table`)**: Displays contact letters with quick actions to safely remove processed queries.
5. **Einstellungen**: Dynamic configuration panel to manage core base hourly rates for services, default Support WhatsApp dispatchers, and invoice serial formatting prefixes.

---

## 5. Deployment Procedures

1. **Migration Seeding**: Upon initial activation, the database migration layer automatically imports standard rate definitions, seeds defaults into `wp_options` under `'emmasco_service_catalog'`, and configures system capabilities.
2. **Rewrite Rules flushing**: The system auto-detects theme activation switches, flushes routing directories, and updates rewrite links cleanly in the background. No manual steps are needed.
3. **Dynamic Customizations**: Changing an hourly price in the settings tab refreshes calculations across the static public price charts, booking page modules, and invoice systems. Keep cached transients clear using the Save buttons.
