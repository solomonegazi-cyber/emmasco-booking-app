/**
 * Emmasco Theme Companion - Main Application Entry Orchestrator
 * Bootstraps translations, catalogs, sliders, accordions, and AJAX booking modules.
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Refresh Lucide Icons on initiation
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Dark/Light Layout Theme State Manager
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

    // 3. Mobile Navigation Drawer State Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileDrawer.classList.toggle('hidden');
        });

        // Close drawer when link clicked
        document.querySelectorAll('.mobile-drawer-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.add('hidden');
            });
        });
    }

    // 4. Initialize Sub-Modules Sequentially
    if (typeof window.initTranslations === 'function') {
        window.initTranslations();
    }
    if (typeof window.initServices === 'function') {
        window.initServices();
    }
    if (typeof window.initCalculator === 'function') {
        window.initCalculator();
    }
    if (typeof window.initInvoices === 'function') {
        window.initInvoices();
    }
    if (typeof window.initBookingsAndContacts === 'function') {
        window.initBookingsAndContacts();
    }
    if (typeof window.initWhatsApp === 'function') {
        window.initWhatsApp();
    }
    if (typeof window.initAnimations === 'function') {
        window.initAnimations();
    }
    
    console.log('EMMASCO Companion successfully initialized.');
});
