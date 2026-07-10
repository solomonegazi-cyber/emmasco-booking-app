/**
 * Emmasco Theme Companion - Services Module
 * Dynamic service catalog and category tab filter system.
 */

window.SERVICES_DATA = [
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

window.renderServices = function (filterCat = 'all') {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';

    const lang = window.activeLang || 'de';
    const filtered = window.SERVICES_DATA.filter(s => filterCat === 'all' || s.category === filterCat);

    filtered.forEach(s => {
        const title = lang === 'de' ? s.title_de : s.title_en;
        const desc = lang === 'de' ? s.description_de : s.description_en;
        const detailed = lang === 'de' ? s.detailed_de : s.detailed_en;

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
                    <span class="block text-[9px] uppercase font-black text-slate-400 tracking-wider">${lang === 'de' ? 'Tarifsatz' : 'Rate'}</span>
                    <span class="text-xs font-black text-slate-750 dark:text-white">${s.price}</span>
                </div>
                <button data-service-id="${s.id}" class="booking-trigger-btn px-3 py-1.5 bg-[#0056D6]/10 hover:bg-[#0056D6] hover:text-white text-[#0056D6] dark:text-blue-400 dark:hover:bg-blue-600 rounded-xl text-[10px] font-black transition-all">
                    ${lang === 'de' ? 'Buchen' : 'Book'}
                </button>
            </div>
        `;
        servicesGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

window.initServices = function () {
    const tabBtns = document.querySelectorAll('.service-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('service-tab-btn', 'active', 'bg-[#0056D6]', 'text-white'));
            tabBtns.forEach(b => b.classList.add('border-slate-100', 'dark:border-slate-800'));
            
            this.classList.add('active', 'bg-[#0056D6]', 'text-white');
            this.classList.remove('border-slate-100', 'dark:border-slate-800');

            const cat = this.getAttribute('data-cat');
            window.renderServices(cat);
        });
    });

    // Event delegation on services-grid to avoid inline onclick triggers on dyamic buttons
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
        servicesGrid.addEventListener('click', function (e) {
            const trigger = e.target.closest('.booking-trigger-btn');
            if (trigger) {
                const serviceId = trigger.getAttribute('data-service-id');
                const serviceDropdown = document.getElementById('bm-service');
                if (serviceDropdown) {
                    serviceDropdown.value = serviceId;
                    serviceDropdown.dispatchEvent(new Event('change'));
                }
                const bookingSection = document.getElementById('booking-anchor');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Run first render
    window.renderServices('all');
};
