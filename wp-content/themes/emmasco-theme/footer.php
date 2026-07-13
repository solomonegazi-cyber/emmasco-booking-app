<?php
/**
 * Emmasco Reinigungsteam Theme Footer template
 *
 * @package Emmasco_Theme
 */
?>
</main> <!-- Close Main Wrapper tag -->

<!-- Footer Section -->
<footer class="bg-white dark:bg-slate-950 border-t border-blue-50/70 dark:border-slate-800 text-left pt-16 pb-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            <!-- Col 1: Branding -->
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="w-10 h-10 bg-gradient-to-tr from-[#0056D6] to-[#2FB5FF] text-white rounded-2xl flex items-center justify-center shadow-md">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                    </span>
                    <div>
                        <span class="text-base font-black tracking-tight text-blue-950 dark:text-white block leading-none">
                            EMMASCO
                        </span>
                        <span class="text-[9px] font-black tracking-widest text-[#2FB5FF] uppercase block mt-1 leading-none">
                            REINIGUNGSTEAM
                        </span>
                    </div>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed" data-translate="footerIntro">
                    Ihr anerkannter, familiengeführter Dienstleister für liebevolle Alltagsbegleitung, Haushaltshilfe (§45a SGB XI) und erstklassige gewerbliche Reinigung in ganz Berlin.
                </p>
                <div class="flex items-center gap-2 mt-4 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 w-fit">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span data-translate="certifiedBadge">§ 45a SGB XI Anerkennungsverfahren</span>
                </div>
            </div>

            <!-- Col 2: Services -->
            <div>
                <h4 class="text-xs font-black uppercase text-[#0056D6] dark:text-[#2FB5FF] tracking-wider mb-5" data-translate="footerServicesTitle">
                    Dienstleistungen
                </h4>
                <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-350">
                    <li><a href="#services-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="service1">Haushaltshilfe SGB XI</a></li>
                    <li><a href="#services-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="service2">Alltagsbegleitung</a></li>
                    <li><a href="#services-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="service3">Entlastungsbetrag</a></li>
                    <li><a href="#services-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="service4">Unterhaltsreinigung</a></li>
                    <li><a href="#services-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="service5">Büroreinigung (B2B)</a></li>
                </ul>
            </div>

            <!-- Col 3: Quicklinks -->
            <div>
                <h4 class="text-xs font-black uppercase text-[#0056D6] dark:text-[#2FB5FF] tracking-wider mb-5" data-translate="footerQuickTitle">
                    Quick Links
                </h4>
                <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-350">
                    <li><a href="#about-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="navAbout">Über Uns</a></li>
                    <li><a href="#gallery-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="navGallery">Galerie</a></li>
                    <li><a href="#faq-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="navFAQ">Häufige Fragen</a></li>
                    <li><a href="#blog-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="navBlog">Ratgeber & News</a></li>
                    <li><a href="#booking-anchor" class="hover:text-[#0056D6] hover:underline" data-translate="btnNavBook">Jetzt Buchen</a></li>
                </ul>
            </div>

            <!-- Col 4: Contact Core -->
            <div>
                <h4 class="text-xs font-black uppercase text-[#0056D6] dark:text-[#2FB5FF] tracking-wider mb-5" data-translate="footerContactTitle">
                    Kontakt & Büro
                </h4>
                <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-350">
                    <li class="flex items-start gap-2">
                        <i data-lucide="map-pin" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i>
                        <span>Schönhauser Allee 163<br>10435 Berlin -- Germany</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i data-lucide="phone" class="w-4 h-4 text-slate-400"></i>
                        <span>0176 21856044</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i data-lucide="mail" class="w-4 h-4 text-slate-400"></i>
                        <span>solomonegazi@gmail.com</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
                        <span>Mo - Fr: 08:00 - 18:00</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="h-px bg-slate-100 dark:bg-slate-800 my-10"></div>

        <!-- Copyright Info -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
                &copy; <?php echo date('Y'); ?> Emmasco Reinigungsteam GmbH. Alle Rechte vorbehalten.
            </div>
            <div class="flex items-center gap-4">
                <a href="#impressum" class="hover:underline">Impressum</a>
                <span>•</span>
                <a href="#datenschutz" class="hover:underline">Datenschutz</a>
                <span>•</span>
                <span class="text-slate-400">Hostinger WordPress Optimized</span>
            </div>
        </div>
    </div>
</footer>

<!-- ==========================================================================
   6. DYNAMIC WHATSAPP CORNER SUPPORT WIDGET
   ========================================================================== -->
