/**
 * Emmasco Theme Companion - Bookings and Contacts Module
 * Manages clean validated AJAX postings using security nonces and WordPress admin-ajax pathways.
 */

window.initBookingsAndContacts = function () {
    const bookingForm = document.getElementById('emmasco-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            // Secure validation inputs
            const customerName = document.getElementById('bm-name').value.trim();
            const email = document.getElementById('bm-email').value.trim();
            const phone = document.getElementById('bm-phone').value.trim();
            const address = document.getElementById('bm-address').value.trim();
            const serviceId = document.getElementById('bm-service').value;
            const serviceDropdown = document.getElementById('bm-service');
            const selectValText = serviceDropdown ? serviceDropdown.options[serviceDropdown.selectedIndex].text : '';
            const dateVal = document.getElementById('bm-date').value;
            const timeVal = document.getElementById('bm-time').value;
            const notes = document.getElementById('bm-notes').value.trim();

            if (!customerName || !email || !phone || !address || !dateVal || !timeVal) {
                alert(window.activeLang === 'de' ? 'Bitte füllen Sie alle erforderlichen Felder aus.' : 'Please fill in all mandatory fields.');
                return;
            }

            // Lock and trigger processing states
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            if (submitBtnText) {
                submitBtnText.innerText = window.activeLang === 'de' ? 'Übertrage...' : 'Sending...';
            }

            // Post AJAX to standard WP admin-ajax.php receiver hook
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
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalBtnHtml;
                    }

                    const msgBox = document.getElementById('booking-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'bg-emerald-50', 'text-emerald-800');
                        if (response.success && response.data) {
                            msgBox.classList.add('bg-emerald-50', 'text-emerald-800');
                            msgBox.innerHTML = window.activeLang === 'de' ? 
                                `✓ <strong>Herrliche Buchung registriert!</strong><br>Anfrage #${response.data.booking_id} erfolgreich empfangen. Beleg wurde im Panel generiert.` :
                                `✓ <strong>Booking Successful!</strong><br>Inquiry #${response.data.booking_id} registered. Invoice generated below.`;
                            
                            // Secure customer identification locally to restore invoices from cloud
                            localStorage.setItem('emmasco_customer_email', email);
                            
                            // Build invoice structure for instant PDF preview
                            const invoiceObj = {
                                id: response.data.booking_id,
                                invoiceNo: response.data.invoice_no,
                                serviceName: selectValText,
                                date: response.data.date,
                                customerName: customerName,
                                email: email,
                                phone: phone,
                                address: address,
                                totalPrice: response.data.total_price
                            };

                            bookingForm.reset();

                            // Reload invoices tray from standard servers
                            if (typeof window.renderLocalInvoices === 'function') {
                                window.renderLocalInvoices();
                            }

                            // Auto-trigger client-side pdf download
                            if (typeof window.generateWpInvoicePdf === 'function') {
                                window.generateWpInvoicePdf(invoiceObj);
                            }
                        } else {
                            msgBox.classList.add('bg-red-50', 'text-red-800');
                            msgBox.innerText = response.data && response.data.message ? response.data.message : 'Error processing entry.';
                        }
                    }
                },
                error: function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalBtnHtml;
                    }

                    const msgBox = document.getElementById('booking-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden');
                        msgBox.classList.add('bg-red-50', 'text-red-800');
                        msgBox.innerText = window.activeLang === 'de' 
                            ? 'Serverfehler beim Übermitteln. Bitte überprüfen Sie Ihre Internetverbindung.'
                            : 'Server fault during transit. Please check your network connection and try again.';
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
            const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const phone = document.getElementById('cf-phone').value.trim();
            const subject = document.getElementById('cf-subject').value.trim();
            const message = document.getElementById('cf-message').value.trim();

            if (!name || !email || !subject || !message) {
                alert(window.activeLang === 'de' ? 'Bitte füllen Sie alle erforderlichen Felder aus.' : 'Please fill all mandatory fields.');
                return;
            }

            // Lock and trigger loading
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            if (submitBtnText) {
                submitBtnText.innerText = window.activeLang === 'de' ? 'Übertrage...' : 'Sending...';
            }

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
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalBtnHtml;
                    }

                    const msgBox = document.getElementById('contact-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'bg-emerald-50', 'text-emerald-800');
                        if (response.success) {
                            msgBox.classList.add('bg-emerald-50', 'text-emerald-800');
                            msgBox.innerHTML = window.activeLang === 'de' ? 
                                `✓ <strong>Vielen Dank!</strong> Ihre Nachricht wurde erfolgreich an unser Team gesendet.` :
                                `✓ <strong>Thank you!</strong> Your message has been successfully transmitted to our team.`;
                            contactForm.reset();
                        } else {
                            msgBox.classList.add('bg-red-50', 'text-red-800');
                            msgBox.innerText = response.data && response.data.message ? response.data.message : 'Error occured.';
                        }
                    }
                },
                error: function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalBtnHtml;
                    }

                    const msgBox = document.getElementById('contact-message-box');
                    if (msgBox) {
                        msgBox.classList.remove('hidden');
                        msgBox.classList.add('bg-red-50', 'text-red-800');
                        msgBox.innerText = window.activeLang === 'de'
                            ? 'Serverfehler beim Posten. Bitte kontaktieren Sie uns per Mail.'
                            : 'An unexpected error occurred. Please contact us directly via email.';
                    }
                }
            });
        });
    }
};
