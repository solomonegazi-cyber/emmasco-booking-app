/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { SERVICES } from '../data';

interface WhatsAppFloatingProps {
  currentUser: { name: string; email: string; phone: string; address: string } | null;
  selectedServiceId: string | null;
}

export default function WhatsAppFloating({ currentUser, selectedServiceId }: WhatsAppFloatingProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Sync state with currentUser changes or pre-selected service from App
  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedServiceId) {
      const found = SERVICES.find(s => s.id === selectedServiceId);
      if (found) {
        setSelectedService(found.id);
      }
    } else if (!selectedService && SERVICES.length > 0) {
      setSelectedService(SERVICES[0].id);
    }
  }, [selectedServiceId]);

  // Handle tooltip showing after 4 seconds briefly for attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    const dismissTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  // Generate pre-filled message text automatically or manually edited
  const getComputedMessage = () => {
    const serviceObj = SERVICES.find(s => s.id === selectedService);
    const serviceName = serviceObj ? serviceObj.title : (language === 'de' ? 'Allgemeine Anfrage' : 'General Inquiry');
    
    let baseMsg = '';
    if (language === 'de') {
      baseMsg = `Hallo EMMASCO-Team! 🌸\n\nMein Name ist *${name || 'Gast'}*.\n\nIch interessiere mich für Ihre Dienstleistung: *${serviceName}*.\n\n${messageText || 'Ich würde mich über ein unverbindliches Beratungsgespräch freuen. Haben Sie in nächster Zeit freie Kapazitäten?'}\n\nViele Grüße!`;
    } else {
      baseMsg = `Hello EMMASCO Team! 🌸\n\nMy name is *${name || 'Guest'}*.\n\nI am interested in your service: *${serviceName}*.\n\n${messageText || 'I would love to get a free consultation. Do you have availability anytime soon?'}\n\nBest regards!`;
    }
    return baseMsg;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = getComputedMessage();
    const encoded = encodeURIComponent(finalMsg);
    // Real emmasco contact number: 4917621856044
    const whatsappUrl = `https://wa.me/4917621856044?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const t = {
    de: {
      tooltip: 'Fragen? Schreiben Sie uns direkt auf WhatsApp!',
      title: 'WhatsApp Beratung',
      onlineStatus: 'Online • Antwortet meist sofort',
      intro: 'Haben Sie Fragen zur Haushaltshilfe, Alltagsbegleitung oder Abrechnung mit der Pflegekasse? Senden Sie uns einfach eine Nachricht!',
      labelName: 'Ihr Name',
      placeholderName: 'z.B. Maria Schmidt',
      labelService: 'Dienstleistung',
      labelMsg: 'Ihre Mitteilung (optional)',
      placeholderMsg: 'z.B. Wann hätten Sie nächste Woche Zeit?',
      btnSend: 'In WhatsApp fortfahren',
      previewTitle: 'Nachrichten-Vorschau',
      hint: 'Sie werden sicher an WhatsApp Web oder die App weitergeleitet.'
    },
    en: {
      tooltip: 'Questions? Chat with us directly on WhatsApp!',
      title: 'WhatsApp Consulting',
      onlineStatus: 'Online • Usually replies instantly',
      intro: 'Have questions about housekeeping, care companion services, or nursing insurance coverage? Drop us a line!',
      labelName: 'Your Name',
      placeholderName: 'e.g. Mary Smith',
      labelService: 'Select Service',
      labelMsg: 'Your message (optional)',
      placeholderMsg: 'e.g. When do you have openings next week?',
      btnSend: 'Continue in WhatsApp',
      previewTitle: 'Message Preview',
      hint: 'You will be securely redirected to WhatsApp Web or application.'
    }
  }[language === 'en' ? 'en' : 'de'];

  return (
    <div id="whats-app-floating-container" className="fixed bottom-6 right-6 z-[100] font-sans">
      
      {/* Dynamic Attention Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-16 right-2 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 text-xs font-semibold leading-relaxed text-left flex items-start gap-2 select-none"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white mt-0.5 animate-pulse">
              <Sparkles className="w-3 h-3 fill-current text-white" />
            </div>
            <div>
              <p>{t.tooltip}</p>
              <button 
                onClick={() => setShowTooltip(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-amber-400 mt-1.5 block cursor-pointer underline hover:no-underline"
              >
                {language === 'de' ? 'Ausblenden' : 'Dismiss'}
              </button>
            </div>
            {/* Elegant triangle speech bubble arrow */}
            <div className="absolute right-5 -bottom-2 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r border-b border-slate-101/80 dark:border-slate-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Expanded Chat Box UI */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-[350px] max-w-[calc(100vw-32px)] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col mb-18 relative text-left"
          >
            {/* Header style resembling official WhatsApp */}
            <div className="bg-[#075E54] dark:bg-slate-950 p-4 pb-5 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-md relative">
                  <MessageCircle className="w-5 h-5 text-white fill-current animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075E54]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide">{t.title}</h4>
                  <span className="text-[10px] text-emerald-300 font-bold block mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    {t.onlineStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
                aria-label="Close chat support window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body & Input Form */}
            <div className="p-4 max-h-[420px] overflow-y-auto space-y-4 bg-[#ECE5DD] dark:bg-slate-900/90">
              {/* Automated message card from support */}
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed max-w-[90%] text-slate-800 dark:text-slate-100 relative">
                <p>{t.intro}</p>
                <span className="block text-[8px] text-slate-400 font-bold text-right mt-1.5">EMMASCO Team</span>
                <div className="absolute top-0 -left-2.5 w-3 h-3 bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              </div>

              {/* Form Inquiry */}
              <form onSubmit={handleSendWhatsApp} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                    {t.labelName}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.placeholderName}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs rounded-xl py-2 px-3 pl-8 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Service Dropdown Inquiry */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                    {t.labelService}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 font-semibold appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Msg text */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                    {t.labelMsg}
                  </label>
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t.placeholderMsg}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-101 dark:border-slate-801 text-xs rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 overflow-y-auto leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Real-time Dynamic Message Preview Box inside Chat widget */}
                <div className="bg-emerald-50/50 dark:bg-slate-900 p-3 rounded-xl border border-emerald-100/60 dark:border-slate-700/80">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1.5">
                    {t.previewTitle}
                  </span>
                  <p className="text-[10px] leading-relaxed text-slate-650 dark:text-slate-300 font-serif line-clamp-4 whitespace-pre-wrap select-none italic text-left">
                    {getComputedMessage().replaceAll('*', '')}
                  </p>
                </div>

                {/* Submit button to safe URL */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow cursor-pointer select-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t.btnSend}
                </button>

                <span className="block text-[9px] text-[#075E54]/70 dark:text-slate-400 text-center font-semibold leading-relaxed">
                  ✓ {t.hint}
                </span>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Active Launcher Bubble */}
      <button
        id="whats-app-launcher-btn"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            handleOpenChat();
          }
        }}
        className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-[0_6px_25px_rgba(16,185,129,0.36)] hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none border border-emerald-400 relative group"
        title="WhatsApp Support Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white fill-current" />
            {/* Green glowing ring around the bubble */}
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
          </>
        )}
      </button>

    </div>
  );
}
