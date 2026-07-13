/**
 * Emmasco Theme Companion - Calculator Module
 * Real-time estimates calculation on service adjustments.
 */

window.updateBudgetCalculator = function () {
    const serviceSelectInput = document.getElementById('bm-service');
    if (!serviceSelectInput) return;
    
    const sId = serviceSelectInput.value;
    if (!window.SERVICES_DATA) return;
    
    const found = window.SERVICES_DATA.find(x => x.id === sId);
    if (!found) return;

    const liveServiceLabel = document.getElementById('live-service-label');
    const livePayoutAmount = document.getElementById('live-payout-amount');
    const lang = window.activeLang || 'de';

    if (liveServiceLabel) {
        liveServiceLabel.innerText = lang === 'de' ? found.title_de : found.title_en;
    }

    // Compute estimate assuming base 2 hours visitation
    const estTotalValue = found.priceValue * 2;
    if (livePayoutAmount) {
        livePayoutAmount.innerText = estTotalValue.toFixed(2).replace('.', ',') + ' €';
    }
};

window.initCalculator = function () {
    const serviceSelectInput = document.getElementById('bm-service');
    if (serviceSelectInput) {
        serviceSelectInput.addEventListener('change', window.updateBudgetCalculator);
        window.updateBudgetCalculator();
    }
};
