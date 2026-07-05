<?php
/**
 * Emmasco Theme Front Page (Home template)
 *
 * @package Emmasco_Theme
 */

get_header();
?>

<!-- ==========================================================================
   1. HERO HEADER AREA
   ========================================================================== */
<section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-white via-blue-50/20 to-[#F6FAFF] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
    <!-- Ambient glowing graphics in background -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Info column -->
            <div class="lg:col-span-7 space-y-6 text-left">
                <!-- Trust Badge -->
                <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 dark:bg-blue-400/10 rounded-full border border-blue-500/20 dark:border-blue-400/20">
                    <span class="w-1.5 h-1.5 bg-[#0056D6] dark:bg-blue-400 rounded-full animate-ping"></span>
                    <span class="text-[10px] font-black tracking-widest text-[#0056D6] dark:text-blue-400 uppercase" data-translate="heroBadge">Qualifizierte Pflege & Glanz in Berlin</span>
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-850 dark:text-white leading-[1.1] tracking-tight">
                    <span data-translate="heroTitle1">Haushaltshilfe &</span><br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0056D6] to-[#2FB5FF] drop-shadow-sm font-black" data-translate="heroTitleAccent">Alltagsbegleitung</span><br>
                    <span data-translate="heroTitle2">mit Herz und Empathie.</span>
                </h1>

                <p class="text-base sm:text-lg text-slate-600 dark:text-slate-350 max-w-xl font-normal leading-relaxed" data-translate="heroDesc">
                    Wir entlasten Senioren im Alltag, pflegen Ihr Zuhause glänzend sauber und unterstützen pflegende Angehörige. Staatlich anerkannt – zu 100% über alle Pflegekassen abrechenbar.
                </p>

                <!-- Core Badges / Highlights -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div class="flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-blue-50/50 dark:border-slate-800/80">
                        <span class="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <i data-lucide="heart-handshake" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <span class="block text-xs font-black text-slate-700 dark:text-white" data-translate="feature1Title">SGB XI Entlastungsbetrag</span>
                            <span class="block text-[10px] text-slate-500" data-translate="feature1Desc">Abrechnung direkt mit allen Kassen</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-blue-50/50 dark:border-slate-800/80">
                        <span class="w-10 h-10 bg-[#0056D6]/10 text-[#0056D6] dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                            <i data-lucide="sparkles" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <span class="block text-xs font-black text-slate-700 dark:text-white" data-translate="feature2Title">Premium-Reinheit</span>
                            <span class="block text-[10px] text-slate-500" data-translate="feature2Desc">Professionell, gründlich & diskret</span>
                        </div>
                    </div>
                </div>

                <!-- CTAs -->
                <div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <a href="#booking-anchor" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0056D6] hover:bg-[#0047b3] text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span data-translate="btnBooking">Kostenloses Angebot anfordern</span>
                    </a>
                    <a href="#services-anchor" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-[#0056D6] dark:text-blue-400 font-extrabold text-sm rounded-2xl cursor-pointer border border-blue-100 dark:border-slate-800 shadow-sm transition-all">
                        <span data-translate="btnReadMore">Leistungen entdecken</span>
                    </a>
                </div>

                <!-- Trust signals -->
                <div class="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div class="flex items-center gap-1.5 cursor-pointer" onclick="document.getElementById('reviews-anchor').scrollIntoView({behavior:'smooth'})">
                        <div class="flex items-center text-amber-500">
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                        </div>
                        <span class="text-xs font-black text-slate-700 dark:text-white">4.9 / 5.0</span>
                    </div>
                    <div class="text-slate-400 text-xs font-semibold">
                        • <span class="ml-2 font-bold text-slate-600 dark:text-slate-300" data-translate="totalRatings">Über 120+ verifizierte Kundenrezensionen</span>
                    </div>
                </div>
            </div>

            <!-- Right Visual column -->
            <div class="lg:col-span-5 relative w-full flex items-center justify-center">
                <div class="relative w-full max-w-[450px] aspect-square rounded-full bg-gradient-to-tr from-[#0056D6]/20 to-[#2FB5FF]/20 dark:from-sky-500/10 dark:to-blue-500/10 p-10 flex items-center justify-center">
                    <div class="w-full h-full rounded-full bg-white dark:bg-slate-950 shadow-[0_20px_50px_rgba(0,86,214,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-8 border border-blue-50/50 dark:border-slate-800 text-center space-y-4">
                        <div class="w-16 h-16 bg-blue-50 text-[#0056D6] dark:bg-slate-900 dark:text-blue-400 rounded-3xl flex items-center justify-center relative shadow-sm">
                            <i data-lucide="badge-check" class="w-9 h-9"></i>
                            <span class="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">✓</span>
                        </div>
                        <h3 class="text-xl font-extrabold text-slate-800 dark:text-white" data-translate="badgeTitle">Staatlich Anerkannt</h3>
                        <p class="text-xs text-slate-500 leading-relaxed" data-translate="badgeDesc">
                            Wir erfüllen alle gesetzlichen Normen des deutschen Staates für Betreuungs- und Entlastungsleistungen nach § 45a SGB XI.
                        </p>
                        <ul class="text-[11px] font-bold text-[#0056D6] dark:text-blue-400 space-y-2 text-left bg-blue-50/40 dark:bg-slate-900/40 p-4 rounded-2xl w-full border border-blue-100/50 dark:border-slate-800">
                            <li class="flex items-center gap-1.5">
                                <i data-lucide="check" class="w-3.5 h-3.5 shrink-0 text-emerald-500"></i>
                                <span data-translate="bullet1">100% pflegekassentauglich</span>
                            </li>
                            <li class="flex items-center gap-1.5">
                                <i data-lucide="check" class="w-3.5 h-3.5 shrink-0 text-emerald-500"></i>
                                <span data-translate="bullet2">Volle Unterstützung ab Pflegegrad 1</span>
                            </li>
                            <li class="flex items-center gap-1.5">
                                <i data-lucide="check" class="w-3.5 h-3.5 shrink-0 text-emerald-500"></i>
                                <span data-translate="bullet3">Ohne Zuzahlung möglich</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   2. DYNAMIC SERVICE LIST WITH TAB FILTERS
   ========================================================================== -->
<section id="services-anchor" class="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <!-- Header title -->
        <div class="max-w-3xl mx-auto space-y-4">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="sectionServicesLabel">UNSER PROGRAMM</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white tracking-tight" data-translate="sectionServicesTitle">
                Maßgeschneiderte Hilfen für Ihr Zuhause
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto" data-translate="sectionServicesDesc">
                Filtern Sie unsere Leistungen nach Ihren Wünschen. Jede Leistung ist flexibel buchbar und qualifiziert aufbereitet.
            </p>
        </div>

        <!-- Filter tabs menu -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-4xl mx-auto">
            <button class="service-tab-btn active px-4 py-2 text-xs font-black rounded-xl border transition cursor-pointer" data-cat="all" data-translate="tabAll">Alle</button>
            <button class="service-tab-btn px-4 py-2 text-xs font-black rounded-xl border transition cursor-pointer" data-cat="haushalt" data-translate="tabHousehold">Haushalt & Alltag</button>
            <button class="service-tab-btn px-4 py-2 text-xs font-black rounded-xl border transition cursor-pointer" data-cat="reinigung" data-translate="tabCleaning">Reinigung</button>
            <button class="service-tab-btn px-4 py-2 text-xs font-black rounded-xl border transition cursor-pointer" data-cat="begleitung" data-translate="tabCompanion">Kassenbegleitung</button>
            <button class="service-tab-btn px-4 py-2 text-xs font-black rounded-xl border transition cursor-pointer" data-cat="zusatz" data-translate="tabZusatz">Zusatzleistung</button>
        </div>

        <!-- Catalog Grid -->
        <div id="services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left transition-all duration-300">
            <!-- Items injected dynamically via script of high fidelity -->
        </div>

    </div>
</section>


<!-- ==========================================================================
   3. BEFORE/AFTER SLIDER SECTION (PREMIUM METRICS)
   ========================================================================== -->
<section id="gallery-anchor" class="py-24 bg-[#F6FAFF] dark:bg-slate-900/60 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div class="max-w-3xl mx-auto space-y-4 mb-16">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="galLabel">PREMIUM RESULTATE</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="galTitle">Vorher / Nachher Vergleich</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400" data-translate="galDesc">Sehen Sie, welchen Unterschied das EMMASCO-Reinigungsteam in der Praxis macht.</p>
        </div>

        <!-- Slidings Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <!-- Card 1 -->
            <div class="bg-white dark:bg-slate-950 p-5 rounded-3xl shadow-sm border border-blue-50/50 dark:border-slate-800/80">
                <div class="relative w-full aspect-video rounded-2xl overflow-hidden group select-none">
                    <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=40&w=400" alt="Badezimmer Vorher" class="w-full h-full object-cover absolute inset-0">
                    <div class="slider-overlay absolute inset-0 bg-transparent transition-all duration-300 pointer-events-none"></div>
                    <!-- Half divider slider structure layout -->
                    <div class="absolute inset-y-0 right-0 left-1/2 overflow-hidden border-l-2 border-white pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=40&w=400" alt="Badezimmer Nachher" class="absolute inset-0 w-[400px] h-full object-cover max-w-none">
                    </div>
                    <!-- Labels -->
                    <span class="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Vorher</span>
                    <span class="absolute bottom-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Nachher</span>
                </div>
                <h3 class="text-sm font-extrabold text-slate-800 dark:text-white mt-4" data-translate="galItem1Title">Badezimmer Sanierung</h3>
                <p class="text-xs text-slate-500 leading-relaxed mt-1" data-translate="galItem1Desc">Beseitigung extremer Kalkflecken und Tiefenschmutz-Versiegelung.</p>
            </div>

            <!-- Card 2 -->
            <div class="bg-white dark:bg-slate-950 p-5 rounded-3xl shadow-sm border border-blue-50/50 dark:border-slate-800/80">
                <div class="relative w-full aspect-video rounded-2xl overflow-hidden group select-none">
                    <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=40&w=400" alt="Unterhaltsreinigung Vorher" class="w-full h-full object-cover absolute inset-0">
                    <div class="absolute inset-y-0 right-0 left-1/2 overflow-hidden border-l-2 border-white pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=40&w=400" alt="Wohnzimmer Nachher" class="absolute inset-0 w-[400px] h-full object-cover max-w-none">
                    </div>
                    <span class="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Vorher</span>
                    <span class="absolute bottom-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Nachher</span>
                </div>
                <h3 class="text-sm font-extrabold text-slate-800 dark:text-white mt-4" data-translate="galItem2Title">Küche & Oberflächen</h3>
                <p class="text-xs text-slate-500 leading-relaxed mt-1" data-translate="galItem2Desc">Gründliche Herdreinigung, desinfizierte Schrankfronten.</p>
            </div>

            <!-- Card 3 -->
            <div class="bg-white dark:bg-slate-950 p-5 rounded-3xl shadow-sm border border-blue-50/50 dark:border-slate-800/80">
                <div class="relative w-full aspect-video rounded-2xl overflow-hidden group select-none">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=40&w=400" alt="Fenster Vorher" class="w-full h-full object-cover absolute inset-0">
                    <div class="absolute inset-y-0 right-0 left-1/2 overflow-hidden border-l-2 border-white pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1549558549-415fa4fc37eb?auto=format&fit=crop&q=40&w=400" alt="Fenster Nachher" class="absolute inset-0 w-[400px] h-full object-cover max-w-none">
                    </div>
                    <span class="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Vorher</span>
                    <span class="absolute bottom-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Nachher</span>
                </div>
                <h3 class="text-sm font-extrabold text-slate-800 dark:text-white mt-4" data-translate="galItem3Title">Fenster- & Glasflächen</h3>
                <p class="text-xs text-slate-500 leading-relaxed mt-1" data-translate="galItem3Desc">Streifenfreie Glasreinigung inklusive der äußeren Fensterbänke.</p>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   4. ABOUT US & TIMELINE CHRONOLOGY
   ========================================================================== -->
<section id="about-anchor" class="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <!-- Left Bio Info -->
            <div class="lg:col-span-5 space-y-6 text-left">
                <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="aboutLabel">ÜBER UNS</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="aboutTitle">Familiärer Halt in Zeiten des Wandels</h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed" data-translate="aboutDesc">
                    Wir glauben, dass hervorragende Hauswirtschaftspflege und Alltagsbegleitung auf Vertrauen und Empathie beruhen. Unser Team in Berlin-Mitte und Pankow entlastet Sie zuverlässig im Alltag.
                </p>

                <!-- Core Values grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div class="space-y-1">
                        <span class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-[#0056D6]"></span>
                            <span data-translate="val1">Respekt & Wärme</span>
                        </span>
                        <p class="text-[11px] text-slate-400" data-translate="val1Desc">Wir behandeln Sie wie unsere Familie.</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-[#0056D6]"></span>
                            <span data-translate="val2">101% Verlässlichkeit</span>
                        </span>
                        <p class="text-[11px] text-slate-400" data-translate="val2Desc">Vereinbarte Termine halten wir pünktlich.</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-[#0056D6]"></span>
                            <span data-translate="val3">Volle Transparenz</span>
                        </span>
                        <p class="text-[11px] text-slate-400" data-translate="val3Desc">Stundengenaue Abrechnung.</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-[#0056D6]"></span>
                            <span data-translate="val4">Professionelle Reinigung</span>
                        </span>
                        <p class="text-[11px] text-slate-400" data-translate="val4Desc">Rückstandsfreie, ökologische Reinigung.</p>
                    </div>
                </div>
            </div>

            <!-- Right Timeline events -->
            <div class="lg:col-span-7 space-y-8 text-left border-l-2 border-blue-50 dark:border-slate-800 pl-6 relative">
                
                <!-- Event 2021 -->
                <div class="relative space-y-1">
                    <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#0056D6] border-4 border-white dark:border-slate-950"></div>
                    <span class="text-xs font-black text-[#0056D6] dark:text-blue-400">2021</span>
                    <h3 class="text-base font-extrabold text-slate-850 dark:text-white" data-translate="evt1Title">Gründung in Berlin</h3>
                    <p class="text-xs text-slate-500 leading-relaxed" data-translate="evt1Desc">Beginn der Geschäftstätigkeit mit Spezialisierung auf anspruchsvolle Haushalte im Raum Pankow.</p>
                </div>

                <!-- Event 2022 -->
                <div class="relative space-y-1">
                    <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#0056D6] border-4 border-white dark:border-slate-950"></div>
                    <span class="text-xs font-black text-[#0056D6] dark:text-blue-400">2022</span>
                    <h3 class="text-base font-extrabold text-slate-850 dark:text-white" data-translate="evt2Title">Präqualifizierung & Anerkennung</h3>
                    <p class="text-xs text-slate-500 leading-relaxed" data-translate="evt2Desc">Erfolgreiches Anerkennungsverfahren nach § 45a SGB XI für den monatlichen Entlastungsbetrag der Pflegekassen.</p>
                </div>

                <!-- Event 2024 -->
                <div class="relative space-y-1">
                    <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#0056D6] border-4 border-white dark:border-slate-950"></div>
                    <span class="text-xs font-black text-[#0056D6] dark:text-blue-400">2024</span>
                    <h3 class="text-base font-extrabold text-slate-850 dark:text-white" data-translate="evt3Title">Aufbau Alltagsbegleitung</h3>
                    <p class="text-xs text-slate-500 leading-relaxed" data-translate="evt3Desc">Ausbau der Angebote auf anerkannte Senioren- und Alltagsbetreuungen mit Herz.</p>
                </div>

                <!-- Event 2026 -->
                <div class="relative space-y-1">
                    <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950"></div>
                    <span class="text-xs font-black text-emerald-500">2026</span>
                    <h3 class="text-base font-extrabold text-slate-850 dark:text-white" data-translate="evt4Title">Über 500 aktive Kunden</h3>
                    <p class="text-xs text-slate-500 leading-relaxed" data-translate="evt4Desc">Etablierung als eine der führenden, familiengeführten privaten Dienstleisteragenturen im Berliner Norden.</p>
                </div>

            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   5. INTERACTIVE ONLINE BOOKING SYSTEM & INVOICE GENERATOR
   ========================================================================== -->
<section id="booking-anchor" class="py-24 bg-gradient-to-b from-[#F6FAFF] to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div class="max-w-3xl mx-auto space-y-4 mb-16">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="bookLabel">ONLINE RESERVIERUNG</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="bookTitle">Stellen Sie Ihre Buchungsanfrage ein</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400" data-translate="bookDesc">Geben Sie Ihre Wünsche ein. Unser Team berechnet Ihr Budget und kontaktiert Sie umgehend mit einer Vorlage.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
            
            <!-- Left Side: Interactive Form -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-blue-50/50 dark:border-slate-800 shadow-sm text-left">
                
                <!-- Security Nonce validation status -->
                <div id="booking-message-box" class="hidden mb-6 p-4 rounded-xl text-xs font-bold text-left animate-fade-in"></div>

                <form id="emmasco-booking-form" class="space-y-5">
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <!-- Customer Name -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formName">Ihr Name *</label>
                            <input type="text" id="bm-name" required placeholder="z.B. Marianne Schmidt" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                        </div>
                        <!-- Email -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formEmail">Ihr E-Mail-Adresse *</label>
                            <input type="email" id="bm-email" required placeholder="name@beispiel.de" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <!-- Phone -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formPhone">Telefonnummer *</label>
                            <input type="tel" id="bm-phone" required placeholder="z.B. 0176 123456" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                        </div>
                        <!-- Service ID -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formService">Wählen Sie Dienstleistung</label>
                            <div class="relative">
                                <select id="bm-service" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold appearance-none focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100 cursor-pointer">
                                    <option value="haushaltshilfe" selected>Haushaltshilfe</option>
                                    <option value="reinigung">Unterhaltsreinigung</option>
                                    <option value="einkaufshilfe">Einkaufshilfe</option>
                                    <option value="alltagsbegleitung">Alltagsbegleitung</option>
                                    <option value="angehoerige">Entlastung für Angehörige</option>
                                    <option value="fenster">Fensterreinigung</option>
                                    <option value="buero">Büroreinigung</option>
                                    <option value="deepclean">Grundreinigung (Deep Clean)</option>
                                </select>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Address -->
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formAddress">Adresse Berlin (Pankow / Mitte / Wedding) *</label>
                        <input type="text" id="bm-address" required placeholder="z.B. Wollwitzstraße 14, 10435 Berlin" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <!-- Date -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formDate">Wunschtermin Datum *</label>
                            <input type="date" id="bm-date" required class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                        </div>
                        <!-- Time -->
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formTime">Wunsch Uhrzeit *</label>
                            <input type="time" id="bm-time" required value="09:00" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100">
                        </div>
                    </div>

                    <!-- Notes -->
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formNotes">Spezielle Notizen (optional)</label>
                        <textarea id="bm-notes" rows="3" placeholder="z.B. Hund im Haus, Schlüssel liegt bei Nachbarn." class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100"></textarea>
                    </div>

                    <button type="submit" class="w-full py-4 rounded-2xl bg-[#0056D6] hover:bg-[#0047b3] text-white font-extrabold text-sm transition shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2">
                        <i data-lucide="check-circle" class="w-5 h-5"></i>
                        <span data-translate="btnSubmitBooking">Anfrage senden & digital verarbeiten</span>
                    </button>
                </form>
            </div>

            <!-- Right Side: Real-time calculation + Local Invoices widget -->
            <div class="lg:col-span-5 space-y-6">
                <!-- Live Price Estimator Card -->
                <div class="bg-gradient-to-tr from-[#0056D6] to-[#1E293B] text-white p-6 rounded-3xl text-left shadow-lg border border-blue-500/10">
                    <h3 class="text-lg font-black tracking-tight" data-translate="calcTitle">Budget-Kalkulator (Live)</h3>
                    <p class="text-xs text-white/70 leading-relaxed mt-1" data-translate="calcDesc">Ihr transparenter Kostenvoranschlag im Rahmen des Entlastungsbetrags.</p>
                    
                    <div class="h-px bg-white/10 my-4"></div>

                    <div class="space-y-3">
                        <div class="flex justify-between text-xs text-white/80">
                            <span data-translate="calcLineService">Gewählte Leistung:</span>
                            <span id="live-service-label" class="font-bold">Haushaltshilfe</span>
                        </div>
                        <div class="flex justify-between text-xs text-white/80">
                            <span data-translate="calcLineTerm">Termingrösse (Basis):</span>
                            <span>2.0 Stunden (Psch.)</span>
                        </div>
                        <div class="flex justify-between text-xs text-white/80">
                            <span data-translate="calcLineVat">Umsatzsteuer:</span>
                            <span data-translate="exempt">0% (§4 UStG befreit)</span>
                        </div>
                        <div class="flex justify-between text-xs text-white/80">
                            <span data-translate="calcLineRefund">Kostenerstattung (§45a):</span>
                            <span class="text-emerald-300 font-bold" data-translate="refundVal">Bis zu 100% Kasse</span>
                        </div>
                    </div>

                    <div class="h-px bg-white/10 my-4"></div>

                    <div class="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                        <div>
                            <span class="block text-[9px] uppercase tracking-wider text-white/60" data-translate="hoursEstLabel">GESAMTKOSTEN (EST.)</span>
                            <span id="live-payout-amount" class="text-2xl font-black">59,80 €</span>
                        </div>
                        <span class="text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/20 py-1 px-3 rounded-md border border-emerald-500/20" data-translate="coveredText">100% Kasse</span>
                    </div>
                </div>

                <!-- Generated PDF Invoices Area -->
                <div class="bg-white dark:bg-slate-900 border border-blue-50/50 dark:border-slate-800 p-6 rounded-3xl text-left shadow-xs">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <h3 class="text-sm font-extrabold text-slate-800 dark:text-white" data-translate="invoiceTitle">Ihre Rechnungen & Belege</h3>
                            <p class="text-[10px] text-slate-400 mt-0.5" data-translate="invoiceDesc">Laden Sie Ihre Rechnungen direkt als PDF für die Pflegekasse herunter.</p>
                        </div>
                    </div>

                    <div class="h-px bg-slate-100 dark:bg-slate-800/80 my-4"></div>

                    <!-- Client-side generated list -->
                    <div id="wp-local-invoices-tray" class="space-y-3">
                        <!-- Default placeholder -->
                        <div class="text-center py-6 text-slate-400 text-xs font-semibold" id="empty-invoice-placeholder" data-translate="noInvoices">
                            Noch keine Buchung getätigt. Rechnungen erscheinen nach Ihrer ersten Buchungsanfrage.
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   6. TESTIMONIALS & AGGREGATE REVIEWS SUMMARY
   ========================================================================== -->
<section id="reviews-anchor" class="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div class="max-w-3xl mx-auto space-y-4 mb-16">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="reviewLabel">DANKBARE STIMMEN</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="reviewTitle">Kundenberichte aus ganz Berlin</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400" data-translate="reviewDesc">Wir pflegen mit Stolz und Freude. Erfahren Sie, was Senioren und deren Angehörige über uns schreiben.</p>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div class="bg-blue-50/20 dark:bg-slate-900/60 p-6 rounded-3xl border border-blue-50/50 dark:border-slate-800/80 relative">
                <div class="flex items-center text-amber-500 mb-3">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                </div>
                <p class="text-xs text-slate-650 dark:text-slate-300 italic leading-relaxed" data-translate="t1Text">
                    "Die Alltagsbegleitung des Emmasco Teams ist ein Segen für uns. Frau Schmidt kommt wöchentlich, hilft im Haushalt und geht mit meiner Mutter spazieren. Die Abrechnung läuft direkt über die Pflegekasse nach §45a."
                </p>
                <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span class="block text-xs font-black text-slate-800 dark:text-white">Margarete S. (82J.) & Tochter</span>
                    <span class="block text-[10px] text-slate-400">Privatpflege (Berlin-Pankow)</span>
                </div>
                <i data-lucide="message-square" class="w-10 h-10 text-[#0056D6]/4 absolute bottom-5 right-5 pointer-events-none"></i>
            </div>

            <div class="bg-blue-50/20 dark:bg-slate-900/60 p-6 rounded-3xl border border-blue-50/50 dark:border-slate-800/80 relative">
                <div class="flex items-center text-amber-500 mb-3">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                </div>
                <p class="text-xs text-slate-650 dark:text-slate-300 italic leading-relaxed" data-translate="t2Text">
                    "Wir buchen EMMASCO für unsere Praxisreinigung in der Schönhauser Allee. Die Pünktlichkeit, Gründlichkeit und Hygiene nach gesetzlichen Vorgaben sind absolut tadellos. Sehr zu empfehlen!"
                </p>
                <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span class="block text-xs font-black text-slate-800 dark:text-white">Dr. Michael Wagner</span>
                    <span class="block text-[10px] text-slate-400">Praxisinhaber (Berlin-Mitte)</span>
                </div>
                <i data-lucide="message-square" class="w-10 h-10 text-[#0056D6]/4 absolute bottom-5 right-5 pointer-events-none"></i>
            </div>

            <div class="bg-blue-50/20 dark:bg-slate-900/60 p-6 rounded-3xl border border-blue-50/50 dark:border-slate-800/80 relative">
                <div class="flex items-center text-amber-500 mb-3">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                </div>
                <p class="text-xs text-slate-650 dark:text-slate-300 italic leading-relaxed" data-translate="t3Text">
                    "Nach der Geburt unserer Zwillinge hat uns die Haushaltshilfe von Emmasco sehr entlastet. Wäsche bügeln, aufräumen, gründlich saugen – sie waren pünktlich da und machten einen super Job."
                </p>
                <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span class="block text-xs font-black text-slate-800 dark:text-white">Familie Brandt</span>
                    <span class="block text-[10px] text-slate-400">Privathaushalt (Berlin-Wedding)</span>
                </div>
                <i data-lucide="message-square" class="w-10 h-10 text-[#0056D6]/4 absolute bottom-5 right-5 pointer-events-none"></i>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   7. DYNAMIC ACCORDION FAQS SYSTEM
   ========================================================================== -->
<section id="faq-anchor" class="py-24 bg-[#F6FAFF] dark:bg-slate-900/60 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div class="max-w-3xl mx-auto space-y-4 mb-16">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="faqLabel">WISSENSWERTES</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="faqTitle">Häufig gestellte Fragen</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400" data-translate="faqDesc">Alles Wichtige zu Abrechnung, Anerkennung nach SGB XI und Haftpflichtschutz.</p>
        </div>

        <div class="space-y-4 text-left">
            
            <!-- Item 1 -->
            <div class="bg-white dark:bg-slate-950 rounded-2xl border border-blue-50/80 dark:border-slate-800/80 overflow-hidden">
                <button class="faq-accordion-header w-full py-5 px-6 flex justify-between items-center font-bold text-sm text-slate-850 dark:text-white select-none cursor-pointer">
                    <span data-translate="faqq1">Was bedeutet die Anerkennung nach § 45a SGB XI?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-4"></i>
                </button>
                <div class="faq-accordion-body hidden px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/40 pt-3">
                    <p data-translate="faqa1">Als staatlich anerkannter Betreuungs- und Entlastungsdienst können wir unsere Leistungen direkt mit allen gesetzlichen und privaten Pflegekassen abrechnen. Wenn bei Ihnen oder Ihrem Angehörigen ein Pflegegrad (ab Pflegegrad 1) vorliegt, steht Ihnen ein monatlicher Entlastungsbetrag von 125 € zu. Diesen Betrag können Sie vollständig für unsere Haushaltshilfe, Einkaufshilfe und Alltagsbegleitung einsetzen.</p>
                </div>
            </div>

            <!-- Item 2 -->
            <div class="bg-white dark:bg-slate-950 rounded-2xl border border-blue-50/80 dark:border-slate-800/80 overflow-hidden">
                <button class="faq-accordion-header w-full py-5 px-6 flex justify-between items-center font-bold text-sm text-slate-850 dark:text-white select-none cursor-pointer">
                    <span data-translate="faqq2">Sind Ihre Mitarbeiter haftpflichtversichert?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-4"></i>
                </button>
                <div class="faq-accordion-body hidden px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/40 pt-3">
                    <p data-translate="faqa2">Selbstverständlich. Alle unsere Mitarbeiter im Reinigungsteam und in der Alltagsbegleitung sind vollumfänglich haftpflicht- und unfallversichert. Unser Personal nimmt zudem regelmäßig an Schulungen nach den SGB-Richtlinien teil, ist absolut diskret, freundlich und spricht fliesend Deutsch.</p>
                </div>
            </div>

            <!-- Item 3 -->
            <div class="bg-white dark:bg-slate-950 rounded-2xl border border-blue-50/80 dark:border-slate-800/80 overflow-hidden">
                <button class="faq-accordion-header w-full py-5 px-6 flex justify-between items-center font-bold text-sm text-slate-850 dark:text-white select-none cursor-pointer">
                    <span data-translate="faqq3">Wie hoch sind die Kosten und gibt es versteckte Einrichtungsgebühren?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-4"></i>
                </button>
                <div class="faq-accordion-body hidden px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/40 pt-3">
                    <p data-translate="faqa3">Bei uns herrscht absolute Preistransparenz. Unsere Stundenverrechnungssätze beginnen ab 28,50 € pro Stunde für qualifizierte Alltagsbegleitung und haushaltnahe Dienste im Rahmen des Entlastungsbetrags. Angebote für Glasreinigung, Büroreinigung und Sonderreinigungen kalkulieren wir fair und unverbindlich per Festpreis. Es gibt keine Mindestlaufzeiten oder versteckten Einrichtungspauschalen.</p>
                </div>
            </div>

            <!-- Item 4 -->
            <div class="bg-white dark:bg-slate-950 rounded-2xl border border-blue-50/80 dark:border-slate-800/80 overflow-hidden">
                <button class="faq-accordion-header w-full py-5 px-6 flex justify-between items-center font-bold text-sm text-slate-850 dark:text-white select-none cursor-pointer">
                    <span data-translate="faqq4">In welchen Berliner Bezirken bieten Sie Ihre Dienstleistungen an?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-4"></i>
                </button>
                <div class="faq-accordion-body hidden px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/40 pt-3">
                    <p data-translate="faqa4">Unser Firmensitz liegt am Prenzlauer Berg (Schönhauser Allee). Wir bedienen Berlin-Mitte, Pankow, Prenzlauer Berg, Weißensee, Wedding, Friedrichshain, Kreuzberg, Schöneberg, Charlottenburg und angrenzende Bezirke im Norden und Osten Berlins. Senden Sie uns einfach Ihre Postleitzahl!</p>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   8. COMPACT BLOG SECTION
   ========================================================================== -->
<section id="blog-anchor" class="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div class="max-w-3xl mx-auto space-y-4 mb-16">
            <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="blogLabel">RATGEBER & TIpps</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="blogTitle">Frische Beiträge aus unserem Team</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400" data-translate="blogDesc">Wissenswertes rund um Wäschepflege, SGB XI Entlastungsbeträge und effiziente Haushaltsorganisation.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <!-- Post 1 -->
            <div class="bg-blue-50/15 dark:bg-slate-900/45 border border-blue-50/70 dark:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <img src="https://picsum.photos/seed/cleaning1/400/250" class="w-full h-full object-cover" alt="Blog Image 1">
                        <span class="absolute top-3 left-3 bg-[#0056D6] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">Cleaning Tips</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 font-bold block">10. Mai 2026 • 4 Min. Lesezeit</span>
                        <h3 class="text-base font-black text-slate-800 dark:text-white mt-1 hover:text-[#0056D6] transition-colors leading-snug" data-translate="artTitle1">Frühjahrsputz leicht gemacht: Tipps vom Profiteam</h3>
                        <p class="text-xs text-slate-500 line-clamp-3 mt-2" data-translate="artExcerpt1">Erfahren Sie, wie Sie strukturiert vorgehen, um Spinnweben zu bekämpfen, Kalk zu beseitigen und streifenfreie Fensterergebnisse zu erzielen.</p>
                    </div>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white">
                    <span>Emma Osei</span>
                    <a href="#booking-anchor" class="text-[#0056D6] hover:underline flex items-center gap-1">Read <i data-lucide="arrow-right" class="w-3 h-3"></i></a>
                </div>
            </div>

            <!-- Post 2 -->
            <div class="bg-blue-50/15 dark:bg-slate-900/45 border border-blue-50/70 dark:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <img src="https://picsum.photos/seed/caregivers/400/250" class="w-full h-full object-cover" alt="Blog Image 2">
                        <span class="absolute top-3 left-3 bg-[#0056D6] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">Health</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 font-bold block">28. April 2026 • 6 Min. Lesezeit</span>
                        <h3 class="text-base font-black text-slate-800 dark:text-white mt-1 hover:text-[#0056D6] transition-colors leading-snug" data-translate="artTitle2">Gesundes Altern & psychische Aktivierung</h3>
                        <p class="text-xs text-slate-500 line-clamp-3 mt-2" data-translate="artExcerpt2">Soziale Isolation ist im Rentenalter gefährlich. Wie qualifizierte Alltagsbegleitung und Unterstützung Lebensfreude zurückbringen können.</p>
                    </div>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white">
                    <span>Dr. Hans-Peter Beck</span>
                    <a href="#booking-anchor" class="text-[#0056D6] hover:underline flex items-center gap-1">Read <i data-lucide="arrow-right" class="w-3 h-3"></i></a>
                </div>
            </div>

            <!-- Post 3 -->
            <div class="bg-blue-50/15 dark:bg-slate-900/45 border border-blue-50/70 dark:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <img src="https://picsum.photos/seed/laundry/400/250" class="w-full h-full object-cover" alt="Blog Image 3">
                        <span class="absolute top-3 left-3 bg-[#0056D6] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">Lifestyle</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 font-bold block">04. April 2026 • 4 Min. Lesezeit</span>
                        <h3 class="text-base font-black text-slate-800 dark:text-white mt-1 hover:text-[#0056D6] transition-colors leading-snug" data-translate="artTitle3">Wäschepflege & faserschonende Reinigung</h3>
                        <p class="text-xs text-slate-500 line-clamp-3 mt-2" data-translate="artExcerpt3">Weiße Wäsche richtig bleichen, Essig statt Weichspüler verwenden und die Waschmitteldosierung für ein weiches Ergebnis präzise anpassen.</p>
                    </div>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white">
                    <span>Gaby Nowak</span>
                    <a href="#booking-anchor" class="text-[#0056D6] hover:underline flex items-center gap-1">Read <i data-lucide="arrow-right" class="w-3 h-3"></i></a>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ==========================================================================
   9. DIRECT CONTACT FORM SECTION
   ========================================================================== -->
<section id="contact-anchor" class="py-24 bg-[#F6FAFF] dark:bg-slate-900/60 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <!-- Contact info card -->
            <div class="lg:col-span-5 space-y-6 text-left">
                <span class="text-[11px] font-black uppercase text-[#0056D6] tracking-widest bg-blue-50 dark:bg-slate-900 px-3 py-1.5 rounded-md" data-translate="cntLabel">KONTAKTIERE UNS</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white" data-translate="cntTitle">Haben Sie Fragen? Sprechen Sie uns an!</h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed" data-translate="cntDesc">Unser Innendienst an der Schönhauser Allee in Prenzlauer Berg berät Sie gerne unverbindlich zu Budgets, Kassenabrechnungspfaden und Kooperationsmöglichkeiten.</p>
                
                <div class="space-y-4 pt-4">
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-950 text-[#0056D6] dark:text-blue-400 flex items-center justify-center shrink-0">
                            <i data-lucide="phone" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <span class="block text-[10px] text-slate-400 uppercase font-bold">Telefonischer Support</span>
                            <span class="block text-sm font-black text-slate-750 dark:text-white">0176 21856044</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-950 text-[#0056D6] dark:text-blue-400 flex items-center justify-center shrink-0">
                            <i data-lucide="mail" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <span class="block text-[10px] text-slate-400 uppercase font-bold">Direkte E-Mail</span>
                            <span class="block text-sm font-black text-slate-750 dark:text-white">solomonegazi@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AJAX Message form -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-blue-50/50 dark:border-slate-800 shadow-sm text-left">
                <div id="contact-message-box" class="hidden mb-6 p-4 rounded-xl text-xs font-bold text-left animate-fade-in"></div>

                <form id="emmasco-contact-form" class="space-y-5">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="labelName">Ihr Name</label>
                            <input type="text" id="cf-name" required placeholder="z.B. Sabine Schmidt" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formEmail">Ihr E-Mail *</label>
                            <input type="email" id="cf-email" required placeholder="sabine@gmx.de" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="formPhone">Telefonnummer</label>
                            <input type="tel" id="cf-phone" placeholder="z.B. 030 445588" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="cfSubject">Betreff *</label>
                            <input type="text" id="cf-subject" required placeholder="z.B. Beratung SGB XI Entlastung" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" data-translate="cfMsg">Ihre Nachricht *</label>
                        <textarea id="cf-message" rows="4" required placeholder="Schreiben Sie hier Ihre Frage..." class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100"></textarea>
                    </div>

                    <button type="submit" class="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                        <i data-lucide="send" class="w-4 h-4"></i>
                        <span data-translate="cfSubmitBtn">Nachricht absenden</span>
                    </button>
                </form>
            </div>

        </div>
    </div>
</section>

<!-- Load jsPDF from CDN dynamically inside home.php for invoice generation in theme.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<?php get_footer(); ?>
