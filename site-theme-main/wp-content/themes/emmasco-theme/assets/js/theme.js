/**
 * Emmasco Reinigungsteam Theme Companion JavaScript
 * Coordinates dynamic translations, service tab filters, dark mode, 
 * FAQ accordions, billing sliders, AJAX postings, and jsPDF invoice creation.
 *
 * @package Emmasco_Theme
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // Refresh Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. THEME STORAGE & DARK MODE STATE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('emmasco_theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('emmasco_theme', 'dark');
            }
        });
    }

    /* ==========================================================================
       2. MOBILE DRAWER TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileDrawer.classList.toggle('hidden');
        });

        // Close when link clicked
        document.querySelectorAll('.mobile-drawer-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.add('hidden');
            });
        });
    }

    /* ==========================================================================
       3. LANGUAGE DICTIONARIES & TRANSLATIONS
       ========================================================================== */
    const langDicts = {
        de: {
            navServices: 'Unsere Leistungen',
            navAbout: 'Über Uns',
            navGallery: 'Galerie',
            navFAQ: 'Häufige Fragen',
            navBlog: 'Ratgeber',
            navContact: 'Kontakt',
            btnNavBook: 'Jetzt Buchen',
            heroBadge: 'Qualifizierte Pflege & Glanz in Berlin',
            heroTitle1: 'Haushaltshilfe &',
            heroTitleAccent: 'Alltagsbegleitung',
            heroTitle2: 'mit Herz und Empathie.',
            heroDesc: 'Wir entlasten Senioren im Alltag, pflegen Ihr Zuhause glänzend sauber und unterstützen pflegende Angehörige. Staatlich anerkannt – zu 100% über alle Pflegekassen abrechenbar.',
            feature1Title: 'SGB XI Entlastungsbetrag',
            feature1Desc: 'Abrechnung direkt mit allen Kassen',
            feature2Title: 'Premium-Reinheit',
            feature2Desc: 'Professionell, gründlich & diskret',
            btnBooking: 'Kostenloses Angebot anfordern',
            btnReadMore: 'Leistungen entdecken',
            totalRatings: 'Über 120+ verifizierte Kundenrezensionen',
            badgeTitle: 'Staatlich Anerkannt',
            badgeDesc: 'Wir erfüllen alle gesetzlichen Normen des deutschen Staates für Betreuungs- und Entlastungsleistungen nach § 45a SGB XI.',
            bullet1: '100% pflegekassentauglich',
            bullet2: 'Volle Unterstützung ab Pflegegrad 1',
            bullet3: 'Ohne Zuzahlung möglich',
            sectionServicesLabel: 'UNSER PROGRAMM',
            sectionServicesTitle: 'Maßgeschneiderte Hilfen für Ihr Zuhause',
            sectionServicesDesc: 'Filtern Sie unsere Leistungen nach Ihren Wünschen. Jede Leistung ist flexibel buchbar und qualifiziert aufbereitet.',
            tabAll: 'Alle',
            tabHousehold: 'Haushalt & Alltag',
            tabCleaning: 'Reinigung',
            tabCompanion: 'Kassenbegleitung',
            tabZusatz: 'Zusatzleistung',
            galLabel: 'PREMIUM RESULTATE',
            galTitle: 'Vorher / Nachher Vergleich',
            galDesc: 'Sehen Sie, welchen Unterschied das EMMASCO-Reinigungsteam in der Praxis macht.',
            galItem1Title: 'Badezimmer Sanierung',
            galItem1Desc: 'Beseitigung extremer Kalkflecken und Tiefenschmutz-Versiegelung.',
            galItem2Title: 'Küche & Oberflächen',
            galItem2Desc: 'Gründliche Herdreinigung, desinfizierte Schrankfronten.',
            galItem3Title: 'Fenster- & Glasflächen',
            galItem3Desc: 'Streifenfreie Glasreinigung inklusive der äußeren Fensterbänke.',
            aboutLabel: 'ÜBER UNS',
            aboutTitle: 'Familiärer Halt in Zeiten des Wandels',
            aboutDesc: 'Wir glauben, dass hervorragende Hauswirtschaftspflege und Alltagsbegleitung auf Vertrauen und Empathie beruhen. Unser Team in Berlin-Mitte und Pankow entlastet Sie zuverlässig im Alltag.',
            val1: 'Respekt & Wärme',
            val1Desc: 'Wir behandeln Sie wie unsere Familie.',
            val2: '101% Verlässlichkeit',
            val2Desc: 'Vereinbarte Termine halten wir pünktlich.',
            val3: 'Volle Transparenz',
            val3Desc: 'Stundengenaue Abrechnung.',
            val4: 'Professionelle Reinigung',
            val4Desc: 'Rückstandsfreie, ökologische Reinigung.',
            evt1Title: 'Gründung in Berlin',
            evt1Desc: 'Beginn der Geschäftstätigkeit mit Spezialisierung auf anspruchsvolle Haushalte im Raum Pankow.',
            evt2Title: 'Präqualifizierung & Anerkennung',
            evt2Desc: 'Erfolgreiches Anerkennungsverfahren nach § 45a SGB XI für den monatlichen Entlastungsbetrag der Pflegekassen.',
            evt3Title: 'Aufbau Alltagsbegleitung',
            evt3Desc: 'Ausbau der Angebote auf anerkannte Senioren- und Alltagsbetreuungen mit Herz.',
            evt4Title: 'Über 500 aktive Kunden',
            evt4Desc: 'Etablierung als eine der führenden, familiengeführten privaten Dienstleisteragenturen im Berliner Norden.',
            bookLabel: 'ONLINE RESERVIERUNG',
            bookTitle: 'Stellen Sie Ihre Buchungsanfrage ein',
            bookDesc: 'Geben Sie Ihre Wünsche ein. Unser Team berechnet Ihr Budget und kontaktiert Sie umgehend mit einer Vorlage.',
            formName: 'Ihr Name *',
            formEmail: 'Ihr E-Mail-Adresse *',
            formPhone: 'Telefonnummer *',
            formService: 'Wählen Sie Dienstleistung',
            formAddress: 'Adresse Berlin (Pankow / Mitte / Wedding) *',
            formDate: 'Wunschtermin Datum *',
            formTime: 'Wunsch Uhrzeit *',
            formNotes: 'Spezielle Notizen (optional)',
            btnSubmitBooking: 'Anfrage senden & digital verarbeiten',
            calcTitle: 'Budget-Kalkulator (Live)',
            calcDesc: 'Ihr transparenter Kostenvoranschlag im Rahmen des Entlastungsbetrags.',
            calcLineService: 'Gewählte Leistung:',
            calcLineTerm: 'Termingrösse (Basis):',
            calcLineVat: 'Umsatzsteuer:',
            exempt: '0% (§4 UStG befreit)',
            calcLineRefund: 'Kostenerstattung (§45a):',
            refundVal: 'Bis zu 100% Kasse',
            hoursEstLabel: 'GESAMTKOSTEN (EST.)',
            coveredText: '100% Kasse',
            invoiceTitle: 'Ihre Rechnungen & Belege',
            invoiceDesc: 'Laden Sie Ihre Rechnungen direkt als PDF für die Pflegekasse herunter.',
            noInvoices: 'Noch keine Buchung getätigt. Rechnungen erscheinen nach Ihrer ersten Buchungsanfrage.',
            reviewLabel: 'DANKBARE STIMMEN',
            reviewTitle: 'Kundenberichte aus ganz Berlin',
            reviewDesc: 'Wir pflegen mit Stolz und Freude. Erfahren Sie, was Senioren und deren Angehörige über uns schreiben.',
            t1Text: '"Die Alltagsbegleitung des Emmasco Teams ist ein Segen für uns. Frau Schmidt kommt wöchentlich, hilft im Haushalt und geht mit meiner Mutter spazieren. Die Abrechnung läuft direkt über die Pflegekasse nach §45a."',
            t2Text: '"Wir buchen EMMASCO für unsere Praxisreinigung in der Schönhauser Allee. Die Pünktlichkeit, Gründlichkeit und Hygiene nach gesetzlichen Vorgaben sind absolut tadellos. Sehr zu empfehlen!"',
            t3Text: '"Nach der Geburt unserer Zwillinge hat uns die Haushaltshilfe von Emmasco sehr entlastet. Wäsche bügeln, aufräumen, gründlich saugen – sie waren pünktlich da und machten einen super Job."',
            faqLabel: 'WISSENSWERTES',
            faqTitle: 'Häufig gestellte Fragen',
            faqDesc: 'Alles Wichtige zu Abrechnung, Anerkennung nach SGB XI und Haftpflichtschutz.',
            blogLabel: 'RATGEBER & TIpps',
            blogTitle: 'Frische Beiträge aus unserem Team',
            blogDesc: 'Wissenswertes rund um Wäschepflege, SGB XI Entlastungsbeträge und effiziente Haushaltsorganisation.',
            artTitle1: 'Frühjahrsputz leicht gemacht: Tipps vom Profiteam',
            artExcerpt1: 'Erfahren Sie, wie Sie strukturiert vorgehen, um Spinnweben zu bekämpfen, Kalk zu beseitigen und streifenfreie Fensterergebnisse zu erzielen.',
            artTitle2: 'Gesundes Altern & psychische Aktivierung',
            artExcerpt2: 'Soziale Isolation ist im Rentenalter gefährlich. Wie qualifizierte Alltagsbegleitung und Unterstützung Lebensfreude zurückbringen können.',
            artTitle3: 'Wäschepflege & faserschonende Reinigung',
            artExcerpt3: 'Weiße Wäsche richtig bleichen, Essig statt Weichspüler verwenden und die Waschmitteldosierung für ein weiches Ergebnis präzise anpassen.',
            cntLabel: 'KONTAKTIERE UNS',
            cntTitle: 'Haben Sie Fragen? Sprechen Sie uns an!',
            cntDesc: 'Unser Innendienst an der Schönhauser Allee in Prenzlauer Berg berät Sie gerne unverbindlich zu Budgets, Kassenabrechnungspfaden und Kooperationsmöglichkeiten.',
            cfSubject: 'Betreff *',
            cfMsg: 'Ihre Nachricht *',
            cfSubmitBtn: 'Nachricht absenden',
            footerIntro: 'Ihr anerkannter, familiengeführter Dienstleister für liebevolle Alltagsbegleitung, Haushaltshilfe (§45a SGB XI) und erstklassige gewerbliche Reinigung in ganz Berlin.',
            certifiedBadge: '§ 45a SGB XI Anerkennungsverfahren',
            footerServicesTitle: 'Dienstleistungen',
            footerQuickTitle: 'Quick Links',
            footerContactTitle: 'Kontakt & Büro',
            noPageContent: 'Keine Inhalte für diese Seite gefunden.',
            waTooltip: 'Fragen? Schreiben Sie uns direkt auf WhatsApp!',
            waTitle: 'WhatsApp Beratung',
            waStatus: 'Online • Antwortet meist sofort',
            waIntro: 'Haben Sie Fragen zur Haushaltshilfe, Alltagsbegleitung oder Abrechnung mit der Pflegekasse? Senden Sie uns einfach eine Nachricht!',
            waBtnSend: 'In WhatsApp fortfahren',
            previewTitle: 'Nachrichten-Vorschau',
            service1: 'Haushaltshilfe SGB XI',
            service2: 'Alltagsbegleitung',
            service3: 'Entlastungsbetrag',
            service4: 'Unterhaltsreinigung',
            service5: 'Büroreinigung (B2B)'
        },
        en: {
            navServices: 'Our Services',
            navAbout: 'About Us',
            navGallery: 'Gallery',
            navFAQ: 'Common FAQs',
            navBlog: 'Advisor Articles',
            navContact: 'Contact Us',
            btnNavBook: 'Book Appt',
            heroBadge: 'Qualified Care Assistance & Sparkling Homes',
            heroTitle1: 'Housekeeping &',
            heroTitleAccent: 'Care Companion',
            heroTitle2: 'with Grace and Empathy.',
            heroDesc: 'We ease senior citizens\' chores, keep homes hygienically clean, and support loving relatives. Officially certified – direct 100% reimbursement by all German nursing insurance funds.',
            feature1Title: 'SGB XI Covered Allowance',
            feature1Desc: 'Direct-billing with all insurance carriers',
            feature2Title: 'Premium Cleanliness',
            feature2Desc: 'Professional, detailed & confidential care',
            btnBooking: 'Receive Custom Offer',
            btnReadMore: 'Explore Packages',
            totalRatings: 'Over 120+ authentic client testimonials',
            badgeTitle: 'Staatlich Anerkannt',
            badgeDesc: 'Officially approved by Berlin medical registries for relief as well as companion care SGB XI § 45a.',
            bullet1: '100% insurance compatible',
            bullet2: 'Full support beginning with Care Level 1',
            bullet3: 'Zero net out-of-pocket costs options',
            sectionServicesLabel: 'OUR SERVICES',
            sectionServicesTitle: 'Bespoke Services for Your Comfort',
            sectionServicesDesc: 'Easily filter by program topic. Every package is fully customizable and professionally delivered.',
            tabAll: 'All',
            tabHousehold: 'Home Chores',
            tabCleaning: 'Cleaning',
            tabCompanion: 'Assisted Companionship',
            tabZusatz: 'Extra services',
            galLabel: 'PREMIUM RESULTS',
            galTitle: 'Before / After Transforms',
            galDesc: 'Inspect actual results from EMMASCO cleaning sessions in Berlin.',
            galItem1Title: 'Deep Bathroom Polish',
            galItem1Desc: 'Eradicated persistent lime deposits and water stains.',
            galItem2Title: 'Kitchen Deep Treatment',
            galItem2Desc: 'Complete stovetop and cabinetry polish.',
            galItem3Title: 'Streak-Free Windows',
            galItem3Desc: 'Window frame and exterior glass deep wipe.',
            aboutLabel: 'ABOUT US',
            aboutTitle: 'Trust and Empathy in Changing Times',
            aboutDesc: 'We believe outstanding care is built on true respect and deep connection. Our certified staff takes care of homes and senior citizens wth professional dedication.',
            val1: 'Warmth & Respect',
            val1Desc: 'We treat our clients like family members.',
            val2: '101% Security',
            val2Desc: 'We never miss or reschedule bookings.',
            val3: 'Full Clarity',
            val3Desc: 'Billing is documented hour by hour.',
            val4: 'Elite Cleanliness',
            val4Desc: 'We use premium non-toxic eco cleansers.',
            evt1Title: 'Gründung in Berlin',
            evt1Desc: 'Began business operations focused on family households in Pankow district.',
            evt2Title: 'Accreditation SGB XI',
            evt2Desc: 'Formally recognized for Entlastungsbetrag reimbursement services in Germany.',
            evt3Title: 'Companionship Addition',
            evt3Desc: 'Established specialized companionship support with emotional training.',
            evt4Title: '500+ Active Clients',
            evt4Desc: 'Grown to be the premium family-run care and cleaning provider in Berlin-North.',
            bookLabel: 'ONLINE RESERVATION',
            bookTitle: 'Create Your Service Request',
            bookDesc: 'Input details. Our administrative office calculates standard rates and replies instantly.',
            formName: 'Full Name *',
            formEmail: 'E-mail Address *',
            formPhone: 'Phone Number *',
            formService: 'Select Service Line',
            formAddress: 'Berlin Service Address *',
            formDate: 'Requested Appointment Date *',
            formTime: 'Requested Slot Time *',
            formNotes: 'Special Instructions (optional)',
            btnSubmitBooking: 'Submit Request & Download Copy',
            calcTitle: 'Live Budget Estimator',
            calcDesc: 'Transparent estimates formatted directly for insurance submittals.',
            calcLineService: 'Chosen Service:',
            calcLineTerm: 'Length (Standard):',
            calcLineVat: 'VAT Rate:',
            exempt: '0% (Exempt per §4 UStG)',
            calcLineRefund: 'Reimbursement Coverage:',
            refundVal: 'Up to 100% eligible',
            hoursEstLabel: 'ESTIMATED TOTAL BUDGET',
            coveredText: '100% Covered',
            invoiceTitle: 'Invoices & Receipts',
            invoiceDesc: 'Instantly download PDF files formatted for your insurance file.',
            noInvoices: 'No booking made yet. Receipts populate here as soon as you submit.',
            reviewLabel: 'HAPPY VOICES',
            reviewTitle: 'Client Stories from Berlin',
            reviewDesc: 'We care for citizens with absolute pride. Read reviews from clients and children.',
            t1Text: '"The companion service is a godsend. Ms. Schmidt arrives weekly, helps tidy, and goes on walks with my mom. Direct billing to insurance fund is incredibly smooth."',
            t2Text: '"We employ EMMASCO for clinical cleaning in Schönhauser Allee. Punctuality, hygiene standards and documentation are absolutely flawless. Highest recommendation!"',
            t3Text: '"After our twins were born, EMMASCO housekeeping was a savior. Ironing, cleanups, detailed vacuums – they delivered amazing outputs right on time."',
            faqLabel: 'KNOWLEDGE BASE',
            faqTitle: 'Frequently Asked Questions',
            faqDesc: 'Everything you need to know about Care Level funding, coverage limits and insurance.',
            blogLabel: 'TIPS & STRATEGIES',
            blogTitle: 'Latest Posts from our Experts',
            blogDesc: 'Helpful advice about laundry care, caregiver relief allowances, and home tidiness.',
            artTitle1: 'Spring Cleanings: Professional Strategical Tips',
            artExcerpt1: 'Tackle heavy dust, scrub calcified bathroom spots, and wipe tricky window rims to create pristine atmospheres.',
            artTitle2: 'Caregiver Mental Health and Social Activities',
            artExcerpt2: 'Combat senior isolation. How loving companion care stimulates spirits, keeps brains active, and aids families.',
            artTitle3: 'Five-Star Laundry Operations & Care',
            artExcerpt3: 'Maintain bright white fabrics, replace heavy softener with eco alternatives, and adjust doses for soft touch.',
            cntLabel: 'CONTACT US',
            cntTitle: 'Send a Message directly to our Office',
            cntDesc: 'Our central office staff at Schönhauser Allee in Prenzlauer Berg stands ready to assist you regarding nursing budgets.',
            cfSubject: 'Inquiry Subject *',
            cfMsg: 'Detailed Message *',
            cfSubmitBtn: 'Submit Inquiry',
            footerIntro: 'Your certified family cleaning and support companion agency across Berlin. Highly accredited, fully insured.',
            certifiedBadge: 'Authorized per § 45a SGB XI',
            footerServicesTitle: 'Services',
            footerQuickTitle: 'Quick Links',
            footerContactTitle: 'Contact details',
            noPageContent: 'No content found for this search.',
            waTooltip: 'Have questions? Chat with our team live!',
            waTitle: 'WhatsApp Support',
            waStatus: 'Online • Average reply immediate',
            waIntro: 'Need clarification on budget limits or scheduling? Text us on WhatsApp right away!',
            waBtnSend: 'Chat in WhatsApp',
            previewTitle: 'Message Live Preview',
            service1: 'Housekeeping SGB XI',
            service2: 'Assisted Companion',
            service3: 'Care Allowance (Entlastung)',
            service4: 'Residential Cleaning',
            service5: 'Office Cleaning (B2B)'
        }
    };

    let activeLang = localStorage.getItem('emmasco_lang') || 'de';

    function applyTranslation() {
        // Set Language toggle button text
        const langToggleBtn = document.getElementById('lang-switch-btn');
        if (langToggleBtn) {
            langToggleBtn.innerText = activeLang === 'de' ? 'EN' : 'DE';
        }

        // Search for all components with data-translate Attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langDicts[activeLang] && langDicts[activeLang][key]) {
                // If it is an input or textarea, translate placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', langDicts[activeLang][key]);
                } else {
                    element.innerHTML = langDicts[activeLang][key];
                }
            }
        });

        // Re-run dynamic calculators & selectors to catch dynamic terms
        updateBudgetCalculator();
        triggerWhatsAppPreview();
    }

    // Toggle click
    const langToggleBtn = document.getElementById('lang-switch-btn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function () {
            activeLang = activeLang === 'de' ? 'en' : 'de';
            localStorage.setItem('emmasco_lang', activeLang);
            applyTranslation();
        });
    }

    /* ==========================================================================
       4. DYNAMIC SERVICES CATALOG AND FILTER (REACT FIDELITY)
       ========================================================================== */
    const SERVICES_DATA = [
        {
            id: 'haushaltshilfe',
            title_de: 'Haushaltshilfe',
            title_en: 'Housekeeping Service',
            category: 'haushalt',
            description_de: 'Unterstützung beim Aufräumen, Spülen, Wäsche bügeln und der allgemeinen Organisation Ihres Zuhauses.',
            detailed_de: 'Bügeln, Aufräumen, Betten beheben und allgemeine Reinigungsarbeiten. Abrechenbar direkt über die Pflegekasse dank Anerkennung nach §45a SGB XI.',
            description_en: 'Assistance with tidying up, laundry, dishwashing, and general home organization.',
            detailed_en: 'Structured tidyings, closet sorts, laundry care. Full reimbursement possible.',
            price: 'ab 29,90 € / Std.',
            priceValue: 29.90,
            icon: 'home',
            popular: true
        },
        {
            id: 'reinigung',
            title_de: 'Unterhaltsreinigung',
            title_en: 'Routine Home Cleaning',
            category: 'reinigung',
            description_de: 'Regelmäßige, professionelle Reinigung Ihrer Wohnräume für ein stets frisches und hygienisches Gefühl.',
            detailed_de: 'Wir säubern Böden, desinfizieren Bäder, polieren Küchenzeilen und Oberflächen im Wunschintervall.',
            description_en: 'Scheduled, deep cleanups for rooms to stay fresh. Weekly or bi-weekly cycles.',
            detailed_en: 'Wiping floors, cleaning shower cubicles, dusting layouts.',
            price: 'ab 34,90 € / Std.',
            priceValue: 34.90,
            icon: 'sparkles',
            popular: false
        },
        {
            id: 'einkaufshilfe',
            title_de: 'Einkaufshilfe',
            title_en: 'Grocery shopping care',
            category: 'haushalt',
            description_de: 'Einkaufen von Lebensmitteln, Holen von Medikamenten und Erledigung wichtiger Besorgungen.',
            detailed_de: 'Wir planen mit Ihnen den Einkauf, fahren zum Biosupermarkt, besorgen Rezepte aus der Apotheke.',
            description_en: 'Purchasing daily supplies, getting prescribed medications, and basic runs.',
            detailed_en: 'Personalized list executions, delivery to kitchen counters.',
            price: 'ab 28,50 € / Std.',
            priceValue: 28.50,
            icon: 'shopping-cart',
            popular: false
        },
        {
            id: 'alltagsbegleitung',
            title_de: 'Alltagsbegleitung',
            title_en: 'Care Companionship',
            category: 'begleitung',
            description_de: 'Gesellschaft, Begleitung zu wichtigen Arztterminen, Spaziergänge und Unterhaltung.',
            detailed_de: 'Empathische Begleitung zu Fuß, Vorlesen, gemeinsame Kaffee-Nachmittage. Gut für Psyche und Geist.',
            description_en: 'Patient companionships, doctor transport support, and cozy social activities.',
            detailed_en: 'Reading, doing memory training, walk assists.',
            price: 'ab 29,00 € / Std.',
            priceValue: 29.00,
            icon: 'heart-handshake',
            popular: true
        },
        {
            id: 'angehoerige',
            title_de: 'Entlastung für Angehörige',
            title_en: 'Caregiver Respite Relief',
            category: 'begleitung',
            description_de: 'Regelmäßige, pflegende Entlastung für stundenweise Auszeiten der Angehörigen.',
            detailed_de: 'Gönnen Sie sich Erholung und tanken Sie Lebenskraft. Wir übernehmen die Betreuung vor Ort.',
            description_en: 'Hourly respite care for relatives to take well-deserved breathing breaks.',
            detailed_en: 'Safe care during temporary family absences.',
            price: 'ab 31,50 € / Std.',
            priceValue: 31.50,
            icon: 'user-check',
            popular: false
        },
        {
            id: 'fenster',
            title_de: 'Fensterreinigung',
            title_en: 'Streak-Free Window Polish',
            category: 'zusatz',
            description_de: 'Streifenfreier Glanz für Scheiben, Rahmen und Fensterbänke im privaten Bereich.',
            detailed_de: 'Fensterputzen ohne Schlieren mit allen biologischen Abziehern. Schnell erledigt.',
            description_en: 'Pristine exterior window wiping including frames and sills.',
            detailed_en: 'Equipped with professional telescopic wipes.',
            price: 'Auf Anfrage',
            priceValue: 45.00,
            icon: 'glass-water',
            popular: false
        },
        {
            id: 'buero',
            title_de: 'Büroreinigung (B2B)',
            title_en: 'Commercial Office Cleans',
            category: 'zusatz',
            description_de: 'Professioneller Reinigungsdienst für Gewerberäume, Kanzleien und Praxen.',
            detailed_de: 'Hygienische Desinfektion von Tischen, Konferenzräumen und Sanitärbereichen nach Arbeitsende.',
            description_en: 'Reliable cleaning loops for offices, law firms, and medical clinics.',
            detailed_en: 'Flexible sanitizing operations according to certified health standards.',
            price: 'ab 39,90 € / Std.',
            priceValue: 39.90,
            icon: 'briefcase',
            popular: false
        },
        {
            id: 'deepclean',
            title_de: 'Grundreinigung / Deep Clean',
            title_en: 'Deep Spring Cleaning',
            category: 'reinigung',
            description_de: 'Intensive Grundreinigung bis in den letzten Winkel, ideal bei Einzug oder Auszug.',
            detailed_de: 'Komplette Entkalkung von Fliesen, Fettentfernung aus Backöfen, Heizkörperreinigung.',
            description_en: 'Heavy duty, comprehensive cleanups for moving, seasons or events.',
            detailed_en: 'Degreasing ovens, descaling grout, tile deep rubs.',
            price: 'ab 44,95 € / Std.',
            priceValue: 44.95,
            icon: 'shield-alert',
            popular: false
        }
    ];

    function renderServices(filterCat = 'all') {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = '';

        const filtered = SERVICES_DATA.filter(s => filterCat === 'all' || s.category === filterCat);

        filtered.forEach(s => {
            const title = activeLang === 'de' ? s.title_de : s.title_en;
            const desc = activeLang === 'de' ? s.description_de : s.description_en;
            const detailed = activeLang === 'de' ? s.detailed_de : s.detailed_en;

            const popularBadge = s.popular ? `
                <span class="absolute top-4 right-4 bg-[#0056D6] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">Popular</span>
            ` : '';

            const card = document.createElement('div');
            card.className = 'card-minimal p-6 border border-blue-50/50 dark:border-slate-800 relative space-y-4 flex flex-col justify-between animate-fade-in';
            card.innerHTML = `
                <div>
                    ${popularBadge}
                    <div class="w-12 h-12 bg-blue-50 dark:bg-slate-900 border border-blue-100/50 dark:border-slate-800 text-[#0056D6] dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-sm">
                        <i data-lucide="${s.icon}" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white">${title}</h3>
                    <p class="text-xs text-slate-500 leading-relaxed mt-2">${desc}</p>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mt-2 font-serif bg-slate-50/55 dark:bg-slate-900/40 p-2 rounded-xl">${detailed}</p>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span class="block text-[9px] uppercase font-black text-slate-400 tracking-wider">${activeLang === 'de' ? 'Tarifsatz' : 'Rate'}</span>
                        <span class="text-xs font-black text-slate-750 dark:text-white">${s.price}</span>
                    </div>
                    <a href="#booking-anchor" onclick="document.getElementById('bm-service').value='${s.id}'; document.getElementById('bm-service').dispatchEvent(new Event('change'));" class="px-3 py-1.5 bg-[#0056D6]/10 hover:bg-[#0056D6] hover:text-white text-[#0056D6] dark:text-blue-400 dark:hover:bg-blue-600 rounded-xl text-[10px] font-black transition-all">
                        ${activeLang === 'de' ? 'Buchen' : 'Book'}
                    </a>
                </div>
            `;
            servicesGrid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Tab Clicks listeners
    const tabBtns = document.querySelectorAll('.service-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('service-tab-btn', 'active', 'bg-[#0056D6]', 'text-white'));
            tabBtns.forEach(b => b.classList.add('border-slate-100', 'dark:border-slate-800'));
            
            this.classList.add('active', 'bg-[#0056D6]', 'text-white');
            this.classList.remove('border-slate-100', 'dark:border-slate-800');

            const cat = this.getAttribute('data-cat');
            renderServices(cat);
        });
    });

    // Boot initial trigger
    renderServices('all');


    /* ==========================================================================
       5. FAQ ACCORDIONS SELECTOR STATE
       ========================================================================== */
    const faqBtns = document.querySelectorAll('.faq-accordion-header');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const body = this.nextElementSibling;
            const icon = this.querySelector('[data-lucide="chevron-down"]');
            
            const wasHidden = body.classList.contains('hidden');
            
            // Close all
            document.querySelectorAll('.faq-accordion-body').forEach(b => b.classList.add('hidden'));
            document.querySelectorAll('.faq-accordion-header [data-lucide="chevron-down"]').forEach(i => i.style.transform = 'rotate(0deg)');
            
            if (wasHidden) {
                body.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
                body.classList.add('animate-fade-in');
            }
        });
    });


    /* ==========================================================================
       6. LIVE PRICE ESTIMATES CALCULATOR
       ========================================================================== */
    const serviceSelectInput = document.getElementById('bm-service');
    function updateBudgetCalculator() {
        if (!serviceSelectInput) return;
        const sId = serviceSelectInput.value;
        const found = SERVICES_DATA.find(x => x.id === sId);
        if (!found) return;

        const liveServiceLabel = document.getElementById('live-service-label');
        const livePayoutAmount = document.getElementById('live-payout-amount');
        if (liveServiceLabel) {
            liveServiceLabel.innerText = activeLang === 'de' ? found.title_de : found.title_en;
        }

        // Compute estimate assuming base 2 hours visitation
        const estTotalValue = found.priceValue * 2;
        if (livePayoutAmount) {
            livePayoutAmount.innerText = estTotalValue.toFixed(2).replace('.', ',') + ' €';
        }
    }

    if (serviceSelectInput) {
        serviceSelectInput.addEventListener('change', updateBudgetCalculator);
        updateBudgetCalculator();
    }


    /* ==========================================================================
       7. LOCAL INVOICE DATABASE & JSDFP PDF DOWNLOAD ENGINE
       ========================================================================== */
    const STORAGE_KEY_INVOICES = 'emmasco_local_invoices';
    function getStoredInvoices() {
        const raw = localStorage.getItem(STORAGE_KEY_INVOICES);
        return raw ? JSON.parse(raw) : [];
    }

    function addInvoiceToStore(invoiceObj) {
        const invoices = getStoredInvoices();
        invoices.unshift(invoiceObj); // absolute newest first
        localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
        renderLocalInvoices();
    }

    function renderLocalInvoices() {
        const tray = document.getElementById('wp-local-invoices-tray');
        if (!tray) return;

        const invoices = getStoredInvoices();
        if (invoices.length === 0) {
            tray.innerHTML = `
                <div class="text-center py-6 text-slate-400 text-xs font-semibold" id="empty-invoice-placeholder" data-translate="noInvoices">
                    Noch keine Buchung getätigt. Rechnungen erscheinen nach Ihrer ersten Buchungsanfrage.
                </div>
            `;
            return;
        }

        tray.innerHTML = '';
        invoices.forEach(inv => {
            const item = document.createElement('div');
            item.className = 'border border-blue-200/50 dark:border-slate-800 bg-blue-50/15 dark:bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center transition shadow-xs animate-fade-in mb-3';
            item.innerHTML = `
                <div class="text-left space-y-0.5">
                    <span class="block font-extrabold text-blue-950 dark:text-slate-200 text-xs">${inv.serviceName}</span>
                    <span class="block text-[10px] text-slate-500 dark:text-slate-400">${inv.invoiceNo} | ${inv.date} | ${inv.totalPrice.toFixed(2)} €</span>
                </div>
                <button class="invoice-dl-btn p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer" data-id="${inv.id}" title="${activeLang==='de'?'PDF herunterladen':'Download PDF Invoice'}">
                    <i data-lucide="download" class="w-4 h-4"></i>
                </button>
            `;
            tray.appendChild(item);
        });

        // Add PDF downloading actions to dynamically rendered buttons
        tray.querySelectorAll('.invoice-dl-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const matched = invoices.find(x => x.id == id);
                if (matched) {
                    generateWpInvoicePdf(matched);
                }
            });
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // PDF Compiler Structure using window.jspdf.jsPDF
    function generateWpInvoicePdf(invData) {
        if (typeof window.jspdf === 'undefined') {
            alert('PDF-Bibliothek lädt noch. Bitte versuchen Sie es gleich erneut.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Color Presets
        const brandBlue = '#0056D6';
        const darkCharcoal = '#1A202C';

        // Elegant top design header block
        doc.setFillColor(7, 94, 84); // WhatsApp emerald/dark
        doc.rect(0, 0, 210, 40, 'F');

        // Brand Title
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('EMMASCO REINIGUNGSTEAM', 15, 18);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Anerkannter Dienstleister SGB XI • Pflegerecht §45a', 15, 26);
        doc.text('Schönhauser Allee 163, 10435 Berlin', 15, 31);

        // Metadata box
        doc.setTextColor(darkCharcoal);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('REGULÄRE RECHNUNGSVORSCHAU', 15, 60);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Rechnungsnr.: ${invData.invoiceNo}`, 15, 70);
        doc.text(`Rechnungsdatum: ${invData.date}`, 15, 76);
        doc.text('Abrechnungswert: Versicherungsleistung (§45a SGB XI)', 15, 82);

        // Customer details
        doc.setFont('helvetica', 'bold');
        doc.text('EMPFÄNGER (KUNDE):', 120, 70);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${invData.customerName}`, 120, 76);
        doc.text(`E-Mail: ${invData.email}`, 120, 82);
        doc.text(`Mobilnr.: ${invData.phone}`, 120, 88);
        doc.text(`Adresse: ${invData.address}`, 120, 94);

        // Divider
        doc.setDrawColor(220, 225, 230);
        doc.line(15, 105, 195, 105);

        // Table Block
        doc.setFont('helvetica', 'bold');
        doc.text('Dienstleistung / Beschreibung', 15, 115);
        doc.text('Abrechenbare Einheiten', 110, 115);
        doc.text('Einzelsatz', 145, 115);
        doc.text('Betrag', 175, 115);

        doc.setFont('helvetica', 'normal');
        doc.text(invData.serviceName, 15, 125);
        // Display SGB coverage line
        doc.setFontSize(8);
        doc.setTextColor(110, 115, 120);
        doc.text('Entlastungsbegleitung gem. §45a SGB XI', 15, 131);
        doc.setFontSize(10);
        doc.setTextColor(darkCharcoal);

        doc.text('2.00 Std. (Basiszeit)', 110, 125);
        doc.text(`${(invData.totalPrice / 2).toFixed(2)} €`, 145, 125);
        doc.text(`${invData.totalPrice.toFixed(2)} €`, 175, 125);

        doc.setDrawColor(220, 225, 230);
        doc.line(15, 140, 195, 140);

        // Pricing aggregates
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Gesamtbetrag (Netto):', 115, 153);
        doc.text(`${invData.totalPrice.toFixed(2)} €`, 170, 153);

        doc.setFontSize(10);
        doc.text('Umsatzsteuer (0% befreit):', 115, 161);
        doc.text('0,00 €', 170, 161);

        doc.setFontSize(13);
        doc.setTextColor(0, 86, 214);
        doc.text('Zu erstatten durch Kasse:', 115, 172);
        doc.text(`${invData.totalPrice.toFixed(2)} €`, 170, 172);
        doc.setTextColor(darkCharcoal);

        // Instruction details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('HINWEISE ZUR KOSTENERSTATTUNG:', 15, 190);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const instructions = [
            '1. Reichen Sie diese Rechnung direkt bei Ihrer zuständigen Pflegekasse ein.',
            '2. Der Entlastungsbetrag nach § 45a SGB XI (125,00 EUR / Monat) deckt diese Aufwendungen ab.',
            '3. Bei direktem Abtretungsverfahren übermitteln wir diese Belege digital an Ihre Kasse.',
            'Vielen Dank für Ihre Buchungsanfrage und Ihr Vertrauen!'
        ];
        let yPos = 198;
        instructions.forEach(line => {
            doc.text(line, 15, yPos);
            yPos += 6;
        });

        // Signatures block
        doc.setFont('helvetica', 'italic');
        doc.text('Emma Osei, Geschäftsführung', 15, 245);
        doc.line(15, 241, 75, 241);

        // Save PDF trigger
        doc.save(`invoice_${invData.invoiceNo}.pdf`);
    }

    renderLocalInvoices();


    /* ==========================================================================
       8. WP/AJAX BOOKING AND CONTACT SUBMISSIONS VIA NONCES
       ========================================================================== */
    const bookingForm = document.getElementById('emmasco-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('span');
            const originalBtnHtml = submitBtn.innerHTML;

            // Gather inputs
            const customerName = document.getElementById('bm-name').value;
            const email = document.getElementById('bm-email').value;
            const phone = document.getElementById('bm-phone').value;
            const address = document.getElementById('bm-address').value;
            const serviceId = document.getElementById('bm-service').value;
            const selectValText = document.getElementById('bm-service').options[document.getElementById('bm-service').selectedIndex].text;
            const dateVal = document.getElementById('bm-date').value;
            const timeVal = document.getElementById('bm-time').value;
            const notes = document.getElementById('bm-notes').value;

            // Loading status
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            if (submitBtnText) submitBtnText.innerText = activeLang === 'de' ? 'Übertrage...' : 'Sending...';

            // Post AJAX to WP standard receiver
            jQuery.ajax({
                url: emmasco_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'emmasco_book',
                    security: emmasco_ajax.nonce,
                    customerName: customerName,
                    email: email,
                    phone: phone,
                    address: address,
                    serviceId: serviceId,
                    date: dateVal,
                    time: timeVal,
                    notes: notes
                },
                success: function (response) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalBtnHtml;

                    const msgBox = document.getElementById('booking-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'bg-emerald-50', 'text-emerald-800');
                        if (response.success) {
                            msgBox.classList.add('bg-emerald-50', 'text-emerald-800');
                            msgBox.innerHTML = activeLang === 'de' ? 
                                `✓ <strong>Herrliche Buchung registriert!</strong><br>Anfrage #${response.data.booking_id} erfolgreich empfangen. Beleg wurde im Panel generiert.` :
                                `✓ <strong>Booking Successful!</strong><br>Inquiry #${response.data.booking_id} registered. Beleg generated below.`;
                            
                            // Save generated invoice to localStorage to enable immediate high-fidelity testing
                            const localizedDate = response.data.date;
                            const invoiceNo = response.data.invoice_no;
                            const totalPrice = response.data.total_price;

                            const invoiceObj = {
                                id: Date.now(),
                                invoiceNo: invoiceNo,
                                serviceName: selectValText,
                                date: localizedDate,
                                customerName: customerName,
                                email: email,
                                phone: phone,
                                address: address,
                                totalPrice: totalPrice
                            };

                            addInvoiceToStore(invoiceObj);
                            bookingForm.reset();

                            // Instantly compile PDF for guest
                            generateWpInvoicePdf(invoiceObj);
                        } else {
                            msgBox.classList.add('bg-red-50', 'text-red-800');
                            msgBox.innerText = response.data.message || 'Error occurred.';
                        }
                    }
                },
                error: function () {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalBtnHtml;

                    const msgBox = document.getElementById('booking-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden');
                        msgBox.classList.add('bg-red-50', 'text-red-800');
                        msgBox.innerText = 'Serverfehler beim Übermitteln. Bitte überprüfen Sie Ihre Internetverbindung.';
                    }
                }
            });
        });
    }

    // Contact Form AJAX Submit
    const contactForm = document.getElementById('emmasco-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('span');
            const originalBtnHtml = submitBtn.innerHTML;

            const name = document.getElementById('cf-name').value;
            const email = document.getElementById('cf-email').value;
            const phone = document.getElementById('cf-phone').value;
            const subject = document.getElementById('cf-subject').value;
            const message = document.getElementById('cf-message').value;

            // Loading status
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            if (submitBtnText) submitBtnText.innerText = activeLang === 'de' ? 'Übertrage...' : 'Sending...';

            jQuery.ajax({
                url: emmasco_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'emmasco_contact',
                    security: emmasco_ajax.nonce,
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message
                },
                success: function (response) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalBtnHtml;

                    const msgBox = document.getElementById('contact-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'bg-emerald-50', 'text-emerald-800');
                        if (response.success) {
                            msgBox.classList.add('bg-emerald-50', 'text-emerald-800');
                            msgBox.innerHTML = activeLang === 'de' ? 
                                `✓ <strong>Vielen Dank!</strong> Ihre Nachricht wurde erfolgreich an unser Team gesendet.` :
                                `✓ <strong>Thank you!</strong> Your message has been successfully transmitted to our team.`;
                            contactForm.reset();
                        } else {
                            msgBox.classList.add('bg-red-50', 'text-red-800');
                            msgBox.innerText = response.data.message || 'Error occurred.';
                        }
                    }
                },
                error: function () {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalBtnHtml;

                    const msgBox = document.getElementById('contact-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden');
                        msgBox.classList.add('bg-red-50', 'text-red-800');
                        msgBox.innerText = 'Serverfehler beim Posten. Bitte kontaktieren Sie uns per Mail.';
                    }
                }
            });
        });
    }


    /* ==========================================================================
       9. FLOATING WHATSAPP REQUISITION ENGINE 
       ========================================================================== */
    const waLauncher = document.getElementById('wa-launcher-btn');
    const waDialog = document.getElementById('wp-wa-dialog');
    const waTooltip = document.getElementById('wp-wa-tooltip');

    const waInputName = document.getElementById('wa-input-name');
    const waSelectService = document.getElementById('wa-select-service');
    const waInputText = document.getElementById('wa-input-text');
    const waSubmitBtn = document.getElementById('wa-submit-trigger');

    function toggleWaDialog() {
        if (!waDialog) return;
        const isOpen = !waDialog.classList.contains('hidden');
        if (isOpen) {
            waDialog.classList.add('hidden');
            document.getElementById('wa-ic-close').classList.add('hidden');
            document.getElementById('wa-ic-open').classList.remove('hidden');
        } else {
            waDialog.classList.remove('hidden');
            waDialog.classList.add('animate-fade-in');
            document.getElementById('wa-ic-open').classList.add('hidden');
            document.getElementById('wa-ic-close').classList.remove('hidden');
            if (waTooltip) waTooltip.classList.add('hidden');
        }
    }

    if (waLauncher) {
        waLauncher.addEventListener('click', toggleWaDialog);
    }

    const waCloseBtn = document.getElementById('wa-close-btn');
    if (waCloseBtn) {
        waCloseBtn.addEventListener('click', toggleWaDialog);
    }

    const waDismissBtn = document.getElementById('wa-dismiss-btn');
    if (waDismissBtn) {
        waDismissBtn.addEventListener('click', function() {
            if (waTooltip) waTooltip.classList.add('hidden');
        });
    }

    // Tooltip timer trigger - briefly shows after 5 seconds to prompt guest engagement
    setTimeout(() => {
        if (waTooltip && waDialog && waDialog.classList.contains('hidden')) {
            waTooltip.classList.remove('hidden');
            waTooltip.classList.add('animate-fade-in');
        }
    }, 6000);

    // Live pre filled template computed text
    function getWhatsAppMessageText() {
        const uName = (waInputName && waInputName.value.trim()) ? waInputName.value.trim() : (activeLang === 'de' ? 'Gast' : 'Guest');
        const sChoice = (waSelectService) ? waSelectService.options[waSelectService.selectedIndex].text : 'Haushaltshilfe';
        const uMessage = (waInputText && waInputText.value.trim()) ? waInputText.value.trim() : (activeLang==='de' ? 'Ich würde mich über ein unverbindliches Beratungsgespräch freuen.' : 'I would love to receive a free assessment.');

        let baseMsg = '';
        if (activeLang === 'de') {
            baseMsg = `Hallo EMMASCO-Team! 🌸\n\nMein Name ist *${uName}*.\n\nIch interessiere mich für Ihre Dienstleistung: *${sChoice}*.\n\n${uMessage}\n\nViele Grüße!`;
        } else {
            baseMsg = `Hello EMMASCO Team! 🌸\n\nMy name is *${uName}*.\n\nI am interested in your service: *${sChoice}*.\n\n${uMessage}\n\nBest regards!`;
        }
        return baseMsg;
    }

    function triggerWhatsAppPreview() {
        const previewParagraph = document.getElementById('wa-msg-preview-paragraph');
        if (previewParagraph) {
            const rawMsg = getWhatsAppMessageText();
            previewParagraph.innerText = rawMsg.replaceAll('*', '');
        }
    }

    if (waInputName) {
        waInputName.addEventListener('input', triggerWhatsAppPreview);
    }
    if (waSelectService) {
        waSelectService.addEventListener('change', triggerWhatsAppPreview);
    }
    if (waInputText) {
        waInputText.addEventListener('input', triggerWhatsAppPreview);
    }

    // Trigger initial preview
    triggerWhatsAppPreview();

    // Redirect handler click
    if (waSubmitBtn) {
        waSubmitBtn.addEventListener('click', function() {
            const finalMsg = getWhatsAppMessageText();
            const encoded = encodeURIComponent(finalMsg);
            const waUrl = `https://wa.me/4917621856044?text=${encoded}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // Sync input user name from Booking form to WhatsApp input for faster interaction
    const customerNameInput = document.getElementById('bm-name');
    if (customerNameInput) {
        customerNameInput.addEventListener('input', function() {
            if (waInputName) {
                waInputName.value = this.value;
                triggerWhatsAppPreview();
            }
        });
    }

    /* ==========================================================================
       9.5. SCROLL TRIGGER REVEAL ANIMATIONS (TESTIMONIALS)
       ========================================================================== */
    const scrollRevealElements = document.querySelectorAll('.fade-in-up-scroll');
    if (scrollRevealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const scrollObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        scrollObserver.unobserve(entry.target); // Trigger once
                    }
                });
            }, {
                root: null,
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            scrollRevealElements.forEach(function (el) {
                scrollObserver.observe(el);
            });
        } else {
            // Fallback for legacy clients
            scrollRevealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
        }
    }


    /* ==========================================================================
       10. BOOT SYNC ACTIVE TRANSLATIONS
       ========================================================================== */
    applyTranslation();
});
