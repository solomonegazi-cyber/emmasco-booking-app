/**
 * Emmasco Theme Companion - WhatsApp Module
 * Manages floating assistance widgets, live dynamic chat draft preview, timers, and external routing.
 */

window.getWhatsAppMessageText = function () {
    const waInputName = document.getElementById('wa-input-name');
    const waSelectService = document.getElementById('wa-select-service');
    const waInputText = document.getElementById('wa-input-text');
    const lang = window.activeLang || 'de';

    const uName = (waInputName && waInputName.value.trim()) ? waInputName.value.trim() : (lang === 'de' ? 'Gast' : 'Guest');
    const sChoice = (waSelectService) ? waSelectService.options[waSelectService.selectedIndex].text : 'Haushaltshilfe';
    const uMessage = (waInputText && waInputText.value.trim()) ? waInputText.value.trim() : (lang === 'de' ? 'Ich würde mich über ein unverbindliches Beratungsgespräch freuen.' : 'I would love to receive a free assessment.');

    let baseMsg = '';
    if (lang === 'de') {
        baseMsg = `Hallo EMMASCO-Team! 🌸\n\nMein Name ist *${uName}*.\n\nIch interessiere mich für Ihre Dienstleistung: *${sChoice}*.\n\n${uMessage}\n\nViele Grüße!`;
    } else {
        baseMsg = `Hello EMMASCO Team! 🌸\n\nMy name is *${uName}*.\n\nI am interested in your service: *${sChoice}*.\n\n${uMessage}\n\nBest regards!`;
    }
    return baseMsg;
};

window.triggerWhatsAppPreview = function () {
    const previewParagraph = document.getElementById('wa-msg-preview-paragraph');
    if (previewParagraph) {
        const rawMsg = window.getWhatsAppMessageText();
        previewParagraph.innerText = rawMsg.replaceAll('*', '');
    }
};

window.initWhatsApp = function () {
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

    // Auto trigger tooltip visibility after 6s unless dialog is open
    setTimeout(() => {
        if (waTooltip && waDialog && waDialog.classList.contains('hidden')) {
            waTooltip.classList.remove('hidden');
            waTooltip.classList.add('animate-fade-in');
        }
    }, 6000);

    // Dynamic key listeners for typing streams
    if (waInputName) waInputName.addEventListener('input', window.triggerWhatsAppPreview);
    if (waSelectService) waSelectService.addEventListener('change', window.triggerWhatsAppPreview);
    if (waInputText) waInputText.addEventListener('input', window.triggerWhatsAppPreview);

    window.triggerWhatsAppPreview();

    // Trigger URL compilation and redirect opening WhatsApp
    if (waSubmitBtn) {
        waSubmitBtn.addEventListener('click', function() {
            const finalMsg = window.getWhatsAppMessageText();
            const encoded = encodeURIComponent(finalMsg);
            const waUrl = `https://wa.me/4917621856044?text=${encoded}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // Sync input user name from main booking form for supreme ergonomics
    const customerNameInput = document.getElementById('bm-name');
    if (customerNameInput && waInputName) {
        customerNameInput.addEventListener('input', function() {
            waInputName.value = this.value;
            window.triggerWhatsAppPreview();
        });
    }
};