<div id="whats-app-floating-container" class="fixed bottom-6 right-6 z-[100] font-sans">
    
    <!-- Dynamic Tooltip -->
    <div id="wp-wa-tooltip" class="hidden absolute bottom-16 right-2 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 text-xs font-semibold leading-relaxed text-left flex items-start gap-2 select-none">
        <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white mt-0.5 animate-pulse">
            <i data-lucide="sparkles" class="w-3 h-3 fill-current text-white"></i>
        </div>
        <div>
            <p id="wa-tooltip-text" data-translate="waTooltip">Fragen? Schreiben Sie uns direkt auf WhatsApp!</p>
            <button id="wa-dismiss-btn" class="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-amber-400 mt-1.5 block cursor-pointer underline">
                Ausblenden
            </button>
        </div>
        <div class="absolute right-5 -bottom-2 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 rotate-45"></div>
    </div>

    <!-- Expanded Chat Widget Dialog -->
    <div id="wp-wa-dialog" class="hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 w-[350px] max-w-[calc(100vw-32px)] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col mb-18 relative text-left">
        
        <!-- Header -->
        <div class="bg-[#075E54] dark:bg-slate-950 p-4 pb-5 text-white flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-md relative">
                    <i data-lucide="message-circle" class="w-5 h-5 text-white fill-current"></i>
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
                </div>
                <div>
                    <h4 class="font-extrabold text-sm tracking-wide" data-translate="waTitle">WhatsApp Beratung</h4>
                    <span class="text-[10px] text-emerald-300 font-bold block mt-0.5 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                        <span data-translate="waStatus">Online • Antwortet meist sofort</span>
                    </span>
                </div>
            </div>
            <button id="wa-close-btn" class="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- Dialog Area -->
        <div class="p-4 max-h-[420px] overflow-y-auto space-y-4 bg-[#ECE5DD] dark:bg-slate-900/90">
            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed max-w-[90%] text-slate-800 dark:text-slate-100 relative">
                <p data-translate="waIntro">Haben Sie Fragen zur Haushaltshilfe, Alltagsbegleitung oder Abrechnung mit der Pflegekasse? Senden Sie uns einfach eine Nachricht!</p>
                <span class="block text-[8px] text-slate-400 font-bold text-right mt-1.5">EMMASCO Team</span>
                <div class="absolute top-0 -left-2.5 w-3 h-3 bg-white dark:bg-slate-800" style="clipPath: 'polygon(100% 0, 0 0, 100% 100%)'"></div>
            </div>

            <!-- Form -->
            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
                <div>
                    <label class="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1" data-translate="labelName">
                        Ihr Name
                    </label>
                    <div class="relative">
                        <input type="text" id="wa-input-name" placeholder="z.B. Maria Schmidt" class="w-full bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs rounded-xl py-2 px-3 pl-8 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-emerald-500">
                        <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1" data-translate="labelService">
                        Dienstleistung
                    </label>
                    <div class="relative">
                        <select id="wa-select-service" class="w-full bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 font-semibold appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer">
                            <option value="haushaltshilfe">Haushaltshilfe</option>
                            <option value="reinigung">Unterhaltsreinigung</option>
                            <option value="einkaufshilfe">Einkaufshilfe</option>
                            <option value="alltagsbegleitung">Alltagsbegleitung</option>
                            <option value="angehoerige">Entlastung für Angehörige</option>
                            <option value="fenster">Fensterreinigung</option>
                            <option value="buero">Büroreinigung</option>
                            <option value="deepclean">Grundreinigung (Deep Clean)</option>
                        </select>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1" data-translate="labelMsg">
                        Zusatznachricht (Auskunft)
                    </label>
                    <textarea id="wa-input-text" rows="2" placeholder="z.B. Wann hätten Sie nächste Woche Zeit?" class="w-full bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"></textarea>
                </div>

                <!-- Live Bubble Message Preview -->
                <div class="bg-emerald-50/50 dark:bg-slate-900 p-3 rounded-xl border border-emerald-100/60 dark:border-slate-700/80">
                    <span class="block text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1" data-translate="previewTitle">Nachrichten-Vorschau</span>
                    <p id="wa-msg-preview-paragraph" class="text-[10px] leading-relaxed text-slate-600 dark:text-slate-350 italic text-left select-none"></p>
                </div>

                <button id="wa-submit-trigger" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                    <i data-lucide="send" class="w-3.5 h-3.5"></i>
                    <span data-translate="waBtnSend">In WhatsApp fortfahren</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Main Launcher Bubble -->
    <button id="wa-launcher-btn" class="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_6px_25px_rgba(16,185,129,0.36)] hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none border border-emerald-400 relative">
        <i data-lucide="message-circle" id="wa-ic-open" class="w-6 h-6 text-white fill-current"></i>
        <i data-lucide="x" id="wa-ic-close" class="w-6 h-6 text-white hidden"></i>
        <span class="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25"></span>
    </button>
</div>

<?php wp_footer(); ?>
</body>
</html>
