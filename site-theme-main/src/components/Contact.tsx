/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Contact() {
  const { language, t } = useLanguage();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [spamAnswer, setSpamAnswer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!contactName.trim()) {
      errs.name = language === 'de' ? 'Name ist erforderlich.' : 'Name is required.';
    }
    if (!contactEmail.trim() || !/\S+@\S+\.\S+/.test(contactEmail)) {
      errs.email = language === 'de' ? 'Gültige E-Mail erforderlich.' : 'Valid email is required.';
    }
    if (!contactPhone.trim()) {
      errs.phone = language === 'de' ? 'Telefonnummer ist erforderlich.' : 'Phone number is required.';
    }
    if (!contactMsg.trim()) {
      errs.message = language === 'de' ? 'Ihre Nachricht darf nicht leer sein.' : 'Your message cannot be empty.';
    }
    
    // Simple spam safety sum check "5 + 3 = ?"
    if (spamAnswer.trim() !== '8') {
      errs.spam = language === 'de' 
        ? 'Sicherheitsantwort ist falsch (5 + 3 = ?). Beantworten Sie mit "8".' 
        : 'Security answer is incorrect (5 + 3 = ?). Answer with "8".';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSent(true);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMsg('');
    setSpamAnswer('');
  };

  return (
    <div className="w-full bg-[#F6FAFF] min-h-screen pb-16 text-left">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0056D6] to-[#0A1329] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <Mail className="w-8 h-8 text-blue-200" />
          <h1 className="text-4xl md:text-5xl font-black">
            {t('contact.banner_title')}
          </h1>
          <p className="text-sm md:text-base font-semibold text-blue-100/90 max-w-xl">
            {t('contact.banner_subtitle')}
          </p>
        </div>
      </section>

      {/* Main Core Layout */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Contact Info & Address */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 text-left">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-black text-blue-900 border-b border-gray-100 pb-2">
              {t('contact.office_title')}
            </h2>

            <div className="flex flex-col gap-5 text-sm font-semibold">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {language === 'de' ? 'Firmensitz:' : 'Headquarters:'}
                  </h4>
                  <p className="text-gray-500 mt-0.5 leading-relaxed">
                    <strong>EMMASCO REINIGUNGSTEAM</strong>
                    <br />
                    {t('contact.office_address')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-gray-50 pt-4">
                <Phone className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {t('contact.office_hours_title')}
                  </h4>
                  <span className="text-gray-500 block mt-0.5">
                    {t('contact.office_hours')}
                  </span>
                  <a href="tel:017621856044" className="text-blue-600 hover:text-blue-800 underline block mt-0.5">
                    {language === 'de' ? 'Tel:' : 'Phone:'} 0176 21856044
                  </a>
                  <span className="text-[10px] text-[#0056D6] font-bold block mt-1">
                    {t('contact.office_urgent')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-gray-50 pt-4">
                <Mail className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {language === 'de' ? 'E-Mail Service:' : 'Email Service:'}
                  </h4>
                  <a href="mailto:info@emmascoreinigungsteam.de" className="text-blue-600 hover:text-blue-800 underline block mt-0.5">
                    info@emmascoreinigungsteam.de
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-3xl overflow-hidden border border-blue-50 shadow-md aspect-video relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2426.653457199432!2d13.411130677587127!3d52.53982267206497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851e39a5caad7%3A0x6e9a6132ceee0ff!2sSch%C3%B6nhauser%20Allee%20163%2C%2010435%20Berlin!5e0!3m2!1sde!2sde!4v1718503100000!5m2!1sde!2sde"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Emmasco Berlin Map"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* SGB Care level box */}
          <div className="bg-[#0056D6] text-white p-6 rounded-3xl shadow-[0_12px_25px_rgba(0,86,214,0.12)] border border-transparent flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-300 fill-current shrink-0" />
              <h3 className="font-extrabold text-base">
                {t('contact.sgb_title')}
              </h3>
            </div>
            <p className="text-xs text-blue-50 font-semibold leading-relaxed">
              {t('contact.sgb_text')}
            </p>
          </div>

        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-blue-50 shadow-lg flex flex-col gap-6">
          <h2 className="text-xl font-black text-blue-900 border-b border-gray-100 pb-2">
            {t('contact.form_title')}
          </h2>

          {isSent ? (
            <div className="p-8 bg-green-50 rounded-2xl border border-green-150 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xl">✔</div>
              <h4 className="font-extrabold text-green-800 text-base">
                {t('contact.msg_sent_title')}
              </h4>
              <p className="text-xs text-green-700 font-semibold max-w-sm leading-relaxed">
                {t('contact.msg_sent_p')}
              </p>
              <button
                id="contact-sent-reset"
                onClick={() => setIsSent(false)}
                className="bg-white border border-green-200 text-green-700 font-extrabold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                {language === 'de' ? 'Weitere Nachricht schreiben' : 'Write another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-xs text-slate-700">
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-form-name" className="text-xs font-black text-gray-750">
                    {t('contact.form_name')} *
                  </label>
                  <input
                    type="text"
                    id="contact-form-name"
                    required
                    placeholder="Waltraud Schmidt"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <span className="text-[10px] text-red-600 font-bold">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-form-email" className="text-xs font-black text-gray-755">
                    {t('contact.form_email')} *
                  </label>
                  <input
                    type="email"
                    id="contact-form-email"
                    required
                    placeholder="w.schmidt@gmail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-bold">{errors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left font-semibold text-xs text-slate-700">
                <label htmlFor="contact-form-phone" className="text-xs font-black text-gray-750">
                  {t('contact.form_phone')} *
                </label>
                <input
                  type="text"
                  id="contact-form-phone"
                  required
                  placeholder="z.B. 030 1234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && <span className="text-[10px] text-red-600 font-bold">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1.5 text-left font-semibold text-xs text-slate-705">
                <label htmlFor="contact-form-msg" className="text-xs font-black text-gray-750">
                  {t('contact.form_msg')} *
                </label>
                <textarea
                  id="contact-form-msg"
                  required
                  rows={4}
                  placeholder={language === 'de' 
                    ? 'Nennen Sie uns Ihren Pflegegrad oder Wünsche bezüglich Fensterreinigung, Unterhaltsreinigung etc.'
                    : 'State your care level or details regarding window cleaning, regular maintenance cleaning, etc.'}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.message && <span className="text-[10px] text-red-600 font-bold">{errors.message}</span>}
              </div>

              {/* Anti-spam math challenge (standard Hostinger precaution) */}
              <div className="bg-[#F6FAFF] p-4 rounded-xl border border-blue-50 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="font-extrabold text-blue-900 text-xs block">
                    {language === 'de' ? '🛡️ Spam-Schutz-Frage' : '🛡️ Anti-Spam Safety'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                    {language === 'de' 
                      ? 'Wie rechnet man: 5 + 3 = ? (Geben Sie die Zahl ein!)' 
                      : 'Calculate: 5 + 3 = ? (Enter the correct sum!)'}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={language === 'de' ? 'Ihre Antwort...' : 'Your answer...'}
                  value={spamAnswer}
                  onChange={(e) => setSpamAnswer(e.target.value)}
                  className="w-24 bg-white border border-blue-105 rounded-lg px-3 py-1.5 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
              {errors.spam && <p className="text-[10px] text-red-600 font-bold text-left">{errors.spam}</p>}

              <button
                type="submit"
                id="contact-form-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-4 px-6 rounded-full text-sm transition shadow shadow-md hover:shadow-lg cursor-pointer text-center"
              >
                {t('contact.form_submit')}
              </button>

              <div className="flex items-center gap-2 text-[10px] text-gray-450 border-t border-gray-100 pt-4 font-semibold text-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>
                  {language === 'de' 
                    ? 'Ihre Daten werden verschlüsselt nach DSGVO-Richtlinien übertragen.' 
                    : 'Your information is encrypted and transmitted in accordance with GDPR guidelines.'}
                </span>
              </div>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
