/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Heart, Clock, ShieldCheck, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
}

export default function Footer({ setCurrentPage, onOpenBooking }: FooterProps) {
  const { language } = useLanguage();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleLinkClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-slate-350 pt-16 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Bio */}
        <div className="flex flex-col gap-4 text-left">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              EMMASCO<span className="text-[#2FB5FF] font-extrabold">.</span>
            </span>
            <span className="text-xs font-black tracking-widest text-[#2FB5FF] uppercase">
              REINIGUNGSTEAM
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-normal">
            {language === 'de' 
              ? 'Wir stehen für erstklassige Entlastungsleistungen, zuverlässige Haushaltshilfe und einfühlsame Alltagsbegleitung mit staatlicher Zulassung nach §45a SGB XI direkt in Berlin.'
              : 'We provide premium relief aid, reliable housekeeping services, and compassionate companion care with official certification according to §45a SGB XI in Berlin.'}
          </p>
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
              <Heart className="w-4 h-4 text-red-400 fill-current shrink-0" />
              <span>{language === 'de' ? 'Anerkannt nach § 45a SGB XI' : 'Registered under § 45a SGB XI'}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-white font-bold text-base relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-blue-500">
            {language === 'de' ? 'Nützliche Links' : 'Useful Links'}
          </h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <button 
                id="footer-link-home"
                onClick={() => handleLinkClick('home')} 
                className="hover:text-white hover:translate-x-1 transition-all duration-200 text-slate-400 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Startseite' : '■ Home Page'}
              </button>
            </li>
            <li>
              <button 
                id="footer-link-about"
                onClick={() => handleLinkClick('about')} 
                className="hover:text-white hover:translate-x-1 transition-all duration-200 text-slate-400 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Über uns' : '■ About Us'}
              </button>
            </li>
            <li>
              <button 
                id="footer-link-services"
                onClick={() => handleLinkClick('services')} 
                className="hover:text-white hover:translate-x-1 transition-all duration-200 text-slate-400 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Leistungen & Preise' : '■ Services & Prices'}
              </button>
            </li>
            <li>
              <button 
                id="footer-link-blog"
                onClick={() => handleLinkClick('blog')} 
                className="hover:text-white hover:translate-x-1 transition-all duration-200 text-slate-400 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Ratgeber & Blog' : '■ Guide & Blog'}
              </button>
            </li>
            <li>
              <button 
                id="footer-link-contact"
                onClick={() => handleLinkClick('contact')} 
                className="hover:text-white hover:translate-x-1 transition-all duration-200 text-slate-400 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Kontakt & Anfahrt' : '■ Contact & Directions'}
              </button>
            </li>
            <li>
              <button 
                id="footer-link-booking"
                onClick={onOpenBooking} 
                className="text-blue-400 font-bold hover:text-blue-300 hover:translate-x-1 transition-all duration-200 block cursor-pointer text-left"
              >
                {language === 'de' ? '■ Direktbuchung online' : '■ Book Directly Online'}
              </button>
            </li>
          </ul>
        </div>

        {/* Working Hours & Badges */}
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-white font-bold text-base relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-blue-500">
            {language === 'de' ? 'Arbeitszeiten & Service' : 'Hours & Service'}
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-200">{language === 'de' ? 'Bürozeiten:' : 'Office Hours:'}</span>
                <span className="text-xs text-slate-400">
                  {language === 'de' ? 'Montag - Freitag: 08:30 - 18:00 Uhr' : 'Monday - Friday: 08:30 AM - 06:00 PM'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-200">{language === 'de' ? 'Einsatzzeiten:' : 'Working Hours:'}</span>
                <span className="text-xs text-slate-400">
                  {language === 'de' ? 'Flexibel nach individueller Absprache' : 'Flexible based on individual alignment'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/35">
              {language === 'de' 
                ? 'Unser telefonischer Support ist für dringliche Anliegen in Berlin rund um die Uhr erreichbar.'
                : 'Our phone support is available around the clock for urgent matters in Berlin.'}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-white font-bold text-base relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-blue-500">
            {language === 'de' ? 'Hauptstandort Berlin' : 'Berlin Headquarters'}
          </h3>
          <div className="flex flex-col gap-3.5 text-sm font-medium">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>EMMASCO Reinigungsteam</strong>
                <br />
                Schönhauser Allee 163
                <br />
                10435 Berlin
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400 shrink-0" />
              <a href="tel:017621856044" className="hover:text-white hover:underline">0176 21856044</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <a href="mailto:info@emmascoreinigungsteam.de" className="hover:text-white hover:underline">info@emmascoreinigungsteam.de</a>
            </div>
          </div>
        </div>

      </div>

      {/* SGB Notice & Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="text-center lg:text-left leading-relaxed">
            <p className="text-slate-400">
              © {currentYear} EMMASCO REINIGUNGSTEAM Berlin. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {language === 'de'
                ? '* Abrechenbare Leistungen nach Anerkennungsverordnung (PflegeGrad 1 bis 5) direkt über die zuständigen Pflegekassen.'
                : '* Reimbursable services according to German Care Law (Care levels 1 to 5) directly invoiced to the competent care funds.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <button 
              onClick={() => handleLinkClick('imprint')} 
              className="hover:text-slate-300 hover:underline cursor-pointer transition-colors"
            >
              {language === 'de' ? 'Impressum' : 'Imprint (Impressum)'}
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsPrivacyOpen(true)} 
              className="hover:text-slate-300 hover:underline cursor-pointer transition-colors"
            >
              {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button 
              onClick={() => handleLinkClick('contact')} 
              className="hover:text-slate-300 hover:underline cursor-pointer transition-colors"
            >
              {language === 'de' ? 'Kontakt' : 'Contact'}
            </button>
            <span>•</span>
            <span className="text-blue-500 border border-slate-800 px-2 py-0.5 rounded uppercase font-bold text-[10px] select-none">
              Hostinger Business Verified
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div id="privacy-policy-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-blue-50 dark:border-slate-800 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
                </h3>
              </div>
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-6 text-left">
              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mb-1.5">1. Datenschutz auf einen Blick</h4>
                <p>Der Schutz Ihrer persönlichen Daten ist uns ein großes Anliegen. Nachfolgend informieren wir Sie über die Verarbeitung personenbezogener Daten auf unserer Website.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mb-1.5">2. Verantwortliche Stelle</h4>
                <p className="font-semibold text-slate-850 dark:text-slate-300">
                  EMMASCO Reinigungsteam<br />
                  Inhaber: Emmanuel Isodje<br />
                  Schönhauser Allee 163, 10435 Berlin<br />
                  E-Mail: info@emmascoreinigungsteam.de
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mb-1.5">3. Datenerfassung auf unserer Website</h4>
                <p>Wir erfassen Daten, die Sie uns aktiv übermitteln (z.B. im Rahmen einer Buchungsanfrage oder Kontaktaufnahme). Dazu gehören Name, Telefonnummer, E-Mail-Adresse sowie Angaben zum gewünschten Service.</p>
                <p className="mt-2">Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer schnellen und effizienten Bearbeitung von Anfragen).</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mb-1.5">4. Abrechnung mit Pflegekassen</h4>
                <p>Als nach § 45a SGB XI anerkannter Betrieb übermitteln wir für Kunden mit Pflegegrad abrechnungsrelevante Leistungsnachweise direkt an die zuständigen Pflegekassen. Dies erfolgt ausschließlich mit Ihrer expliziten Zustimmung.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mb-1.5">5. Ihre Rechte</h4>
                <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Bitte wenden Sie sich hierzu an info@emmascoreinigungsteam.de.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-right">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {language === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
