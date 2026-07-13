/**
 * Emmasco Theme Companion - Animations Module
 * Handles FAQ accordions, IntersectionObservers, scroll declarations, and visual feedback hooks.
 */

window.initAnimations = function () {
    // 1. FAQ Accordions Selector State Toggle
    const faqBtns = document.querySelectorAll('.faq-accordion-header');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const body = this.nextElementSibling;
            if (!body) return;
            
            const icon = this.querySelector('[data-lucide="chevron-down"]');
            const wasHidden = body.classList.contains('hidden');
            
            // Close all other accordions
            document.querySelectorAll('.faq-accordion-body').forEach(b => b.classList.add('hidden'));
            document.querySelectorAll('.faq-accordion-header [data-lucide="chevron-down"]').forEach(i => {
                i.style.transform = 'rotate(0deg)';
                i.style.transition = 'transform 0.3s ease';
            });
            
            if (wasHidden) {
                body.classList.remove('hidden');
                body.classList.add('animate-fade-in');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            }
        });
    });

    // 2. Scroll Triggered Element Reveal Animations (Testimonials & Panels)
    const scrollRevealElements = document.querySelectorAll('.fade-in-up-scroll');
    if (scrollRevealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const scrollObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        scrollObserver.unobserve(entry.target); // Trigger once for performance
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
            // Fallback for legacy browsers
            scrollRevealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
        }
    }
};
