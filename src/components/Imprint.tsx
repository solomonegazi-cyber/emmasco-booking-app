/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Shield, Check, Copy, FileText, Info, Award, Landmark } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Imprint() {
  const { language } = useLanguage();
  const [copiedId, setCopiedId] = useState<string>('');

  // Update SEO Page Title and Metadata
  useEffect(() => {
    document.title = "Emmasco Reinigungsteam | Imprint (Impressum)";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId('');
    }, 2000);
  };

  const isDe = language === 'de';

  return (
    <div id="imprint-page" className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-left">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400 px-3 py-1.5 rounded-full inline-block mb-3 border border-blue-100 dark:border-slate-700">
          {isDe ? 'Rechtliche Angaben' : 'Legal Information'}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isDe ? 'Impressum / Imprint' : 'Imprint / Impressum'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl font-medium">
          {isDe 
            ? 'Gesetzliche Anbieterkennzeichnung nach § 5 TMG sowie Pflichtangaben für den Betrieb von Emmasco.'
            : 'Legal provider identification according to § 5 TMG and mandatory details for operating Emmasco.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Imprint details - 2 Cols */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Responsible and Provider */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-blue-50/70 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,86,214,0.02)] transition-all">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isDe ? 'Diensteanbieter & Verantwortlicher' : 'Service Provider & Responsible'}
              </h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {isDe ? 'Unternehmen' : 'Company'}
                </p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  EMMASCO Reinigungsteam
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {isDe ? 'Inhaber / Verantwortlich für den Inhalt' : 'Owner / Responsible for Content'}
                </p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-2">
                  Emmanuel Isodje
                  <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-extrabold uppercase">
                    {isDe ? 'Geschäftsführung' : 'Managing Director'}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isDe 
                    ? '(gemäß § 18 Abs. 2 MStV verantwortlich für journalistisch-redaktionelle Inhalte)' 
                    : '(responsible for journalistic and editorial content under § 18 section 2 MStV)'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {isDe ? 'Geschäftsanschrift' : 'Business Address'}
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-semibold flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Schönhauser Allee 163<br />
                    10435 Berlin
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Registration & Identifications */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-blue-50/70 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,86,214,0.02)] transition-all">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isDe ? 'Handelsregister & Identifikation' : 'Commercial Register & ID'}
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              
              {/* Register Entry */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {isDe ? 'Registereintrag (Amtsgericht)' : 'Register Entry (Local Court)'}
                  </p>
                  <p className="font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                    HRB 276204
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('HRB 276204', 'reg')}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-900 dark:hover:text-blue-400 transition shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
                  title={isDe ? "Kopieren" : "Copy"}
                >
                  {copiedId === 'reg' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* VAT ID */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {isDe ? 'Umsatzsteuer-Identifikationsnummer (§ 27a UStG)' : 'VAT Identification Number'}
                  </p>
                  <p className="font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                    DE457020937
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('DE457020937', 'vat')}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-900 dark:hover:text-blue-400 transition shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
                  title={isDe ? "Kopieren" : "Copy"}
                >
                  {copiedId === 'vat' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Business ID */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {isDe ? 'Wirtschafts-Identifikationsnummer' : 'Business Identification Number'}
                </p>
                <div className="flex justify-between items-center gap-3 mt-0.5">
                  <p className="font-bold text-slate-400 dark:text-slate-500 text-xs italic">
                    {isDe 
                      ? 'Bitte tragen Sie hier Ihre Wirtschafts-Identifikationsnummer ein.' 
                      : 'Please enter your business identification number here.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(isDe ? 'Bitte tragen Sie hier Ihre Wirtschafts-Identifikationsnummer ein.' : 'Please enter your business identification number here.', 'bizid')}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-900 dark:hover:text-blue-400 transition shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
                  >
                    {copiedId === 'bizid' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Supervisory Authority */}
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {isDe ? 'Zuständige Aufsichtsbehörde' : 'Supervisory Authority'}
                </p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Berlin (Charlottenburg)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isDe 
                    ? 'Anerkannt für Unterstützungsleistungen im Alltag gem. § 45a SGB XI durch die Senatsverwaltung Berlin.'
                    : 'Certified for everyday support services according to § 45a SGB XI by the Berlin Senate Department.'}
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Legal Disclaimers */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-150 dark:border-slate-800 text-xs space-y-4 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {isDe ? 'Rechtliche Hinweise & Streitbeilegung' : 'Legal Notices & Dispute Resolution'}
            </h3>
            
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isDe ? 'Haftungsausschluss für Inhalte (Disclaimer)' : 'Limitation of Liability for Content'}
              </p>
              <p>
                {isDe 
                  ? 'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
                  : 'As service providers, we are liable for our own content on these pages according to § 7 section 1 TMG under general German laws. However, according to §§ 8 to 10 TMG, we are not obligated to monitor external information provided or stored, or investigate circumstances pointing to illegal activities.'}
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isDe ? 'Urheberrecht' : 'Copyright'}
              </p>
              <p>
                {isDe 
                  ? 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.'
                  : 'The content and works created by the page operators on these pages are subject to German copyright law. Reproduction, editing, distribution, and any kind of use outside the limits of copyright law require the written consent of the respective author or creator.'}
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isDe ? 'Verbraucherstreitbeilegung / Universalschlichtungsstelle' : 'Consumer Dispute Resolution'}
              </p>
              <p>
                {isDe 
                  ? 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
                  : 'We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.'}
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar Info - 1 Col */}
        <div className="space-y-6">
          
          {/* Quick Contact Card */}
          <div className="bg-[#0056D6] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full" />
            
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 inline-block mb-3">
                {isDe ? 'Direkter Kontakt' : 'Direct Contact'}
              </span>
              <h3 className="text-xl font-black tracking-tight leading-tight">
                {isDe ? 'Fragen zum Impressum?' : 'Questions?'}
              </h3>
              <p className="text-xs text-blue-100 font-medium mt-1">
                {isDe 
                  ? 'Unser Support steht Ihnen während der Bürozeiten telefonisch und per E-Mail zur Verfügung.'
                  : 'Our support team is available during office hours via phone or email.'}
              </p>
            </div>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              {/* Mobile */}
              <div className="bg-white/10 border border-white/10 p-3 rounded-2xl hover:bg-white/15 transition">
                <p className="text-[10px] text-blue-200 uppercase font-bold">
                  {isDe ? 'Mobilnummer' : 'Mobile Phone'}
                </p>
                <a href="tel:017621856044" className="text-sm font-black flex items-center gap-1.5 mt-0.5 hover:underline text-white">
                  <Phone className="w-4 h-4 shrink-0 text-blue-200" />
                  0176 21856044
                </a>
              </div>

              {/* Tel */}
              <div className="bg-white/10 border border-white/10 p-3 rounded-2xl hover:bg-white/15 transition">
                <p className="text-[10px] text-blue-200 uppercase font-bold">
                  {isDe ? 'Festnetz Berlin' : 'Office Landline'}
                </p>
                <a href="tel:03022432816" className="text-sm font-black flex items-center gap-1.5 mt-0.5 hover:underline text-white">
                  <Phone className="w-4 h-4 shrink-0 text-blue-200" />
                  030 22432816
                </a>
              </div>

              {/* Email */}
              <div className="bg-white/10 border border-white/10 p-3 rounded-2xl hover:bg-white/15 transition">
                <p className="text-[10px] text-blue-200 uppercase font-bold">
                  E-Mail-Adresse
                </p>
                <a href="mailto:info@emmascoreinigungsteam.de" className="text-sm font-black flex items-center gap-1.5 mt-0.5 hover:underline text-white break-all">
                  <Mail className="w-4 h-4 shrink-0 text-blue-200" />
                  info@emmascoreinigungsteam.de
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 text-center">
              <span className="text-[10px] font-bold text-blue-200 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {isDe ? 'Staatliche Anerkennung nach §45a' : 'State Certified §45a SGB XI'}
              </span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-1">
                {isDe ? 'Hinweis für Krankenkassen' : 'Insurance Note'}
              </p>
              <p>
                {isDe 
                  ? 'Alle Rechnungen und Einsätze können von Versicherten mit Pflegegrad (1-5) direkt über den monatlichen Entlastungsbetrag der Pflegekassen abgerechnet werden.'
                  : 'All invoices can be directly reimbursed via the monthly care budget from your nursing care fund.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
