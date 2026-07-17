/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Testimonial, FAQItem, BlogArticle } from './types';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  blogArticles: BlogArticle[];
  timelineEvents: Array<{ year: string; title: string; text: string }>;
  teamMembers: Array<{ name: string; role: string; bio: string; image: string }>;
  companyValues: Array<{ title: string; text: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<Language, Record<string, string>> = {
  de: {
    // Topbar & Header
    'topbar.phone': '0176 21856044',
    'topbar.address': 'Schönhauser Allee 163, 10435 Berlin',
    'topbar.accreditation': 'Pflegekassen-Zulassung §45a SGB XI',
    'topbar.insured': '✔ 100% Versichert',
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.services': 'Leistungen',
    'nav.blog': 'Ratgeber & Blog',
    'nav.contact': 'Kontakt',
    'nav.documents': 'Dokumentencenter',
    'nav.login_client': 'Kunden-Login',
    'nav.login_admin': 'Admin',
    'nav.my_portal': 'Mein Portal',
    'nav.admin_portal': 'Admin Portal',
    'nav.logout': 'Abmelden',
    'nav.imprint': 'Impressum',
    'nav.book': 'Online Buchen',
    'nav.book_short': 'Buchen',
    'nav.menu_label': 'Menü einblenden',

    // Hero / Home Main
    'hero.badge': 'Staatlich anerkannt nach § 45a SGB XI',
    'hero.title_part1': 'Unterstützung im Alltag, ',
    'hero.title_part2': 'auf die Sie sich verlassen können',
    'hero.subtitle': 'Haushaltsnahe Dienstleistungen und Alltagsbegleitung mit Herz und Verlässlichkeit. Erhalten Sie Ihre Selbstständigkeit im eigenen Zuhause.',
    'hero.button_call': 'Anrufen',
    'hero.button_consult': 'Kostenlose Beratung',

    // Home Badges / Trust Info
    'trust.accreditation_title': 'Anerkannt nach §45a SGB XI',
    'trust.accreditation_desc': 'Direktabrechnung des Entlastungsbetrags mit allen Pflegekassen möglich.',
    'trust.insured_title': 'Versicherte Leistungen',
    'trust.insured_desc': 'Vollständiger Schutz bei Personen-, Sach- und Schlüsselverlustschäden.',
    'trust.certified_title': 'Zertifiziert & Geprüft',
    'trust.certified_desc': 'Kontinuierliche Qualitätssicherung nach deutschen Zulassungsrichtlinien.',
    'trust.team_title': 'Professionelles Team',
    'trust.team_desc': 'Erfahrene, polizeilich geprüfte und festangestellte Kräfte aus Berlin.',

    // Home Section Headers
    'services.badge': 'Hunderte glückliche Haushalte in Berlin',
    'services.title': 'Unsere Leistungen im Überblick',
    'services.subtitle': 'Hauseigene Qualitätsgarantie für Ihre Zufriedenheit.',
    'services.rate_label': 'Abrechnung & Preis',
    'services.details_btn': 'Kostenloses Angebot anfordern',
    'services.popular_badge': 'Beliebt',

    // Why Us
    'why.badge': 'Unsere Qualitätsgarantie',
    'why.title': 'Warum das EMMASCO Reinigungsteam?',
    'why.subtitle': 'Wir sorgen für Verlässlichkeit, Pünktlichkeit und Herzlichkeit im Alltag.',
    'why.item1.title': 'Absolut Zuverlässig',
    'why.item1.desc': 'Wir halten uns strikt an vereinbarte Tage und Uhrzeiten.',
    'why.item2.title': 'Pünktlich & Exakt',
    'why.item2.desc': 'Ihr Haushaltsplan wird lückenlos und pünktlich realisiert.',
    'why.item3.title': 'Freundlich mit Herz',
    'why.item3.desc': 'Einfühlsames Auftreten und ein offenes Ohr für alle Sorgen.',
    'why.item4.title': 'Transparente Preise',
    'why.item4.desc': 'Keine überraschenden Pauschalen. Faire Stundensätze.',

    // Stats
    'stats.clients': '500+',
    'stats.clients_label': 'Aktive Kunden',
    'stats.clients_sub': 'In ganz Berlin versorgt',
    'stats.satisfaction': '95%',
    'stats.satisfaction_label': 'Zufriedenheit',
    'stats.satisfaction_sub': 'Laut Kundenumfrage 2025',
    'stats.support': '24h',
    'stats.support_label': 'Support',
    'stats.support_sub': 'Für Notfälle erreichbar',

    // Quality quote
    'quote.badge': 'Qualitätsversprechen',
    'quote.text': '"Bei EMMASCO geht es nicht nur um saubere Böden, sondern darum, Lebensqualität und Würde im eigenen Heim zu wahren. Jeder unserer Mitarbeiter durchläuft ein gründliches Auswahlverfahren und verinnerlicht unsere Werte."',
    'quote.author': '— Emma Osei, Gründerin',

    // Results / Gallery
    'gallery.badge': 'Sichtbarer Erfolg',
    'gallery.title': 'Unsere Ergebnisse überzeugen',
    'gallery.subtitle': 'Bilder aus echten Berliner Haushalten vor und nach unserem Einsatz.',
    'gallery.before': 'Vorher',
    'gallery.after': 'Nachher / Glänzend',

    // Testimonials
    'testimonials.badge': 'Kundenstimmen',
    'testimonials.title': 'Was unsere Kunden sagen',

    // FAQs
    'faq.badge': 'Häufige Fragen',
    'faq.title': 'Fragen & Antworten (FAQ)',
    'faq.subtitle': 'Hier finden Sie Antworten auf die wichtigsten Fragen zur Erstattung und Buchung.',

    // CTA
    'cta.badge': 'Kostenloses Angebot',
    'cta.title': 'Lassen Sie uns Ihnen im Alltag unter die Arme greifen!',
    'cta.subtitle': 'Kontaktieren Sie uns für eine kostenfreie Erstberatung bezüglich der Abrechnung mit der Pflegekasse.',
    'cta.book_btn': 'Online Termin buchen',
    'cta.email_btn': 'E-Mail schreiben',

    // About Page Specific
    'about.badge': 'Berliner Familienunternehmen',
    'about.title': 'Wer wir sind & Was uns antreibt',
    'about.subtitle': 'Lernen Sie das EMMASCO Reinigungsteam kennen. Wir bringen Glanz in Ihr Haus und Herzlichkeit in Ihren Alltag.',
    'about.story_title': 'Unsere Geschichte: Pflege & Reinigung vereint',
    'about.story_p1': 'Die Idee hinter dem EMMASCO Reinigungsteam entstand direkt in Berlin aus einem ganz persönlichen Bedürfnis heraus. Die Gründerin Emma Osei erlebte im eigenen Familienkreis, wie schwer es für pflegebedürftige Angehörige ist, den Haushalt eigenständig zu führen und gleichzeitig qualifizierte, herzliche Unterstützung zu finden.',
    'about.story_p2': 'Oftmals gab es entweder reine Reinigungsfirmen, denen das Gespür für Senioren fehlte, oder klassische Pflegedienste, bei denen die gemütliche Zuwendung im Alltag und die sorgfältige Reinigung der Wohnung aus Zeitnot zu kurz kamen.',
    'about.story_p3': '"Wir wollten diese Lücke schließen," berichtet Emma Osei. "Jeder Mensch hat es verdient, in einem glänzenden, frischen Zuhause zu leben und gleichzeitig eine Begleitung an der Seite zu haben, die mit echter Empathie zuhört, spazieren geht und im Alltag hilft."',
    'about.story_p4': 'Heute ist EMMASCO ein staatlich geprüfter und anerkannter Dienstleister im Rahmen von § 45a SGB XI mit Sitz in Prenzlauer Berg, engagierten Mitarbeitern und über 500 zufriedenen Stammkunden in ganz Berlin.',
    'about.quote_text': '"Für uns ist Ihre Wohnung nicht einfach nur eine Adresse. Es ist Ihr schützender Lebensraum, in dem Respekt, Sauberkeit und Fröhlichkeit regieren sollten."',
    'about.quote_author': '— Das EMMASCO-Leitbild',
    'about.mission_title': 'Unsere Mission',
    'about.mission_text': 'Pflegebedürftigen Menschen und vielbeschäftigten Privat- oder Gewerbekunden eine Sorge im Alltag abzunehmen. Wir erschaffen hygienisch reine Räume und schenken pflegebedürftigen Senioren ihre Lebensfreude und Selbstbestimmung zurück.',
    'about.vision_title': 'Unsere Vision',
    'about.vision_text': 'Der verlässlichste Ansprechpartner für haushaltsnahe Dienste in Berlin zu werden – bekannt für absolute Diskretion, überlegene Reinigungsqualität und spürbar liebevolle Pflegealltags-Entlastung.',
    'about.cert_title': 'Offizielles Kassenzertifikat',
    'about.cert_text': 'Zugelassen und registriert bei der zuständigen Behörde in Berlin. Wir rechnen den Entlastungsbetrag (§45a SGB XI) für alle Pflegegrade direkt über das landesrechtlich zertifizierte Verfahren ab.',
    'about.cert_num': '■ Registrierungsnummer: BE-SGB11-45A-2022',
    'about.cert_region': '■ Geltungsbereich: Ganzes Stadtgebiet Berlin',
    'about.values_badge': 'Wofür wir stehen',
    'about.values_title': 'Unsere gelebten Werte',
    'about.team_badge': 'Das Team hinter dem Glanz',
    'about.team_title': 'Unsere Geschäftsführung & Leitung',
    'about.team_subtitle': 'Kompetente Profis mit Herzblut sorgen für Ihre optimale Unterstützung im Berliner Großstadtdschungel.',
    'about.timeline_badge': 'Chronik',
    'about.timeline_title': 'Unser bisheriger Meilensteinweg',
    'about.founder_badge': 'Unsere Gründergeschichte',
    'about.founder_title': 'Die Geschichte unseres Gründers',
    'about.founder_heading': 'Mehr als ein Reinigungsdienst — Eine Geschichte der Fürsorge',
    'about.founder_p1': 'Mein Name ist Emmanuel Isodje, und ich habe das Emmasco ReinigungsTeam UG im Mai 2025 gegründet – nur wenige Tage nach dem Tod meiner geliebten Mutter im Alter von 93 Jahren.',
    'about.founder_p2': 'In den letzten Tagen ihres Lebens wurde meine Mutter schwer krank. Diese schwierige und emotionale Zeit hat mir gezeigt, wie wertvoll es ist, fürsorgliche Menschen in der Nähe zu haben – Menschen, die praktische Unterstützung, Trost und Gesellschaft bieten, wenn jeder Augenblick zählt. In diesen intensiven Tagen der Trauer und des Nachdenkens wurde der Grundstein für das Emmasco ReinigungsTeam gelegt.',
    'about.founder_p3': 'Mir wurde klar, dass ein sauberes, ordentliches und hygienisches Zuhause nicht nur eine Frage der Ästhetik ist – es geht darum, Seelenfrieden zu schenken, die Würde zu bewahren und unseren Lieben einen sicheren Rückzugsort zu bieten. Wir sind mehr als nur ein Reinigungsdienst; wir sind ein engagierter Partner, der Familien in ganz Berlin Fürsorge, Wärme und professionelle Zuverlässigkeit bringt.',
    'about.founder_p4': 'Jedes Mitglied unseres Teams ist sorgfältig geprüft und teilt unsere Mission, Ihr Zuhause mit demselben Respekt und derselben liebevollen Fürsorge zu behandeln, die wir unseren eigenen Familien entgegenbringen würden. Wir sind stolz darauf, Ihnen zu dienen und Ihnen dabei zu helfen, Ihre Unabhängigkeit und Ihren Komfort zu bewahren.',

    // Services Page Specific
    'services.page.banner_badge': 'Ausführliches Leistungsportfolio',
    'services.page.banner_title': 'Unsere Leistungen & Preise',
    'services.page.banner_subtitle': 'Flexible Unterstützung für Ihr Zuhause. Transparent kalkuliert und erstklassig ausgeführt. Viele Angebote sind zu 100% kassenfinanziert.',
    'services.page.search_placeholder': 'Leistungen durchsuchen...',
    'services.page.popular_badge': 'Beste Wahl',
    'services.page.reimbursement': 'Verrechnung',
    'services.page.care_level': 'Pflegegrad',
    'services.page.care_reimbursed': '100% Kasse',
    'services.page.brochure': 'Info-Broschüre',
    'services.page.book_direct': 'Jetzt Buchen',
    'services.page.modal_title': 'Kostenlose Beratung anfordern',
    'services.page.modal_subtitle': 'Bitte füllen Sie das kurze Formular aus. Unser Team aus Berlin-Prenzlauer Berg meldet sich werktags innerhalb von 2 Stunden bei Ihnen.',
    'services.page.modal_phone_label': 'Telefonnummer für Rückruf',
    'services.page.modal_preferred_time': 'Wunschzeit für das Telefonat',
    'services.page.modal_notes_label': 'Welche Unterstützung benötigen Sie vorrangig?',
    'services.page.modal_submit': 'Kostenloses Infogespräch buchen',
    'services.page.modal_close': 'Schließen',
    'services.page.direct_book_banner': 'Dieses Angebot passt perfekt zu Ihren Wünschen!',
    'services.page.direct_book_btn': 'DIREKT JETZT BUCHEN',

    // Booking Page Specific
    'booking.title': 'Termin anfragen & Buchen',
    'booking.subtitle': 'Haushaltsnahe Dienstleistungen & Alltagsbegleitung nach Wunschzeit. Kostenlos anfragen und direkt über die Pflegekasse oder privat abrechnen.',
    'booking.step1': 'Leistungsdetails',
    'booking.step2': 'Termin & Ort',
    'booking.step3': 'Kontaktdaten',
    'booking.service_label': 'Gewünschte Leistung',
    'booking.service_select': 'Bitte wählen Sie eine Leistung',
    'booking.billing_type_label': 'Abrechnungsmethode',
    'booking.billing_kasse': 'Abrechnung über Pflegekasse (§45a Entlastungsbetrag)',
    'booking.billing_privat': 'Selbstzahler / Privatabrechnung',
    'booking.notes_label': 'Wichtige Details oder Wünsche (z.B. Haustiere vorhanden, besondere Reinigungsmittel)',
    'booking.date_label': 'Wunschdatum',
    'booking.time_label': 'Wunsch-Uhrzeit (ca.)',
    'booking.dur_label': 'Gewünschte Dauer (Std.)',
    'booking.dur_hours': 'Stunden',
    'booking.name_label': 'Ihr Name',
    'booking.email_label': 'Ihr E-Mail-Adresse',
    'booking.phone_label': 'Ihre Telefonnummer',
    'booking.address_label': 'Adresse (Straße, Hausnr., PLZ, Berlin)',
    'booking.btn_next': 'Weiter',
    'booking.btn_back': 'Zurück',
    'booking.btn_submit': 'Kostenlose Buchung absenden',
    'booking.success_title': 'Anfrage erfolgreich eingegangen!',
    'booking.success_p1': 'Herzlichen Dank für Ihre Anfrage! Ihr persönlicher Betreuungs- und Reinigungstermin wurde erfasst.',
    'booking.success_p2': 'Wir prüfen die Kapazitäten für Ihren Wunschtermin und rufen Sie innerhalb von 2 Stunden an, um alles zu bestätigen.',
    'booking.success_id': 'Ihre Buchungsnummer',
    'booking.btn_new': 'Weitere Buchung vornehmen',
    'booking.btn_portal': 'Im Kundenportal ansehen',
    'booking.guest_login_prompt': 'Wollen Sie Ihre Buchung verwalten? Geben Sie Ihre E-Mail ein um sich bequem im Kundenportal einzuloggen.',

    // Contact Page Specific
    'contact.banner_title': 'Kontaktieren Sie uns',
    'contact.banner_subtitle': 'Wir freuen uns auf Ihre Anfrage. Schnelle Rückmeldung und kostenlose Erstberatung direkt in Berlin.',
    'contact.form_title': 'Senden Sie uns eine Nachricht',
    'contact.form_name': 'Ihr Name',
    'contact.form_email': 'Ihre E-Mail-Adresse',
    'contact.form_phone': 'Ihre Telefonnummer',
    'contact.form_msg': 'Ihre Nachricht an uns',
    'contact.form_submit': 'Nachricht absenden',
    'contact.office_title': 'Firmensitz Berlin',
    'contact.office_address': 'Schönhauser Allee 163, 10435 Berlin',
    'contact.office_hours_title': 'Telefonische Servicezeiten',
    'contact.office_hours': 'Montag - Freitag: 08:30 - 18:00 Uhr',
    'contact.office_urgent': 'Notfälle (Bestandskunden): 24h besetzt',
    'contact.sgb_title': 'Direktabrechnung Berlin',
    'contact.sgb_text': 'Dank der Anerkennung nach §45a SGB XI übernehmen gesetzliche Kassen Berlin vollumfänglich die Beratung wie Dienstleistung. Gerne führen wir kostenfreie Erst-Infogespräche bei Ihnen Zuhause.',
    'contact.msg_sent_title': 'Nachricht erfolgreich übermittelt!',
    'contact.msg_sent_p': 'Vielen Dank für Ihre Kontaktaufnahme. Unser Berliner Team wird sich umgehend mit Ihnen in Verbindung setzen.',

    // Customer Portal / Dashboard Specific
    'customer.title': 'Willkommen im EMMASCO Kundenportal',
    'customer.subtitle': 'Verwalten Sie hier Ihre Termine, laden Sie Bescheinigungen für die Krankenkasse hoch und chatten Sie mit dem Support.',
    'customer.tab_appointments': 'Meine Termine',
    'customer.tab_docs': 'Dokumentencenter',
    'customer.tab_support': 'Support-Chat',
    'customer.tab_profile': 'Mein Profil',
    'customer.app_active': 'Aktive Haushalts- & Alltagsbegleitungen',
    'customer.app_no_app': 'Keine anstehenden Termine gefunden.',
    'customer.app_book_now': 'Jetzt neuen Termin anfragen',
    'customer.app_id': 'Buchungs-ID',
    'customer.app_service': 'Leistung',
    'customer.app_date_time': 'Datum / Uhrzeit',
    'customer.app_address': 'Einsatzort',
    'customer.app_status': 'Status',
    'customer.app_billing': 'Abrechnung',
    'customer.app_actions': 'Aktionen',
    'customer.app_status_pending': 'Wartet auf Bestätigung',
    'customer.app_status_confirmed': '✓ Bestätigt & Eingeplant',
    'customer.app_status_completed': 'Abgeschlossen',
    'customer.app_status_cancelled': 'Storniert',
    'customer.app_cancel_btn': 'Termin absagen',
    'customer.docs_title': 'Dokumente & Kassenbescheide',
    'customer.docs_subtitle': 'Laden Sie hier Ihren Pflegegradbeschnitt, Genehmigungen oder Rezepte hoch. Wir prüfen diese direkt für die Abrechnung.',
    'customer.docs_lbl_name': 'Akte / Dokument Name',
    'customer.docs_lbl_size': 'Größe',
    'customer.docs_lbl_date': 'Upload-Datum',
    'customer.docs_lbl_status': 'Status',
    'customer.docs_status_approved': '✓ Akzeptiert für Abrechnung',
    'customer.docs_status_pending': 'Wird geprüft',
    'customer.docs_status_rejected': 'Ungenügend / Bitte neu hochladen',
    'customer.docs_upload_area': 'Datei hierhin ziehen oder anklicken, um Dokument hochzuladen',
    'customer.docs_upload_sub': 'Unterstützt PDF, JPEG bis 5MB. Nur vertrauenswürdige Bescheinigungen hochladen.',
    'customer.chat_title': 'Direktkontakt zum Berliner Alltags-Support-Team',
    'customer.chat_subtitle': 'Wir halten engen Kontakt. Schreiben Sie uns bei spontanen Wünschen, Krankmeldungen oder Verspätungen.',
    'customer.chat_input_placeholder': 'Ihre Frage an unser Service-Team...',
    'customer.chat_send_btn': 'Senden',
    'customer.profile_title': 'Persönliche Stammdaten',
    'customer.profile_name': 'Vollständiger Name',
    'customer.profile_email': 'E-Mail',
    'customer.profile_phone': 'Telefonnummer',
    'customer.profile_address': 'Standard-Haushaltsadresse',
    'customer.profile_save_btn': 'Daten aktualisieren',
    'customer.login_card_title': 'Anmelden im Kundenportal',
    'customer.login_card_subtitle': 'Geben Sie Ihre E-Mail und Ihren Namen ein. Als Testnutzer können Sie jede beliebige E-Mail nutzen.',
    'customer.login_lbl_email': 'E-Mail-Adresse',
    'customer.login_lbl_name': 'Ihr Vor- & Nachname',
    'customer.login_btn': 'Anmelden / Portal betreten',
    'customer.login_demo_hint': 'Tipp: Loggen Sie sich mit w.schmidt@gmail.com ein, um bereits vordefinierte Termine und Akten im Portal zu betrachten!',

    // Admin Dashboard Specific
    'admin.title': 'EMMASCO Operations Central (Backend Admin)',
    'admin.subtitle': 'Planen und verwalten Sie Termine, erstellen Sie neue Dienstleistungen und veröffentlichen Sie Ratgeber-Blogbeiträge.',
    'admin.tab_appointments': 'Buchungsmanagement',
    'admin.tab_services': 'Dienstleistungsangebot',
    'admin.tab_blog': 'Ratgeber verfassen',
    'admin.app_title': 'Eingegangene Kundenanfragen & Buchungen',
    'admin.app_table_cust': 'Kunde',
    'admin.app_table_srv': 'Leistung / Preis',
    'admin.app_table_dt': 'Zeitpunkt',
    'admin.app_table_address': 'Adresse',
    'admin.app_table_status': 'Status',
    'admin.app_table_actions': 'Aktionen',
    'admin.app_action_confirm': 'Bestätigen',
    'admin.app_action_cancel': 'Absagen',
    'admin.app_action_delete': 'Löschen',
    'admin.srv_title': 'Dienstleistungen im Live-Katalog verwalten',
    'admin.srv_add_btn': 'Neue Leistung anlegen',
    'admin.srv_lbl_title': 'Name der Dienstleistung',
    'admin.srv_lbl_cat': 'Kategorie',
    'admin.srv_lbl_desc': 'Kurzbeschreibung (Home Grid)',
    'admin.srv_lbl_det': 'Ausführliche Detailbeschreibung (Services Seite)',
    'admin.srv_lbl_rate': 'Verrechnungssatz (z.B. ab 29,90 € / Std.)',
    'admin.srv_lbl_price_calc': 'Berechnungspreis (Zahlwert)',
    'admin.srv_lbl_popular': 'Als "Beliebt" hervorheben',
    'admin.srv_create_btn': 'Leistung im Live-Katalog aktivieren',
    'admin.blog_title': 'Neuen Ratgeber-Beitrag im Alltags-Blog veröffentlichen',
    'admin.blog_create_btn': 'Artikel verfassen',
    'admin.blog_lbl_title': 'Titel des Artikels',
    'admin.blog_lbl_cat': 'Kategorie',
    'admin.blog_lbl_excerpt': 'Kurzteaser / Excerpt',
    'admin.blog_lbl_content': 'Inhalt (Markdown unterstützt)',
    'admin.blog_lbl_tags': 'Tags (kommagetrennt)',
    'admin.blog_lbl_author': 'Autor Name',
    'admin.blog_publish_btn': 'Beitrag im Premium Alltags-Blog freischalten',
    'admin.login_title': 'Sicherer Admin-Einstieg',
    'admin.login_subtitle': 'Nur für autorisierte Operations-Manager von EMMASCO.',
    'admin.login_password': 'Admin Passwort',
    'admin.login_btn': 'Als Administrator einloggen',
    'admin.login_demo_hint': 'Tipp: Geben Sie zum Testen ein beliebiges Passwort ein und klicken Sie auf den Login-Button.',

    // Footer
    'footer.tagline': 'Alltagsbegleitung mit Weitblick, Hauswirtschaft mit Sorgfalt und professionelle Reinigungsleistungen aus Berlin.',
    'footer.links_title': 'Anerkennung SGB XI',
    'footer.links_desc': 'Wir sind landesrechtlich anerkannt nach §45a SGB XI für hauswirtschaftliche Unterstützung wie Alltagsbegleitung der Pflegekasse.',
    'footer.nav_title': 'Navigation',
    'footer.legal_title': 'Rechtliches',
    'footer.legal_imprint': 'Impressum & Betreiber',
    'footer.legal_privacy': 'Datenschutzerklärung',
    'footer.legal_terms': 'AGB für Haushaltsdienste',
    'footer.legal_care': 'Pflege-Zulassungsnr',
    'footer.copyright': '© 2026 EMMASCO Alltags- & Reinigungsteam Berlin. Alle Rechte vorbehalten.',

    // General Blog
    'blog.banner_badge': 'Wissen & Tipps für Ihren Alltag',
    'blog.banner_title': 'Der EMMASCO Ratgeber',
    'blog.banner_subtitle': 'Erfahren Sie wertvolle Tipps bezüglich Pflegebudget-Abrechnung, Haushaltsorganisation und gesundem Altern.',
    'blog.read_time': 'Min. Lesezeit',
    'blog.written_by': 'Geschrieben von',
    'blog.close_btn': 'Zurück zur Übersicht',
  },
  en: {
    // Topbar & Header
    'topbar.phone': '0176 21856044',
    'topbar.address': 'Schönhauser Allee 163, 10435 Berlin',
    'topbar.accreditation': 'Care Fund Approval §45a SGB XI',
    'topbar.insured': '✔ 100% Insured',
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services & Prices',
    'nav.blog': 'Blog & Guides',
    'nav.contact': 'Contact',
    'nav.documents': 'Document Portal',
    'nav.login_client': 'Client Login',
    'nav.login_admin': 'Admin',
    'nav.my_portal': 'My Portal',
    'nav.admin_portal': 'Admin Portal',
    'nav.logout': 'Logout',
    'nav.imprint': 'Imprint (Impressum)',
    'nav.book': 'Book Online',
    'nav.book_short': 'Book Now',
    'nav.menu_label': 'Show menu',

    // Hero / Home Main
    'hero.badge': 'State-approved according to § 45a SGB XI',
    'hero.title_part1': 'Everyday Support, ',
    'hero.title_part2': 'you can truly rely on',
    'hero.subtitle': 'Household services and everyday companionship with heart and reliability. Maintain your independence in your own home.',
    'hero.button_call': 'Call Us',
    'hero.button_consult': 'Free Consultation',

    // Home Badges / Trust Info
    'trust.accreditation_title': 'Approved under §45a SGB XI',
    'trust.accreditation_desc': 'Direct billing of the relief amount is possible with all German health & care funds.',
    'trust.insured_title': 'Insured Services',
    'trust.insured_desc': 'Full protection for personal liability, property damage, and lost keys.',
    'trust.certified_title': 'Certified & Audited',
    'trust.certified_desc': 'Continuous quality assurance in accordance with German licensing regulations.',
    'trust.team_title': 'Professional Team',
    'trust.team_desc': 'Experienced, criminally background-checked, and permanently employed staff from Berlin.',

    // Home Section Headers
    'services.badge': 'Hundreds of Happy Households in Berlin',
    'services.title': 'Our Services at a Glance',
    'services.subtitle': 'In-house quality guarantee for your satisfaction.',
    'services.rate_label': 'Billing & Price',
    'services.details_btn': 'Request a Free Quote',
    'services.popular_badge': 'Popular',

    // Why Us
    'why.badge': 'Our Quality Guarantee',
    'why.title': 'Why EMMASCO Cleaning Team?',
    'why.subtitle': 'We stand for reliability, punctuality, and warmth in everyday life.',
    'why.item1.title': 'Absolutely Reliable',
    'why.item1.desc': 'We strictly adhere to agreed days and times.',
    'why.item2.title': 'Punctual & Precise',
    'why.item2.desc': 'Your household schedule is processed completely and on time.',
    'why.item3.title': 'Companionship with Heart',
    'why.item3.desc': 'Empathetic presence and a warm listening ear for all your worries.',
    'why.item4.title': 'Transparent Pricing',
    'why.item4.desc': 'No unexpected flat fees. Fair hourly billing rates.',

    // Stats
    'stats.clients': '500+',
    'stats.clients_label': 'Active Clients',
    'stats.clients_sub': 'Served all over Berlin',
    'stats.satisfaction': '95%',
    'stats.satisfaction_label': 'Satisfaction',
    'stats.satisfaction_sub': 'According to 2025 customer survey',
    'stats.support': '24h',
    'stats.support_label': 'Support',
    'stats.support_sub': 'Reachable for emergencies',

    // Quality quote
    'quote.badge': 'Quality Promise',
    'quote.text': '"At EMMASCO, it is not just about clean floors, but about preserving quality of life and dignity in one\'s own home. Each of our employees undergoes a thorough selection process and internalizes our values."',
    'quote.author': '— Emma Osei, Founder',

    // Results / Gallery
    'gallery.badge': 'Visible Success',
    'gallery.title': 'Our Results Speak',
    'gallery.subtitle': 'Before and after pictures from real Berlin households after our assistance.',
    'gallery.before': 'Before',
    'gallery.after': 'After / Sparkling',

    // Testimonials
    'testimonials.badge': 'Customer Reviews',
    'testimonials.title': 'What Our Customers Say',

    // FAQs
    'faq.badge': 'Frequently Asked Questions',
    'faq.title': 'Questions & Answers (FAQ)',
    'faq.subtitle': 'Find answers to the most important questions about reimbursement and booking.',

    // CTA
    'cta.badge': 'Free Offer',
    'cta.title': 'Let us lend you a hand in daily life!',
    'cta.subtitle': 'Contact us today for a free initial consultation regarding invoicing directly via German care insurance.',
    'cta.book_btn': 'Book Online Appointment',
    'cta.email_btn': 'Write an Email',

    // About Page Specific
    'about.badge': 'Berlin Family Business',
    'about.title': 'Who We Are & What Drives Us',
    'about.subtitle': 'Get to know the EMMASCO cleaning team. We bring shine to your home and warmth to your daily life.',
    'about.story_title': 'Our Story: Compounded Care & Quality Cleaning',
    'about.story_p1': 'The idea behind the EMMASCO cleaning team was born in Berlin from a highly personal need. The founder Emma Osei experienced within her own family how difficult it is for relatives in need of care to run a household independently and at the same time find qualified, warm help.',
    'about.story_p2': 'Often there were either pure cleaning agencies that lacked empathy for seniors, or classic nursing care services that neglected everyday help and household keeping due to severe lack of time.',
    'about.story_p3': '"We wanted to close this gap," Emma Osei explains. "Every person deserves to live in a clear, fresh home, while having a companion who listens with true empathy, goes for walks, and helps in everyday tasks."',
    'about.story_p4': 'Today, EMMASCO is a state-certified caregiver and household services agency under SGB XI §45a with head offices in Berlin Prenzlauer Berg, dedicated employees, and over 500 happy loyal clients in Berlin.',
    'about.quote_text': '"For us, your apartment is not just an address. It is your protected living sanctuary where respect, cleanliness, and happiness should reign."',
    'about.quote_author': '— The EMMASCO Philosophy',
    'about.mission_title': 'Our Mission',
    'about.mission_text': 'To relieve those in need of care as well as busy private or commercial clients. We construct hygienically clean spaces and help seniors recover their joy and self-determination.',
    'about.vision_title': 'Our Vision',
    'about.vision_text': 'To become the most reliable companion agency for everyday household services in Berlin – known for absolute discretion, superior cleaning standards, and loving caring service.',
    'about.cert_title': 'Official Care Fund License',
    'about.cert_text': 'Approved and registered under Berlin municipal laws. We bill care relief packages (§45a SGB XI) for all levels directly through state-certified Care Insurance procedures.',
    'about.cert_num': '■ License Number: BE-SGB11-45A-2022',
    'about.cert_region': '■ Core Coverage: Entire Berlin metropolitan region',
    'about.values_badge': 'What We Stand For',
    'about.values_title': 'Our Values In Action',
    'about.team_badge': 'The Team Behind the Sparkle',
    'about.team_title': 'Our Executive Management Team',
    'about.team_subtitle': 'Competent professionals supporting you in everyday Berlin hustle with full hearts.',
    'about.timeline_badge': 'Chronology',
    'about.timeline_title': 'Our Milestone Journey',
    'about.founder_badge': 'Our Founder\'s Story',
    'about.founder_title': 'Our Founder\'s Story',
    'about.founder_heading': 'More Than a Cleaning Service — A Story of Care',
    'about.founder_p1': 'My name is Emmanuel Isodje, and I founded Emmasco ReinigungsTeam UG in May 2025—just a few days after my beloved mother passed away at the age of 93.',
    'about.founder_p2': 'During the final days of her life, my mother became seriously ill. This difficult and emotional time showed me how valuable it is to have caring people nearby—people who offer practical support, comfort and companionship when every moment matters. It was during these intense days of sorrow and reflection that the seed for Emmasco ReinigungsTeam was planted.',
    'about.founder_p3': 'I realized that keeping a clean, tidy, and hygienic home is not just about aesthetics—it is about restoring peace of mind, preserving dignity, and providing a safe sanctuary for our loved ones. We are more than just a cleaning service; we are a dedicated partner committed to bringing care, warmth, and professional reliability to families throughout Berlin.',
    'about.founder_p4': 'Every member of our team is fully vetted and shares this core mission of treating your home with the same respect and tender care that we would show to our own families. We are proud to serve you and help you maintain your independence and comfort.',

    // Services Page Specific
    'services.page.banner_badge': 'Detailed Portfolio',
    'services.page.banner_title': 'Our Services & Prices',
    'services.page.banner_subtitle': 'Flexible help for your home. Transparent pricing structure and first-class execution. Many services are 100% covered by care funds.',
    'services.page.search_placeholder': 'Search services...',
    'services.page.popular_badge': 'Best Choice',
    'services.page.reimbursement': 'Billing',
    'services.page.care_level': 'Care Level',
    'services.page.care_reimbursed': '100% Covered',
    'services.page.brochure': 'Info Brochure',
    'services.page.book_direct': 'Book Now',
    'services.page.modal_title': 'Request Free Consultation',
    'services.page.modal_subtitle': 'Please fill out this short form. Our team based in Berlin-Prenzlauer Berg will get back to you within 2 hours on business days.',
    'services.page.modal_phone_label': 'Phone Number for Call Back',
    'services.page.modal_preferred_time': 'Preferred Consultation Time',
    'services.page.modal_notes_label': 'What kind of support is most important to you?',
    'services.page.modal_submit': 'Schedule Free Consultation Call',
    'services.page.modal_close': 'Close',
    'services.page.direct_book_banner': 'This service is a perfect fit for you!',
    'services.page.direct_book_btn': 'BOOK DIRECTLY NOW',

    // Booking Page Specific
    'booking.title': 'Request Appointment & Book',
    'booking.subtitle': 'Household support and companionship during your preferred hours. Send a free request and settle directly with German care insurance or privately.',
    'booking.step1': 'Service Details',
    'booking.step2': 'Time & Place',
    'booking.step3': 'Contact Info',
    'booking.service_label': 'Select Service',
    'booking.service_select': 'Please select a service',
    'booking.billing_type_label': 'Billing Method',
    'booking.booking.billing_kasse': 'Coverage by Care Insurance Fund (§45a)',
    'booking.booking.billing_privat': 'Private invoicing / Self-payment',
    'booking.notes_label': 'Important details or wishes (e.g., pets present, specific cleaning chemicals preferred)',
    'booking.date_label': 'Preferred Date',
    'booking.time_label': 'Preferred Time (approx.)',
    'booking.dur_label': 'Duration (hours)',
    'booking.dur_hours': 'Hours',
    'booking.name_label': 'Your Full Name',
    'booking.email_label': 'Your Email Address',
    'booking.phone_label': 'Your Phone Number',
    'booking.address_label': 'Service Address (Street, Number, Postal Code, Berlin)',
    'booking.btn_next': 'Next',
    'booking.btn_back': 'Back',
    'booking.btn_submit': 'Submit Free Booking Request',
    'booking.success_title': 'Request Received Successfully!',
    'booking.success_p1': 'Thank you! Your household and companionship booking request has been securely recorded.',
    'booking.success_p2': 'We are validating availability for your preferred slot and will call you back within 2 hours to confirm your appointment.',
    'booking.success_id': 'Your Booking Number',
    'booking.btn_new': 'Book Another Appointment',
    'booking.btn_portal': 'View in Customer Portal',
    'booking.guest_login_prompt': 'Want to manage your booking? Simply enter your email to log into the customer portal.',

    // Contact Page Specific
    'contact.banner_title': 'Get In Touch',
    'contact.banner_subtitle': 'We look forward to your request. Speedy responses and free initial guidance directly in Berlin.',
    'contact.form_title': 'Send us a Message',
    'contact.form_name': 'Your Name',
    'contact.form_email': 'Your Email Address',
    'contact.form_phone': 'Your Phone Number',
    'contact.form_msg': 'Your Message to Us',
    'contact.form_submit': 'Send Message',
    'contact.office_title': 'Berlin Headquarters',
    'contact.office_address': 'Schönhauser Allee 163, 10435 Berlin',
    'contact.office_hours_title': 'Telephone Service Hours',
    'contact.office_hours': 'Monday - Friday: 08:30 AM - 06:00 PM',
    'contact.office_urgent': 'Emergencies (Existing customers): 24/7 Hotline',
    'contact.sgb_title': 'Direct Billing Berlin',
    'contact.sgb_text': 'Thanks to our official state certification under SGB XI §45a, all public health and care funds fully refund our services. We gladly provide free initial consultation calls directly inside your home.',
    'contact.msg_sent_title': 'Message Transmitted Successfully!',
    'contact.msg_sent_p': 'Thank you for contacting us! Our Berlin team will reach out to you shortly.',

    // Customer Portal / Dashboard Specific
    'customer.title': 'Welcome to the EMMASCO Client Portal',
    'customer.subtitle': 'Manage your appointments, upload healthcare receipts or care certificates, and chat instantly with support.',
    'customer.tab_appointments': 'My Appointments',
    'customer.tab_docs': 'Document Center',
    'customer.tab_support': 'Support Help-Chat',
    'customer.tab_profile': 'My Identity Profile',
    'customer.app_active': 'Active Care & Household Support Schedules',
    'customer.app_no_app': 'No scheduled appointments registered.',
    'customer.app_book_now': 'Request a New Appointment Now',
    'customer.app_id': 'Booking ID',
    'customer.app_service': 'Service',
    'customer.app_date_time': 'Date / Time',
    'customer.app_address': 'Service Address',
    'customer.app_status': 'Status',
    'customer.app_billing': 'Billing Method',
    'customer.app_actions': 'Actions',
    'customer.app_status_pending': 'Awaiting confirmation',
    'customer.app_status_confirmed': '✓ Reserved & Scheduled',
    'customer.app_status_completed': 'Completed',
    'customer.app_status_cancelled': 'Cancelled',
    'customer.app_cancel_btn': 'Cancel Booking',
    'customer.docs_title': 'Healthcare Certificates & Receipts',
    'customer.docs_subtitle': 'Upload your Care Level Bescheid, medical prescriptions, or fund validations. We reconcile these directly with your insurer.',
    'customer.docs_lbl_name': 'File / Document Name',
    'customer.docs_lbl_size': 'File Size',
    'customer.docs_lbl_date': 'Upload Date',
    'customer.docs_lbl_status': 'Validation Status',
    'customer.docs_status_approved': '✓ Accepted for Insurance Reconcile',
    'customer.docs_status_pending': 'Pending validation',
    'customer.docs_status_rejected': 'Insufficient / Please re-upload clear copy',
    'customer.docs_upload_area': 'Drag & drop file here or click to upload security document',
    'customer.docs_upload_sub': 'Supports PDF, JPEG up to 5MB. Only upload legitimate healthcare document printouts.',
    'customer.chat_title': 'Direct link to our Berlin Client Support Desk',
    'customer.chat_subtitle': 'We stay synchronized. Drop a line if you have quick timing updates, caregiver changes, or specific requests.',
    'customer.chat_input_placeholder': 'Ask your question to our support personnel...',
    'customer.chat_send_btn': 'Transmit',
    'customer.profile_title': 'Personal Account Details',
    'customer.profile_name': 'Your Legal Name',
    'customer.profile_email': 'Email Address',
    'customer.profile_phone': 'Contact Telephone',
    'customer.profile_address': 'Default Household Address',
    'customer.profile_save_btn': 'Update Profile Details',
    'customer.login_card_title': 'Sign into the Customer Portal',
    'customer.login_card_subtitle': 'Provide your Email & Name. As a demonstration visitor, any email operates securely.',
    'customer.login_lbl_email': 'Email Address',
    'customer.login_lbl_name': 'Your First & Last Name',
    'customer.login_btn': 'Validate & Access Portal',
    'customer.login_demo_hint': 'Hint: Feed w.schmidt@gmail.com to see predefined schedules and documents!',

    // Admin Dashboard Specific
    'admin.title': 'EMMASCO Operations Central (Backend Board)',
    'admin.subtitle': 'Coordinate incoming bookings, modify catalog options, and publish educational helper articles.',
    'admin.tab_appointments': 'Schedule Reconcile',
    'admin.tab_services': 'Live Service Catalog',
    'admin.tab_blog': 'Author Articles',
    'admin.app_title': 'Customer Requests & Scheduling Feed',
    'admin.app_table_cust': 'Client',
    'admin.app_table_srv': 'Service / Price',
    'admin.app_table_dt': 'Scheduled Slot',
    'admin.app_table_address': 'Address',
    'admin.app_table_status': 'Status',
    'admin.app_table_actions': 'Actions',
    'admin.app_action_confirm': 'Validate/Confirm',
    'admin.app_action_cancel': 'Cancel Term',
    'admin.app_action_delete': 'Remove',
    'admin.srv_title': 'Modify Active Live Service Offerings',
    'admin.srv_add_btn': 'Register New Service Type',
    'admin.srv_lbl_title': 'Service Title Name',
    'admin.srv_lbl_cat': 'System Category',
    'admin.srv_lbl_desc': 'Teaser Text (Homepage Card)',
    'admin.srv_lbl_det': 'Detailed Description (Offerings Page Info)',
    'admin.srv_lbl_rate': 'Price Tag Output (e.g., from £29.90 / hr)',
    'admin.srv_lbl_price_calc': 'Internal Calculator Base Value',
    'admin.srv_lbl_popular': 'Pin as "Beste Wahl / Best Choice"',
    'admin.srv_create_btn': 'Deploy Service to Customer Catalog',
    'admin.blog_title': 'Publish New Blog Post to Client Advice Feed',
    'admin.blog_create_btn': 'Write New Article',
    'admin.blog_lbl_title': 'Article Title',
    'admin.blog_lbl_cat': 'Topic Tag Category',
    'admin.blog_lbl_excerpt': 'Teaser Excerpt',
    'admin.blog_lbl_content': 'Body Content (Markdown Supported)',
    'admin.blog_lbl_tags': 'Keywords (comma-delimited list)',
    'admin.blog_lbl_author': 'Author Credit',
    'admin.blog_publish_btn': 'Publish Article to Premium Blog',
    'admin.login_title': 'Secure Backend Ingress',
    'admin.login_subtitle': 'Only for credentials certified EMMASCO managers.',
    'admin.login_password': 'Admin Secure Key',
    'admin.login_btn': 'Authorize & Access Control Panel',
    'admin.login_demo_hint': 'Demo Note: Enter any test password key and click authorized ingress.',

    // Footer
    'footer.tagline': 'Companionship with warmth, householdKeeping with meticulous care, and certified premium sanitation teams from Berlin Prenzlauer Berg.',
    'footer.links_title': 'Care Fund SGB XI Certification',
    'footer.links_desc': 'We are fully certified according to German §45a SGB XI care fund guidelines to fulfill and direct-bill housekeeping and home care relief budgets.',
    'footer.nav_title': 'Sitemap',
    'footer.legal_title': 'Legal framework',
    'footer.legal_imprint': 'Imprint & Contact',
    'footer.legal_privacy': 'Privacy Policy',
    'footer.legal_terms': 'Terms & Conditions',
    'footer.legal_care': 'Care Fund Registry Number',
    'footer.copyright': '© 2026 EMMASCO Companion & Housekeeper Team Berlin. All rights reserved.',

    // General Blog
    'blog.banner_badge': 'Advice, SGB XI Guidelines, & Life Hacks',
    'blog.banner_title': 'The EMMASCO Advisor',
    'blog.banner_subtitle': 'Discover expert techniques regarding care fund invoicing, domestic hacks, and joyful aging.',
    'blog.read_time': 'min. read time',
    'blog.written_by': 'Authored by',
    'blog.close_btn': 'Return to advice feed',
  }
};

const LOCALIZED_SERVICES: Record<Language, Service[]> = {
  de: [
    {
      id: 'haushaltshilfe',
      title: 'Haushaltshilfe',
      category: 'haushalt',
      description: 'Unterstützung beim Aufräumen, Spülen, Wäsche bügeln und der allgemeinen Organisation Ihres Zuhauses.',
      detailedDescription: 'Unser Haushaltspflegedienst sorgt für Struktur und Glanz in Ihren vier Wänden. Wir übernehmen das Bettenbeziehen, die Wäschepflege, Bügelarbeiten sowie allgemeine Reinigungs- und Aufräumarbeiten. Abrechenbar direkt über die Pflegekasse dank §45a SGB XI Anerkennung.',
      price: 'Abrechnung über Pflegekasse (§45a SGB XI / Entlastungsbetrag)',
      priceValue: 29.90,
      iconName: 'Home',
      isPopular: true
    },
    {
      id: 'reinigung',
      title: 'Unterhaltsreinigung',
      category: 'reinigung',
      description: 'Regelmäßige, professionelle Reinigung Ihrer Wohnräume für ein stets frisches und hygienisches Wohngefühl.',
      detailedDescription: 'Wir reinigen Böden, Oberflächen, Sanitäranlagen und Küchen gründlich und im gewünschten Intervall (wöchentlich, zweiwöchentlich). Für ein staubfreies und glänzendes Zuhause mit Premium-Anspruch.',
      price: 'Individuelles Angebot',
      priceValue: 34.90,
      iconName: 'Sparkles',
      isPopular: false
    },
    {
      id: 'einkaufshilfe',
      title: 'Einkaufshilfe',
      category: 'haushalt',
      description: 'Einkaufen von Lebensmitteln, Holen von Medikamenten und Erledigung wichtiger Besorgungen des Alltags.',
      detailedDescription: 'Wir planen mit Ihnen den Wocheneinkauf, kaufen frische Lebensmittel, holen Ihre Rezepte sowie Medikamente aus der Apotheke und bringen alles sicher zu Ihnen nach Hause. Gerne begleiten wir Sie auch beim Einkauf.',
      price: 'Abrechnung über Pflegekasse (§45a SGB XI / Entlastungsbetrag)',
      priceValue: 28.50,
      iconName: 'ShoppingCart',
      isPopular: false
    },
    {
      id: 'alltagsbegleitung',
      title: 'Alltagsbegleitung',
      category: 'begleitung',
      description: 'Herzliche Gesellschaft, Begleitung zu Arztterminen, Spaziergänge und gemeinsame Freizeitgestaltung.',
      detailedDescription: 'Alltagsbegleitung mit viel Empathie und Geduld. Wir lesen vor, führen anregende Gespräche, machen Spaziergänge an der frischen Luft oder begleiten Sie sicher zu Ihren Arzt- und Behördenterminen. Gut für Geist und Seele.',
      price: 'Abrechnung über Pflegekasse möglich (§45a SGB XI)',
      priceValue: 29.05,
      iconName: 'HeartHandshake',
      isPopular: true
    },
    {
      id: 'angehoerige',
      title: 'Entlastung für Angehörige',
      category: 'begleitung',
      description: 'Zuverlässige stundenweise Betreuung Ihres Liebsten, damit pflegende Angehörige sich beruhigt Auszeiten nehmen können.',
      detailedDescription: 'Pflege und Alltagsbetreuung erfordern viel Kraft. Wir übernehmen zuverlässig stundenweise die Alltagsbegleitung und Hauswirtschaft vor Ort, damit Sie als pflegender Angehöriger neue Energie tanken, eigenen Terminen nachgehen oder Freizeit genießen können.',
      price: 'Abrechnung über Entlastungsbetrag (§45a SGB XI)',
      priceValue: 31.50,
      iconName: 'UserCheck',
      isPopular: false
    },
    {
      id: 'fenster',
      title: 'Fensterreinigung',
      category: 'zusatz',
      description: 'Streifenfreier Glanz für Ihre Fenster, Rahmen und Glasflächen im privaten sowie gewerblichen Bereich.',
      detailedDescription: 'Unsere professionelle Glasreinigung reinigt Fenster, Fensterbänke, Rahmen und anspruchsvolle Glasfronten ohne Schlieren. Wir bringen alle benötigten Reinigungsmaterialien mit und arbeiten schnell wie gründlich.',
      price: 'Individuelles Angebot auf Anfrage',
      priceValue: 45.00,
      iconName: 'GlassWater',
      isPopular: false
    },
    {
      id: 'buero',
      title: 'Büroreinigung',
      category: 'zusatz',
      description: 'Professionelle Reinigung von Büros, Kanzleien und Gewerbeflächen für ein produktives Arbeitsklima.',
      detailedDescription: 'Sorgen Sie für einen glänzenden Eindruck bei Ihren Kunden und Mitarbeitern. Wir reinigen Schreibtische, Konferenzräume, sanitäre Anlagen und Küchenflächen diskret, pünktlich und nach zertifizierten Hygienestandards.',
      price: 'Individuelles Angebot',
      priceValue: 39.90,
      iconName: 'Briefcase',
      isPopular: false
    },
    {
      id: 'deepclean',
      title: 'Deep Cleaning (Frühjahrsputz)',
      category: 'reinigung',
      description: 'Intensive Grundreinigung bis in die kleinsten Winkel, ideal für Ein- oder Auszüge und Jahreszeitenwechsel.',
      detailedDescription: 'Unser Deep-Cleaning-Service befreit Ihr gesamtes Zuhause von hartnäckigem Schmutz, Kalk und Fettablagerungen. Wir säubern hinter Heizkörpern, im Ofen, entkalken die Dusche fachmännisch und bringen jeden Winkel zum Glänzen.',
      price: 'Individuelles Angebot',
      priceValue: 44.95,
      iconName: 'ShieldAlert',
      isPopular: false
    }
  ],
  en: [
    {
      id: 'haushaltshilfe',
      title: 'Housekeeping Assistance',
      category: 'haushalt',
      description: 'Assistance with tidying up, doing dishes, ironing laundry, and general organization of your home.',
      detailedDescription: 'Our domestic care service keeps your house structured and clean. We take care of changing bed sheets, laundry service, ironing, as well as general cleaning and organizing. Bills can be sent directly to the care fund due to official §45a SGB XI licensing.',
      price: 'Billing via Care Fund (§45a SGB XI / Relief Budget)',
      priceValue: 29.90,
      iconName: 'Home',
      isPopular: true
    },
    {
      id: 'reinigung',
      title: 'Maintenance Cleaning',
      category: 'reinigung',
      description: 'Regular professional cleaning of your living spaces for a constantly fresh and hygienic home feel.',
      detailedDescription: 'We clean floors, surfaces, bathrooms, and kitchens thoroughly at your desired interval (weekly, bi-weekly) to provide a dust-free and clean living sanctuary for premium clients.',
      price: 'Personalised Quotation',
      priceValue: 34.90,
      iconName: 'Sparkles',
      isPopular: false
    },
    {
      id: 'einkaufshilfe',
      title: 'Grocery Assistance',
      category: 'haushalt',
      description: 'Sourcing groceries, picking up medical prescriptions, and managing vital everyday chores.',
      detailedDescription: 'We plan weekly grocery lists together, shop for fresh produce, retrieve your medication prescriptions from pharmacies, and bring everything securely home. We can also accompany you on the chore trip.',
      price: 'Billing via Care Fund (§45a SGB XI / Relief Budget)',
      priceValue: 28.50,
      iconName: 'ShoppingCart',
      isPopular: false
    },
    {
      id: 'alltagsbegleitung',
      title: 'Everyday Companionship',
      category: 'begleitung',
      description: 'Warm companionship, accompaniment to medical appointments, walks, and shared hobbies.',
      detailedDescription: 'Everyday companion support served with high empathy and patience. We read, lead energetic conversations, schedule walks in nature, or accompany you to visit doctors and public agencies. Stimulating for both mind and spirit.',
      price: 'Care Fund billing eligible (§45a SGB XI)',
      priceValue: 29.00,
      iconName: 'HeartHandshake',
      isPopular: true
    },
    {
      id: 'angehoerige',
      title: 'Relief for Caregiver Relatives',
      category: 'begleitung',
      description: 'Reliable hourly companionship for your loved one, allowing caregiving relatives to take well-earned breaks.',
      detailedDescription: 'Caring for family is exhaustive. We step in on an hourly basis to take over domestic support and companionship on site, giving family relatives breathing space to recharge, manage errands, and enjoy free hours.',
      price: 'Billing via Relief budget (§45a SGB XI)',
      priceValue: 31.50,
      iconName: 'UserCheck',
      isPopular: false
    },
    {
      id: 'fenster',
      title: 'Professional Window Cleaning',
      category: 'zusatz',
      description: 'Streak-free shine for windows, frames, and glass facades for private and corporate sectors.',
      detailedDescription: 'Our expert glass sanitation cleans windows, borders, window sills, and fragile glass facades completely streak-free. We bundle all cleaning supplies and operate fast and reliably.',
      price: 'Personalised Quotation on Request',
      priceValue: 45.00,
      iconName: 'GlassWater',
      isPopular: false
    },
    {
      id: 'buero',
      title: 'Commercial Office Cleaning',
      category: 'zusatz',
      description: 'Professional cleaning of offices, law firms, and commercial facilities for a clean workplace mood.',
      detailedDescription: 'Form a pristine impression for clients and employees. We clean desks, meeting rooms, break rooms, kitchens, and restrooms precisely, quietly, and using top hygienic standards.',
      price: 'Personalised Quotation',
      priceValue: 39.90,
      iconName: 'Briefcase',
      isPopular: false
    },
    {
      id: 'deepclean',
      title: 'Deep Cleaning (Spring Reset)',
      category: 'reinigung',
      description: 'Intense basic cleaning down to the smallest corner, ideal for moving in/out or seasonal resets.',
      detailedDescription: 'Our deep cleaning package liberates your home from tough stains, lime calcium buildup, and hidden grease. We clean behind heaters, inside ovens, descale glass showers, and polish every single corner.',
      price: 'Personalised Quotation',
      priceValue: 44.95,
      iconName: 'ShieldAlert',
      isPopular: false
    }
  ]
};

const LOCALIZED_TESTIMONIALS: Record<Language, Testimonial[]> = {
  de: [
    {
      id: '1',
      name: 'Margarete S. (82J.) & Tochter Marion',
      role: 'Privatkunde (Berlin-Pankow)',
      text: 'Die Alltagsbegleitung des Emmasco Teams ist ein Segen für uns. Frau Schmidt kommt wöchentlich, hilft im Haushalt und geht mit meiner Mutter spazieren. Alles wird direkt mit der Pflegekasse (§45a) abgerechnet. Äußerst zuverlässig und herzlich!',
      rating: 5,
      date: '12. Mai 2026'
    },
    {
      id: '2',
      name: 'Dr. Michael Wagner',
      role: 'Gewerbekunde (Zahnarztpraxis Berlin)',
      text: 'Wir beauftragen EMMASCO für unsere Praxisreinigung in der Schönhauser Allee. Die Pünktlichkeit und gründliche Reinigung nach den geforderten Hygienestandards sind tadellos. Kompetenter und freundlicher Ansprechpartner.',
      rating: 5,
      date: '30. April 2026'
    },
    {
      id: '3',
      name: 'Christian & Sabine Brand',
      role: 'Haushaltshilfe privat',
      text: 'Nach der Geburt unserer Zwillinge brauchten wir dringend Unterstützung im Haushalt. Die Haushaltshilfe von Emmasco hat uns gerettet. Von Wäsche waschen über Staubsaugen bis hin zur perfekten Ordnung – absolut empfehlenswert.',
      rating: 5,
      date: '15. März 2026'
    }
  ],
  en: [
    {
      id: '1',
      name: 'Margarete S. (82y.) & daughter Marion',
      role: 'Private Client (Berlin-Pankow)',
      text: 'The companion assist from the EMMASCO team is a lifesaver for our family. A helper visits weekly to organize domestic chores and walk with my mother. Everything is settled directly with our care provider (§45a). Incredibly dependable and pleasant.',
      rating: 5,
      date: 'May 12, 2026'
    },
    {
      id: '2',
      name: 'Dr. Michael Wagner',
      role: 'Commercial Client (Dental Clinic Berlin)',
      text: 'We hire EMMASCO to maintain our dental clinic on Schönhauser Allee. Punctuality and complete sanitation satisfying strict surgical hygiene guidelines are flawless. Highly competent team.',
      rating: 5,
      date: 'April 30, 2026'
    },
    {
      id: '3',
      name: 'Christian & Sabine Brand',
      role: 'Private Household Client',
      text: 'After our twins were born, we immediately needed extra hands at home. EMMASCO Housekeeping entirely rescued us. From cleaning laundry to scrubbing carpets and staging order. Highly recommended.',
      rating: 5,
      date: 'March 15, 2026'
    }
  ]
};

const LOCALIZED_FAQS: Record<Language, FAQItem[]> = {
  de: [
    {
      id: 'faq1',
      question: 'Was bedeutet die Anerkennung nach § 45a SGB XI?',
      answer: 'Als staatlich anerkannter Betreuungs- und Entlastungsdienst können wir unsere Leistungen direkt mit allen gesetzlichen und privaten Pflegekassen abrechnen. Wenn bei Ihnen oder Ihrem Angehörigen ein Pflegegrad (ab Pflegegrad 1) vorliegt, steht Ihnen ein monatlicher Entlastungsbetrag von 125 € zu. Diesen Betrag können Sie vollständig für unsere Haushaltshilfe, Einkaufshilfe und Alltagsbegleitung einsetzen.',
      category: 'allgemein'
    },
    {
      id: 'faq2',
      question: 'Sind Ihre Mitarbeiter versichert und qualifiziert?',
      answer: 'Selbstverständlich. Alle unsere Mitarbeiter im Reinigungsteam und in der Alltagsbegleitung sind vollumfänglich haftpflicht- und unfallversichert. Unser Personal nimmt zudem regelmäßig an Schulungen nach den SGB-Richtlinien teil, ist absolut diskret, freundlich und spricht fließend Deutsch.',
      category: 'sicherheit'
    },
    {
      id: 'faq3',
      question: 'Wie hoch sind die Kosten und gibt es versteckte Gebühren?',
      answer: 'Bei uns herrscht absolute Preistransparenz. Unsere Stundenverrechnungssätze beginnen ab 28,50 € pro Stunde für qualifizierte Alltagsbegleitung und haushaltnahe Dienste im Rahmen des Entlastungsbetrags. Angebote für Glasreinigung, Büroreinigung und Sonderreinigungen kalkulieren wir fair und unverbindlich per Festpreis. Es gibt keine Mindestlaufzeiten oder versteckten Einrichtungspauschalen.',
      category: 'preise'
    },
    {
      id: 'faq4',
      question: 'Was passiert, wenn meine zugewiesene Kraft im Urlaub oder krank ist?',
      answer: 'Keine Sorge, Kontinuität ist uns wichtig. Im Krankheits- oder Urlaubsfall stellen wir Ihnen – nach vorheriger Absprache – eine qualifizierte und eingearbeitete Urlaubsvertretung aus unserem Team zur Seite, damit Sie keine Lücken in der Versorgung beklagen müssen.',
      category: 'allgemein'
    },
    {
      id: 'faq5',
      question: 'In welchen Stadtteilen von Berlin bieten Sie Ihre Dienste an?',
      answer: 'Unser Firmensitz liegt in Prenzlauer Berg (Schönhauser Allee). Wir bedienen Berlin-Mitte, Pankow, Prenzlauer Berg, Weißensee, Wedding, Friedrichshain, Kreuzberg, Schöneberg, Charlottenburg und angrenzende Bezirke im Norden und Osten Berlins. Senden Sie uns einfach Ihre Postleitzahl!',
      category: 'allgemein'
    }
  ],
  en: [
    {
      id: 'faq1',
      question: 'What does the official §45a SGB XI certification mean?',
      answer: 'As a state-approved care and domestic service, we can bill our services directly with all statutory and private German care funds. If you or your loved one holds an approved care level (from level 1 upwards), you are entitled to a monthly relief budget of €125. You can utilize this budget 100% to pay for our housekeeping, shopping aid, or companionship.',
      category: 'allgemein'
    },
    {
      id: 'faq2',
      question: 'Are your domestic specialists insured and qualified?',
      answer: 'Absolutely. All our employees in cleaning teams and caregiver companionship are fully insured for liability and accident protection. Furthermore, our support staff regularly attends certified training based on statutory code guidelines, operates with maximum discretion, and speaks fluent German.',
      category: 'sicherheit'
    },
    {
      id: 'faq3',
      question: 'How high are the costs, and are there hidden fees?',
      answer: 'We maintain total pricing transparency. Our care assistance and domestic rates start from €28.50 per hour under care fund support credits. Proposals for complex glass cleaning, offices, and special resets are computed fairly as dynamic flat quotes. There are no startup fees or locked contracts.',
      category: 'preise'
    },
    {
      id: 'faq4',
      question: 'What happens if my designated helper is on holiday or sick?',
      answer: 'Rest assured, continuity is our promise. In case of unexpected sick leave or planned holidays, we provide a fully brief-coached replacement caregiver from within our team after consultation, maintaining a flawless care loop.',
      category: 'allgemein'
    },
    {
      id: 'faq5',
      question: 'Which neighborhoods of Berlin do you serve?',
      answer: 'Our physical main office is situated in Prenzlauer Berg (Schönhauser Allee). We cover Berlin-Mitte, Pankow, Prenzlauer Berg, Weißensee, Wedding, Friedrichshain, Kreuzberg, Schöneberg, Charlottenburg, and adjoining quarters in Northern and Eastern Berlin. Simply email us your postal registration code!',
      category: 'allgemein'
    }
  ]
};

const LOCALIZED_BLOG_ARTICLES: Record<Language, BlogArticle[]> = {
  de: [
    {
      id: 'art1',
      title: 'Frühjahrsputz leicht gemacht: Strategie für ein staubfreies Zuhause',
      category: 'Cleaning Tips',
      excerpt: 'Mit dem richtigen Plan gelingt der Frühjahrsputz in kürzester Zeit. Erfahren Sie die besten Tipps unserer Reinigungsprofis.',
      content: `Ein gründlich sauberes Zuhause hebt die Stimmung und sorgt für ein gesundes Raumklima. Doch wer ohne Plan losputzt, verliert schnell die Übersicht und Motivation. Hier ist die ultimative Checkliste für einen effizienten Hausputz nach Profi-Art.
  
  ### 1. Von oben nach unten arbeiten
  Fangen Sie immer oben an: Zuerst Spinnweben an der Decke entfernen, dann Lampen abstauben, Schrankoberseiten abwischen, und erst am Ende Tische reinigen und Staub saugen. Dadurch wird herabfallender Staub später einfach weggesaugt.
  
  ### 2. Sektionsprinzip anwenden
  Konzentrieren Sie sich immer auf einen Raum oder eine Zone. Beenden Sie erst das Badezimmer, bevor Sie mit der Küche beginnen. Das gibt ein schnelles Erfolgsgefühl!
  
  ### 3. Profi-Mittel richtig einwirken lassen
  Sprühen Sie Kalklöser im Bad auf und lassen Sie ihn mindestens 10 Minuten arbeiten, anstatt sofort zu schrubben. Die chemische Reaktion nimmt Ihnen 90 % der Arbeit ab.
  
  ### 4. Das richtige Mikrofasertuch nutzen
  Nutzen Sie für Glasflächen spezielle, gewebte Glastücher, um Streifenbildung zu vermeiden. Für Fett in der Küche eignen sich gröbere Fasern mit biologischem Fettlöser.
  
  Sollten Sie keine Zeit oder Kraft dafür finden, buchen Sie einfach unser **Deep Cleaning** Team. Wir übernehmen den kompletten Frühjahrsputz für Sie!`,
      author: 'Emma Osei, Geschäftsführung',
      date: '10. Mai 2026',
      readTime: '4 Min. Lesezeit',
      image: 'https://picsum.photos/seed/cleaning1/600/400',
      tags: ['Frühjahrsputz', 'Haushaltstipps', 'Ordnung']
    },
    {
      id: 'art2',
      title: 'Gesundes Altern: Alltagsunterstützung und seelische Gesundheit',
      category: 'Health',
      excerpt: 'Soziale Isolation ist im Alter ein großes Risiko. Wie Alltagsbegleitung nicht nur das Leben leichter, sondern auch glücklicher macht.',
      content: `Einsamkeit und körperliche Einschränkungen belasten many Senioren. Häufig ziehen sie sich zurück, was die geistige Fitness und seelische Balance beeinträchtigen kann. Die haushaltsnahe Dienstleistung und Alltagsbegleitung nach § 45a SGB XI setzt genau hier an und bietet weit mehr als nur praktische Hilfe.
  
  ### Brücke gegen Einsamkeit
  Eine herzliche Alltagsbegleitung bringt Struktur und Freude. Durch gemeinsame Gespräche bei einer Tasse Kaffee, das gemeinsame Backen oder Spaziergänge im Park wird das Gehirn angeregt, die Stimmung steigt, und Depression im Alter kann aktiv vorgebeugt werden.
  
  ### Erhalt der Selbstständigkeit im eigenen Heim
  Der größte Wunsch der meisten Menschen ist es, bis ins hohe Alter in den eigenen vertrauten vier Wänden wohnen zu bleiben. Wenn das Bücken schwerfällt und das Einkaufen zur Last wird, hilft unsere Haushaltshilfe. Durch gezielte Entlastung und Aktivierung unterstützen wir Senioren dabei, ihr gewohntes Umfeld nicht aufgeben zu müssen.
  
  ### Entlastung der pflegenden Familienmitglieder
  Angehörige, die Beruf, Familie und Pflege koordinieren, geraten oft an ihre Belastungsgrenzen. Eine externe stundenweise Hilfe schenkt wertvolle Freiräume, die ohne schlechtes Gewissen zur eigenen Erholung genutzt werden können.
  
  Dank des monatlichen Entlastungsbetrags von 125 € der Pflegekasse (ab Pflegegrad 1) fallen für diese Dienste oft gar keine zusätzlichen privaten Kosten an!`,
      author: 'Dr. rer. med. Hans-Peter Beck',
      date: '28. April 2026',
      readTime: '6 Min. Lesezeit',
      image: 'https://picsum.photos/seed/caregivers/600/400',
      tags: ['Gesundheit im Alter', 'Alltagsbegleitung', 'SGB XI']
    },
    {
      id: 'art3',
      title: 'Wäschepflege wie im 5-Sterne-Hotel: Geheimnisse für perfekte Fasern',
      category: 'Lifestyle',
      excerpt: 'Vergraute Weißwäsche? Kratzige Handtücher? Unsere Experten verraten, wie Textilien jahrelang weich und strahlend bleiben.',
      content: `Wir verbringen Stunden mit dem Waschen, Trocknen und Bügeln unserer Kleidung. Trotzdem sehen Hemden oft schnell abgetragen aus, und die Handtücher fühlen sich an wie Schmirgelpapier. Mit diesen einfachen Kniffen waschen Sie künftig wie Profis:
  
  ### 1. Weniger Dosierung ist mehr
  Das größte Missverständnis bei weicher Wäsche: Viel Waschmittel hilft viel. Das Gegenteil ist der Fall! Zu viel Waschmittel lagert sich in den Fasern ab, macht sie steif und zieht Schmutz an. Verwenden Sie maximal 2/3 der empfohlenen Menge.
  
  ### 2. Essig statt Weichspüler
  Weichspüler legt einen Fettfilm über die Fasern, was die Saugfähigkeit von Handtüchern ruiniert. Geben Sie stattdessen einen kleinen Schuss haushaltsüblichen weißen Essig in das Weichspülerfach. Der Essig neutralisiert Kalk, wäscht sich rückstandslos aus und macht die Wäsche wunderbar weich – ganz ohne Essiggeruch!
  
  ### 3. Sortierung ist King
  Waschen Sie raue Kleidungsstücke wie Jeans niemals mit empfindlichen Synthetikstoffen. Die Reibung im Waschgang schädigt die feinen Fasern und führt zum sogenannten Pilling (Knötchenbildung).
  
  Unsere Haushaltshilfen achten bei der täglichen Wäscheversorgung in unseren Kundenhaushalten haargenau auf diese Feinheiten. Vertrauen Sie Ihre Lieblingsstücke gern den Profis an!`,
      author: 'Gabriele Becker, Hauswirtschaftsleiterin',
      date: '04. April 2026',
      readTime: '4 Min. Lesezeit',
      image: 'https://picsum.photos/seed/laundry/600/400',
      tags: ['Lifestyle', 'Wäschewaschen', 'Haushaltsorganisation']
    }
  ],
  en: [
    {
      id: 'art1',
      title: 'Spring Reset Made Simple: Blueprint for a Dust-Free Home Sanctuary',
      category: 'Cleaning Tips',
      excerpt: 'Make your dynamic spring cleaning successful in no time with proper planning. Discover pro secrets straight from our team.',
      content: `A thoroughly clean home raises your mood and supports healthy room wellness. However, cleaning without a step-by-step program causes swift exhaustion. Here is the ultimate pro cleaning layout checklist:
  
  ### 1. Work From Top to Bottom
  Always dust top items first: retrieve cobwebs on the ceiling, scrub lighting fixtures, wipe closet tops, and finally vacuum floors. This keeps falling particles from spoiling already washed areas.
  
  ### 2. Zone System Focus
  Limit yourself to one singular zone. Fully complete the restroom before stepping into the kitchen. This structures rapid success metrics!
  
  ### 3. Let Specialized Solutions Rest
  Spray bathroom calcium cleaners and let them stand for at least ten minutes instead of immediate scrubbing. Let chemistry handle 95% of physical friction.
  
  ### 4. Fabric Awareness
  Incorporate woven microfiber towels exclusively for glass fronts to avoid streaks. Use coarser weaves with organic grease-dissolving sprays in the kitchen.
  
  If you lack time or dynamic energy, simply order our **Deep Cleaning** team. We process complete household resets for you!`,
      author: 'Emma Osei, Executive Officer',
      date: 'May 10, 2026',
      readTime: '4 min. read',
      image: 'https://picsum.photos/seed/cleaning1/600/400',
      tags: ['Spring Cleaning', 'Housekeeping', 'Home Care']
    },
    {
      id: 'art2',
      title: 'Aging Graciously: Companionship and Mind-Spirit Well-Being',
      category: 'Health',
      excerpt: 'Isolation is a major risk for elderly citizens in large cities. Learn why companionship does not just ease logistics but feeds actual happiness.',
      content: `Loneliness and health degradation hit senior citizens deeply. Reluctant withdrawals may compromise cognitive sharpness and inner peace. Housekeeping care and everyday companion guides under §45a SGB XI address this precisely, yielding far more than plain chore help.
  
  ### Bridges Mitigating Loneliness
  Kind companionship brings structure and brightness back. Discussing over a cup of tea, baking, or taking dynamic strolls in public parks ignites neural focus, offsets retirement blues, and wards off late-life depression.
  
  ### Protecting Independence at Home
  Remaining inside one\'s beloved physical home is a primary human desire. When lifting becomes exhaustive and groceries turn heavy, housekeeping caretakers protect normal routines. We minimize chores so seniors stay anchored in safe, familiar environments.
  
  ### Vital Respite for Family Relatives
  Kin caretakers coordinating careers, children, and parents easily touch exhaustion. Entrusting certified helpers secures priceless hours of guilt-free personal recovery time.
  
  Recall that the German Care Insurance Fund supplies €125 every calendar month (from level 1 upwards), meaning these services involve zero private out-of-pocket costs for registered individuals!`,
      author: 'Dr. rer. med. Hans-Peter Beck',
      date: 'April 28, 2026',
      readTime: '6 min. read',
      image: 'https://picsum.photos/seed/caregivers/600/400',
      tags: ['Senior Health', 'Companionship', 'SGB XI Care']
    },
    {
      id: 'art3',
      title: 'Five Star Hotel Laundry Care: Secret Methods for Premium Fabric Preservation',
      category: 'Lifestyle',
      excerpt: 'Tired of grey white shirts and stiff towels? Our experts reveal how to keep textiles soft and shining for years.',
      content: `We lose several aggregate hours washing, air-drying, and pressing clothes. Yet apparel looks dull quickly and towels end up rough as sandpaper. Improve your laundry standards with these simple pro protocols:
  
  ### 1. Liquid Dosage Constraints
  The largest error in domestic laundry is over-applying washing agents. Excess detergents embed tightly into fabric fibers, causing structural stiffness and magnetically pulling room dust. Reduce application down to 2/3 of normal specs.
  
  ### 2. White Vinegar over Chemical Fabric Softeners
  Commercial softeners leave greasy membranes, spoiling absorbing properties of luxury towels. Instead, feed a tiny shot of standard kitchen white vinegar into the softener dock. It completely counters lime elements and washes out silently – leaving zero residual odor!
  
  ### 3. Separation Protocols
  Never scrub rough denims against delicate synthetics. Intense washer tumbler friction tears fine fibers, triggering pilling (those tiny fabric fuzz rolls).
  
  Our specialists follow these high-standard routines daily at client households. Trust your favorite apparel with certified experts!`,
      author: 'Gabriele Becker, Lead Domestic Liaison',
      date: 'April 4, 2026',
      readTime: '4 min. read',
      image: 'https://picsum.photos/seed/laundry/600/400',
      tags: ['Lifestyle', 'Laundry Care', 'Domestic Routines']
    }
  ]
};

const LOCALIZED_TIMELINE_EVENTS: Record<Language, Array<{ year: string; title: string; text: string }>> = {
  de: [
    { year: '2021', title: 'Gründung in Berlin', text: 'Gründung des Emmasco Reinigungsteams durch Gründerin Emma Osei in Berlin-Pankow, zunächst spezialisiert auf anspruchsvolle Privatwohnungsreinigung.' },
    { year: '2022', title: 'Präqualifizierung & Kassen-Zertifikat', text: 'Erfolgreiche staatliche Anerkennung nach § 45a SGB XI. Damit können unsere Kunden die Leistungen über den Entlastungsbetrag direkt mit den Pflegekassen abrechnen.' },
    { year: '2023', title: 'Eröffnung Büro Prenzlauer Berg', text: 'Einzug in unser modernes Büro an der lebendigen Schönhauser Allee 163, Berlin-Prenzlauer Berg für eine bessere Erreichbarkeit und Koordination.' },
    { year: '2024', title: 'Erweiterung Alltagsbegleitung', text: 'Aufbau eines eigenen Bereichs für Senioren- und Alltagsbegleitung mit qualifizierten Alltagsbegleitern zur Förderung seelischer und sozialer Gesundheit.' },
    { year: '2025', title: 'Zertifizierung zur Klimaneutralität', text: 'Einführung von 100% ökologischen Reinigungsmitteln und Umstellung unseres Team-Fuhrparks auf moderne Elektrofahrzeuge.' },
    { year: '2026', title: 'Über 500 aktive Kunden', text: 'Etablierung als eine der führenden, familiengeführten Haushaltshilfen- und Reinigungsagenturen im Berliner Norden.' }
  ],
  en: [
    { year: '2021', title: 'Founded in Berlin', text: 'Establishment of EMMASCO Cleaning Team by Emma Osei in Berlin-Pankow, initially focusing on high-end private flat cleaning.' },
    { year: '2022', title: 'State License & Care Fund Registry', text: 'Obtained official German certification according to SGB XI §45a, allowing clients to refund their domestic aid directly with public health care funds.' },
    { year: '2023', title: 'Prenzlauer Berg Corporate Offices', text: 'Relocated into our current physical headquarters at Schönhauser Allee 163, Berlin-Prenzlauer Berg to secure optimal team logistics.' },
    { year: '2024', title: 'Expanded Everyday Companionship', text: 'Inaugurated a dedicated caregiver division with SGB certified companions supporting elderly citizens suffering from urban isolation.' },
    { year: '2025', title: 'Eco-Rating Achievement', text: 'Integrated 100% bio-degradable sanitation substances and swapped our operations fleet into 100% electric clean vehicles.' },
    { year: '2026', title: 'Over 500 Active Clients', text: 'Firmly positioned as one of the leading family-run companion and housekeeping companies in Northern Berlin.' }
  ]
};

const LOCALIZED_TEAM_MEMBERS: Record<Language, Array<{ name: string; role: string; bio: string; image: string }>> = {
  de: [
    {
      name: 'Emma Osei',
      role: 'Gründerin & Geschäftsführerin',
      bio: 'Mit über 15 Jahren Erfahrung in Hospitality und pflege gründete sie EMMASCO, um haushaltsnahe Hilfe mit echter familiärer Empathie zu verknüpfen.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Marcus Becker',
      role: 'Leiter Alltagsbegleitung',
      bio: 'Ausgebildeter Alltagsbegleiter nach § 45b. Er koordiniert unsere Angebote für Senioren und pflegt engen Kontakt zu den Pflegekassen.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Gabriele Nowak',
      role: 'Bereichsleiterin Hauswirtschaft',
      bio: 'Sie leitet die Qualitätssicherung der Reinigungsangebote an und sorgt dafür, dass unser Team modernste, schonende Reinigungsmethoden einsetzt.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ],
  en: [
    {
      name: 'Emma Osei',
      role: 'Founder & CEO',
      bio: 'Leveraging over 15 years in hospitality and family welfare, she built EMMASCO to link housekeeping services with genuine emotional empathy.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Marcus Becker',
      role: 'Director of Companionship',
      bio: 'Registered companion worker under SGB §45b. He aligns senior plans and manages direct invoices with care insurance funds.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Gabriele Nowak',
      role: 'Head of Domestic Keeping',
      bio: 'Ensures quality control operations across all homes and introduces eco-friendly cleaning techniques to the staff.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ]
};

const LOCALIZED_COMPANY_VALUES: Record<Language, Array<{ title: string; text: string }>> = {
  de: [
    { title: 'Herzlichkeit & Respekt', text: 'Wir behandeln jeden Kunden wie ein Familienmitglied – mit Würde, Geduld und echtem Lächeln.' },
    { title: 'Absolute Zuverlässigkeit', text: 'Pünktlichkeit und die exakte Einhaltung von Absprachen sind das Fundament unseres Erfolgs.' },
    { title: 'Transparente Ehrlichkeit', text: 'Keine versteckten Verträge, keine versteckten Kosten. Volle Abrechnungsklarheit für Pflegekassen und Privatkunden.' },
    { title: 'Höchste Hygiene', text: 'Professionell geschultes Personal, das modernste rückstandsfreie und hautverträgliche Verfahren anwendet.' }
  ],
  en: [
    { title: 'Warmth & Respect', text: 'We view every customer as a part of our extended family – with dignity, patience, and visual warmth.' },
    { title: 'Absolute Reliability', text: 'Punctuality and meticulous compliance regarding scheduling are the pillars of our success.' },
    { title: 'Transparent Honesty', text: 'No lock-in clauses, no hidden setups. Plain billing clarity for public funds and private accounts.' },
    { title: 'Supreme Hygiene', text: 'Professionally trained workforce employing state-of-the-art biological cleaning methods.' }
  ]
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('emmasco_lang');
    return (saved === 'de' || saved === 'en') ? saved : 'de';
  });

  useEffect(() => {
    localStorage.setItem('emmasco_lang', language);
    // Dynamically adjust HTML metadata lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let dict: any = DICTIONARY[language];
    
    // Check direct key mapping first for simple flattening
    if (dict[key]) {
      return dict[key];
    }

    // Fallback simple traversal
    for (const k of keys) {
      if (dict && dict[k]) {
        dict = dict[k];
      } else {
        // Fallback to German if key missing in English dictionary
        let deFallback: any = DICTIONARY['de'];
        if (deFallback[key]) return deFallback[key];
        for (const deK of keys) {
          if (deFallback && deFallback[deK]) deFallback = deFallback[deK];
          else return key; // return raw key if missing completely
        }
        return typeof deFallback === 'string' ? deFallback : key;
      }
    }
    return typeof dict === 'string' ? dict : key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      services: LOCALIZED_SERVICES[language],
      testimonials: LOCALIZED_TESTIMONIALS[language],
      faqs: LOCALIZED_FAQS[language],
      blogArticles: LOCALIZED_BLOG_ARTICLES[language],
      timelineEvents: LOCALIZED_TIMELINE_EVENTS[language],
      teamMembers: LOCALIZED_TEAM_MEMBERS[language],
      companyValues: LOCALIZED_COMPANY_VALUES[language]
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
