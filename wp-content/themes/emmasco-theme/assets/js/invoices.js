/**
 * Emmasco Theme Companion - Invoices & PDF Module
 * Handles dynamic rendering of invoices tray, AJAX requests for server invoices, and client-side high-fidelity PDF compile.
 */

window.renderLocalInvoices = function () {
    const tray = document.getElementById('wp-local-invoices-tray');
    if (!tray) return;

    const email = localStorage.getItem('emmasco_customer_email') || '';
    const lang = window.activeLang || 'de';

    // Show loading spinner
    tray.innerHTML = `
        <div class="text-center py-6 text-slate-400 text-xs font-semibold">
            <span class="inline-block animate-spin mr-2">⏳</span> ${lang === 'de' ? 'Rechnungen werden geladen...' : 'Loading secure invoices...'}
        </div>
    `;

    // Query permanent server-side DB via WordPress AJAX
    jQuery.ajax({
        url: emmasco_ajax.ajax_url,
        type: 'POST',
        data: {
            action: 'emmasco_get_invoices',
            security: emmasco_ajax.nonce,
            email: email
        },
        success: function (response) {
            if (response.success && response.data && response.data.length > 0) {
                tray.innerHTML = '';
                response.data.forEach(inv => {
                    const item = document.createElement('div');
                    item.className = 'border border-blue-200/50 dark:border-slate-800 bg-blue-50/15 dark:bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center transition shadow-xs animate-fade-in mb-3';
                    
                    const totalPriceNum = parseFloat(inv.totalPrice);
                    const formattedPrice = isNaN(totalPriceNum) ? '0.00' : totalPriceNum.toFixed(2);
                    
                    item.innerHTML = `
                        <div class="text-left space-y-0.5">
                            <span class="block font-extrabold text-blue-950 dark:text-slate-200 text-xs">${inv.serviceName}</span>
                            <span class="block text-[10px] text-slate-500 dark:text-slate-400">${inv.invoiceNo} | ${inv.date} | ${formattedPrice} €</span>
                        </div>
                        <button class="invoice-dl-btn p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer" data-id="${inv.id}" title="${lang === 'de' ? 'PDF herunterladen' : 'Download PDF Invoice'}">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </button>
                    `;
                    tray.appendChild(item);
                });

                // Bind click events for PDF generation
                tray.querySelectorAll('.invoice-dl-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const matched = response.data.find(x => x.id == id);
                        if (matched) {
                            window.generateWpInvoicePdf(matched);
                        }
                    });
                });

                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                tray.innerHTML = `
                    <div class="text-center py-6 text-slate-400 text-xs font-semibold" id="empty-invoice-placeholder" data-translate="noInvoices">
                        ${lang === 'de' ? 'Noch keine Buchung getätigt. Rechnungen erscheinen nach Ihrer ersten Buchungsanfrage.' : 'No booking made yet. Receipts populate here as soon as you submit.'}
                    </div>
                `;
            }
        },
        error: function() {
            tray.innerHTML = `
                <div class="text-center py-6 text-red-400 text-xs font-semibold">
                    ${lang === 'de' ? 'Fehler beim Laden der Rechnungen.' : 'Failed to synchronize invoices with cloud storage.'}
                </div>
            `;
        }
    });
};

window.generateWpInvoicePdf = function (invData) {
    if (typeof window.jspdf === 'undefined') {
        alert(window.activeLang === 'de' ? 'PDF-Bibliothek lädt noch. Bitte versuchen Sie es gleich erneut.' : 'Loading PDF compiling engine. Please try again in a few seconds.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Typography Settings
    const darkCharcoal = '#111827';

    // Top block accent header
    doc.setFillColor(0, 86, 214); // Emmasco blue
    doc.rect(0, 0, 210, 40, 'F');

    // Title / Slogan
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('EMMASCO REINIGUNGSTEAM', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Staatlich anerkannter Dienstleister SGB XI - Entlastungsleistungen (§45a)', 15, 26);
    doc.text('Schönhauser Allee 163, 10435 Berlin', 15, 31);

    // Document header
    doc.setTextColor(darkCharcoal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RECHNUNG / KOSTENVORANSCHLAG', 15, 60);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Rechnungsnr.: ${invData.invoiceNo}`, 15, 70);
    doc.text(`Datum: ${invData.date}`, 15, 76);
    doc.text('Abrechnungswert: Erstattungsfähige Pflegekassenleistung SGB XI', 15, 82);

    // Customer recipient details
    doc.setFont('helvetica', 'bold');
    doc.text('EMPFÄNGER (KUNDE):', 120, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${invData.customerName}`, 120, 76);
    doc.text(`E-Mail: ${invData.email}`, 120, 82);
    doc.text(`Mobilnr.: ${invData.phone}`, 120, 88);
    doc.text(`Adresse: ${invData.address}`, 120, 94);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 105, 195, 105);

    // Header metrics table row
    doc.setFont('helvetica', 'bold');
    doc.text('Dienstleistung / Beschreibung', 15, 115);
    doc.text('Einheiten (Basis)', 110, 115);
    doc.text('Einzelsatz', 145, 115);
    doc.text('Gesamt', 175, 115);

    // Services description details
    doc.setFont('helvetica', 'normal');
    doc.text(invData.serviceName, 15, 125);
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 120);
    doc.text('Abrechenbar über den Entlastungsbetrag nach § 45a SGB XI', 15, 131);
    doc.setFontSize(10);
    doc.setTextColor(darkCharcoal);

    const priceValObj = parseFloat(invData.totalPrice);
    const priceVal = isNaN(priceValObj) ? 58.00 : priceValObj;

    doc.text('2.00 Std.', 110, 125);
    doc.text(`${(priceVal / 2).toFixed(2)} €`, 145, 125);
    doc.text(`${priceVal.toFixed(2)} €`, 175, 125);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 140, 195, 140);

    // Accounting sums
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Gesamtsumme (Netto):', 115, 153);
    doc.text(`${priceVal.toFixed(2)} €`, 170, 153);

    doc.setFontSize(9);
    doc.text('Umsatzsteuer (0% befreit):', 115, 161);
    doc.text('0,00 €', 170, 161);

    doc.setFontSize(11);
    doc.setTextColor(0, 86, 214);
    doc.text('Zu erstatten durch Pflegekasse:', 115, 172);
    doc.text(`${priceVal.toFixed(2)} €`, 170, 172);
    doc.setTextColor(darkCharcoal);

    // Direct instructions block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('KOSTENERSTATTUNGS-RICHTLINIEN:', 15, 190);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const infoLines = [
        '1. Diese Rechnung ist voll erstattungsfähig im Rahmen des Entlastungsbetrages.',
        '2. Bitte reichen Sie diese Belege bei Ihrer gesetzlichen oder privaten Pflegekasse ein.',
        '3. Bei einer bestehenden Abtretungserklärung rechnen wir die Beträge direkt mit Ihrer Kasse ab.',
        'Vielen Dank für Ihre Buchungsanfrage!'
    ];
    let offsetAxisY = 198;
    infoLines.forEach(line => {
        doc.text(line, 15, offsetAxisY);
        offsetAxisY += 6;
    });

    // Signatures
    doc.setFont('helvetica', 'italic');
    doc.text('Emmanuel Isodje, Geschäftsführung', 15, 245);
    doc.line(15, 241, 75, 241);

    doc.save(`invoice_${invData.invoiceNo}.pdf`);
};

window.initInvoices = function () {
    window.renderLocalInvoices();
};
