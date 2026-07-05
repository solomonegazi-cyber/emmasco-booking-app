<!doctype html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>

    <!-- Load Tailwind CSS Play Engine for instant performance and styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#0056D6',
                        secondary: '#2FB5FF',
                        slate: {
                            850: '#1E293B',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                        display: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Hydrate Light/Dark Mode Instantly to prevent flickering -->
    <script>
        if (localStorage.getItem('emmasco_theme') === 'dark' || 
            (!('emmasco_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Define default selected language
        if (!localStorage.getItem('emmasco_lang')) {
            localStorage.setItem('emmasco_lang', 'de');
        }
    </script>

    <!-- Load Lucide Icons UMD Build -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body <?php body_class('bg-[#F6FAFF] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased'); ?>>
<?php wp_body_open(); ?>

<!-- Header Main Layout -->
<header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-blue-50/50 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            
            <!-- Logo Section -->
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-3 group">
                <span class="w-11 h-11 bg-gradient-to-tr from-[#0056D6] to-[#2FB5FF] text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
                    <i data-lucide="sparkles" class="w-6 h-6"></i>
                </span>
                <div>
                    <span class="text-lg font-black tracking-tight text-blue-950 dark:text-white block group-hover:text-[#0056D6] dark:group-hover:text-[#2FB5FF] transition-colors leading-none">
                        EMMASCO
                    </span>
                    <span class="text-[10px] font-black tracking-widest text-[#2FB5FF] uppercase block mt-1 leading-none">
                        REINIGUNGSTEAM
                    </span>
                </div>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-7">
                <a href="#services-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navServices">Unsere Leistungen</a>
                <a href="#about-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navAbout">Über Uns</a>
                <a href="#gallery-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navGallery">Galerie</a>
                <a href="#faq-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navFAQ">Häufige Fragen</a>
                <a href="#blog-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navBlog">Ratgeber</a>
                <a href="#contact-anchor" class="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-[#0056D6] dark:hover:text-[#2FB5FF] transition-colors" data-translate="navContact">Kontakt</a>
            </nav>

            <!-- Quick Action Tray -->
            <div class="flex items-center gap-3">
                
                <!-- Language Switcher button -->
                <button id="lang-switch-btn" class="p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-black tracking-wider text-slate-650 dark:text-slate-300 hover:bg-blue-50/60 dark:hover:bg-slate-800 cursor-pointer select-none transition-all">
                    DE
                </button>

                <!-- Dark Mode toggle button -->
                <button id="theme-toggle" class="p-2 rounded-xl text-slate-650 dark:text-amber-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 cursor-pointer transition-all" aria-label="Toggle layout theme styling">
                    <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                    <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
                </button>

                <!-- Primary Action Button -->
                <a href="#booking-anchor" class="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0056D6] hover:bg-[#0047b3] text-white text-xs font-black rounded-xl cursor-pointer shadow-md transform hover:-translate-y-0.5 transition-all">
                    <span data-translate="btnNavBook">Jetzt Buchen</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>

                <!-- Mobile Hamburger Menu Button -->
                <button id="mobile-menu-btn" class="md:hidden p-2 rounded-xl hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Drawer Selection -->
    <div id="mobile-drawer" class="hidden md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-[#0F172A] border-b border-blue-50 dark:border-slate-800 p-6 flex flex-col gap-4 animate-fade-in shadow-xl">
        <a href="#services-anchor" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mobile-drawer-link" data-translate="navServices">Unsere Leistungen</a>
        <a href="#about-anchor" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mobile-drawer-link" data-translate="navAbout">Über Uns</a>
        <a href="#gallery-anchor" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mobile-drawer-link" data-translate="navGallery">Galerie</a>
        <a href="#faq-anchor" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mobile-drawer-link" data-translate="navFAQ">Häufige Fragen</a>
        <a href="#blog-anchor" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mobile-drawer-link" data-translate="navBlog">Ratgeber</a>
        <a href="#contact-anchor" class="text-sm font-semibold text-slate-705 dark:text-slate-300 mobile-drawer-link" data-translate="navContact">Kontakt</a>
        
        <div class="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
        
        <a href="#booking-anchor" class="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-[#0056D6] text-white text-xs font-black rounded-xl mobile-drawer-link" data-translate="btnNavBook">
            Jetzt Buchen
        </a>
    </div>
</header>
<main class="pt-20">
