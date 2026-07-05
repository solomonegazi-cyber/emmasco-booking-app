/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageSquare, Heart, Sparkles, CheckSquare, Info } from 'lucide-react';
import { SERVICES } from '../data';
import { Booking } from '../types';
import { useLanguage } from '../LanguageContext';

interface BookingProps {
  selectedServiceId: string | null;
  onBookingSubmit: (newBooking: Booking) => void;
  isLoggedIn: boolean;
  currentUser?: { name: string; email: string; phone: string; address: string } | null;
}

export default function BookingForm({ selectedServiceId, onBookingSubmit, isLoggedIn, currentUser }: BookingProps) {
  const { language, t, services } = useLanguage();
  
  // Use localized services if available, fallback to original list
  const activeServices = services && services.length > 0 ? services : SERVICES;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceId: activeServices[0].id,
    date: '',
    time: '09:00',
    message: '',
    hasPflegegrad: false,
    frequency: 'einmalig'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Autofill if logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      }));
    }
  }, [isLoggedIn, currentUser]);

  // Handle selected service change parameter
  useEffect(() => {
    if (selectedServiceId) {
      setFormData(prev => ({ ...prev, serviceId: selectedServiceId }));
    }
  }, [selectedServiceId]);

  const selectedService = activeServices.find(s => s.id === formData.serviceId) || activeServices[0];

  // Price Calculation Logic
  const getEstimatedPrice = () => {
    const rate = selectedService.priceValue;
    let baseTime = 3; // standard base hours of service
    if (selectedService.id === 'fenster') baseTime = 1;
    let cost = rate * baseTime;
    
    // adjust cost for frequency
    if (formData.frequency === 'woechentlich') {
      cost = cost * 0.9; // 10% discount for regular
    } else if (formData.frequency === 'zweiwoechentlich') {
      cost = cost * 0.95; // 5% discount
    }
    return parseFloat(cost.toFixed(2));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = language === 'de' ? 'Name ist erforderlich.' : 'Name is required.';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = language === 'de' ? 'Gültige E-Mail-Adresse erforderlich.' : 'Valid email address required.';
    }
    if (!formData.phone.trim()) {
      errors.phone = language === 'de' ? 'Telefonnummer ist erforderlich.' : 'Phone number is required.';
    }
    if (!formData.address.trim()) {
      errors.address = language === 'de' ? 'Adresse ist erforderlich.' : 'Address is required.';
    }
    
    // Date must be in the future
    if (!formData.date) {
      errors.date = language === 'de' ? 'Datum ist erforderlich.' : 'Date is required.';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = language === 'de' 
          ? 'Das Datum muss in der Zukunft liegen.' 
          : 'The placement date must reside in the future.';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const price = getEstimatedPrice();
    const mockId = `EM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: mockId,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      serviceId: formData.serviceId,
      serviceName: selectedService.title,
      date: formData.date,
      time: formData.time,
      status: 'pending',
      notes: formData.message + (formData.hasPflegegrad ? ' (Abrechnung über Pflegekasse §45a gewünscht)' : ''),
      totalPrice: price,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onBookingSubmit(newBooking);
    setCreatedBooking(newBooking);
    setIsSubmitted(true);
    
    // Scroll to top of form
    const element = document.getElementById('booking-card-root');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCreatedBooking(null);
    setFormData(prev => ({
      ...prev,
      date: '',
      message: '',
      hasPflegegrad: false
    }));
  };

  return (
    <div id="booking-card-root" className="max-w-7xl mx-auto px-4 py-16 text-left">
      
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
        <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          {language === 'de' ? 'Einfache Beantragung in 2 Minuten' : 'Easy 2-minute request form'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tight leading-none">
          {language === 'de' ? 'Ihr Wunschtermin anfordern' : 'Request your slot'}
        </h1>
        <p className="text-gray-500 text-sm font-semibold">
          {language === 'de' 
            ? 'Füllen Sie unverbindlich das Buchungsformular aus. Unser Serviceteam prüft Ihren Terminwunsch und meldet sich innerhalb von 2 Stunden zurück.'
            : 'Fill out the non-binding contact request. Our office staff will verify available aids and return feedback in 2 business hours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Interactive Booking Form */}
        <div className="lg:col-span-7">
          {isSubmitted && createdBooking ? (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-green-150 shadow-xl text-center flex flex-col items-center gap-6 animate-scale-up">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                ✔
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-blue-900">
                  {language === 'de' ? 'Termin erfolgreich angefragt!' : 'Booking requested successfully!'}
                </h2>
                <p className="text-gray-500 font-semibold text-xs leading-relaxed max-w-md mx-auto">
                  {language === 'de' ? (
                    <>Vielen Dank, <strong>{createdBooking.customerName}</strong>. Eine automatische Bestätigung Ihres Termins für den <strong>{createdBooking.date} ({createdBooking.time} Uhr)</strong> wurde an Ihre E-Mail <strong>{createdBooking.email}</strong> gesendet.</>
                  ) : (
                    <>Many thanks, <strong>{createdBooking.customerName}</strong>. An automatic review ticket for <strong>{createdBooking.date} ({createdBooking.time} Hrs)</strong> has been sent to your mail <strong>{createdBooking.email}</strong>.</>
                  )}
                </p>
              </div>

              {/* Simulated Client Notification Info Box */}
              <div className="bg-blue-50/70 border border-blue-100 p-5 rounded-2xl w-full text-left flex flex-col gap-3 font-semibold text-xs">
                <div className="flex justify-between items-center text-xs font-black text-blue-900">
                  <span>{language === 'de' ? 'ANFRAGE-ID:' : 'TICKET-ID:'} {createdBooking.id}</span>
                  <span className="bg-yellow-100 border border-yellow-200 text-yellow-700 font-semibold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                    {language === 'de' ? 'In Prüfung (Standby)' : 'Under Review (Pending)'}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 font-semibold text-gray-700">
                  <p>■ <strong>{language === 'de' ? 'Gewählte Leistung:' : 'Domestic service:'}</strong> {createdBooking.serviceName}</p>
                  <p>■ <strong>{language === 'de' ? 'Einsatzort:' : 'Service Location:'}</strong> {createdBooking.address}</p>
                  <p>■ <strong>{language === 'de' ? 'Geschätzte Kosten:' : 'Estimated Costs:'}</strong> {createdBooking.totalPrice.toFixed(2)} € ({language === 'de' ? 'oder über Kasse' : 'or care fund'})</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  {language === 'de' 
                    ? '* Unser Dispositionsteam wird sich nun telefonisch mit Ihnen in Verbindung setzen, um die Details zu bestätigen und Ihre feste Hilfskraft festzulegen.'
                    : '* Our operations dispatch will reach out via mobile shortly to verify individual chores and assign your regular worker.'}
                </p>
              </div>

              <div className="flex gap-4 w-full justify-center">
                <button
                  id="booking-success-new-btn"
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-md cursor-pointer"
                >
                  {language === 'de' ? 'Weitere Buchung erstellen' : 'Create another booking'}
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-lg flex flex-col gap-6">
              
              <h2 className="text-sm font-black text-[#0056D6] uppercase tracking-wider border-b border-gray-100 pb-2">
                {language === 'de' ? 'Schritt 1: Kontaktdaten des Kunden' : 'Step 1: Contact Information'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-name" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Vor- & Nachname *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      id="booking-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-blue-50'
                      }`}
                      placeholder="z.B. Waltraud Schmidt"
                    />
                  </div>
                  {formErrors.name && <span className="text-[11px] text-red-600 font-medium">{formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-email" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'E-Mail-Adresse *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="email"
                      id="booking-email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-blue-50'
                      }`}
                      placeholder="ihre-mail@web.de"
                    />
                  </div>
                  {formErrors.email && <span className="text-[11px] text-red-600 font-medium">{formErrors.email}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-phone" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Telefonnummer *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="tel"
                      id="booking-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-blue-50'
                      }`}
                      placeholder="z.B. 0176 1234567"
                    />
                  </div>
                  {formErrors.phone && <span className="text-[11px] text-red-600 font-medium">{formErrors.phone}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-address" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Einsatzort / Anschrift (Berlin) *' : 'House Address (Berlin) *'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      id="booking-address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.address ? 'border-red-400 focus:ring-red-400' : 'border-blue-50'
                      }`}
                      placeholder="Str., Hausnr., PLZ Berlin"
                    />
                  </div>
                  {formErrors.address && <span className="text-[11px] text-red-600 font-medium">{formErrors.address}</span>}
                </div>
              </div>

              <h2 className="text-sm font-black text-[#0056D6] uppercase tracking-wider border-b border-gray-100 pb-2 mt-4">
                {language === 'de' ? 'Schritt 2: Gewünschte Dienstleistung & Frequenz' : 'Step 2: Domestic Care Chores & Recurrence'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Wählen Sie Ihre Leistung *' : 'Select Domestic Service *'}
                  </label>
                  <select
                    id="booking-service-select"
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {activeServices.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-755">
                    {language === 'de' ? 'Wiederholungsintervall' : 'Recurrence Frequency'}
                  </label>
                  <select
                    id="booking-frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="einmalig">{language === 'de' ? 'Einmaliger Einsatz' : 'One-time execution'}</option>
                    <option value="woechentlich">{language === 'de' ? 'Wöchentlich (10% Rabatt)' : 'Weekly (10% discount)'}</option>
                    <option value="zweiwoechentlich">{language === 'de' ? 'Alle 2 Wochen (5% Rabatt)' : 'Every 2 weeks (5% discount)'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-date" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Gewünschtes Datum *' : 'Preferred Date *'}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="date"
                      id="booking-date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.date ? 'border-red-400 focus:ring-red-400' : 'border-blue-50'
                      }`}
                    />
                  </div>
                  {formErrors.date && <span className="text-[11px] text-red-600 font-medium">{formErrors.date}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-time" className="text-xs font-extrabold text-gray-750">
                    {language === 'de' ? 'Gewünschte Startuhrzeit *' : 'Desired clock time *'}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="time"
                      id="booking-time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pflegekassen-Abfrage (healthcare highlight) */}
              <div className="bg-blue-50 border border-blue-150 p-4 rounded-2xl flex items-start gap-3 my-2 text-left">
                <input
                  type="checkbox"
                  id="checkout-pflegegrad"
                  checked={formData.hasPflegegrad}
                  onChange={(e) => setFormData({...formData, hasPflegegrad: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-blue-200 rounded focus:ring-blue-500 mt-1 cursor-pointer shrink-0"
                />
                <div className="text-xs font-semibold text-blue-900 leading-relaxed">
                  <label htmlFor="checkout-pflegegrad" className="font-extrabold block mb-0.5 cursor-pointer">
                    {language === 'de' ? 'Abrechnung über Pflegekasse (§45a SGB XI) gewünscht?' : 'Direct invoice to public German care fund (§45a SGB XI)?'}
                  </label>
                  <span>
                    {language === 'de' 
                      ? 'Aktivieren Sie dieses Feld, wenn Sie einen anerkannten Pflegegrad besitzen. Dadurch wird das Stundenbudget direkt bei Ihrer Kasse angefordert, anstatt Ihnen privat berechnet zu werden.'
                      : 'Tick this box if you own an officially registered German care level. We will process payment directly with your Care Fund instead of billing you privately.'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-notes" className="text-xs font-extrabold text-gray-750">
                  {language === 'de' ? 'Besondere Wünsche oder Krankheiten (optional)' : 'Any particular chores or health conditions (optional)'}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4.5 h-4.5 text-gray-400" />
                  <textarea
                    id="booking-notes"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'de' 
                      ? 'Gibt es Haustiere? Wünschen Sie eine bestimmte Ansprache? Liegt eine Gehbehinderung vor?'
                      : 'Pets in household? Prefer some special address? Any local mobility limitations in flat?'}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="booking-submit-btn"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-full text-sm transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] mt-2 cursor-pointer text-center"
              >
                {language === 'de' ? 'UNVERBINDLICHE TERMINANFRAGE SENDEN' : 'SEND SERVICE SCHEDULER REQUEST'}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Cost Overview & Health Guidelines Widget */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          
          {/* Dynamic Budget Calculator Widget */}
          <div className="bg-[#0056D6] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col gap-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            
            <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">
              {language === 'de' ? 'RECHNER-KALKULATOR v2.2' : 'ESTIMATED PRICE CALCULATOR v2.2'}
            </span>
            
            <div>
              <span className="text-3xl font-black block">
                {formData.hasPflegegrad ? '0,00 €' : `${getEstimatedPrice().toFixed(2)} €`}
              </span>
              <span className="text-xs font-bold text-blue-200">
                {formData.hasPflegegrad 
                  ? (language === 'de' ? 'Kostenübernahme über Entlastungsbetrag §45a' : 'Cost fully covered via Care Allowance (§45a)')
                  : (language === 'de' ? 'Voraussichtlicher Brutto-Betrag (Privatabrechnung)' : 'Estimated gross amount (Private Invoice)')}
              </span>
            </div>

            <div className="border-t border-blue-500/30 pt-4 text-xs font-semibold uppercase tracking-wider text-blue-200 flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-100">
                <span>{language === 'de' ? 'Dienstleistung:' : 'Service:'}</span>
                <span className="font-extrabold text-white text-right max-w-[180px] truncate">{selectedService.title}</span>
              </div>
              <div className="flex justify-between items-center text-slate-100">
                <span>{language === 'de' ? 'Frequenz:' : 'Recurrence:'}</span>
                <span className="font-extrabold text-white">
                  {formData.frequency === 'einmalig' && (language === 'de' ? 'Einmalig' : 'One-time')}
                  {formData.frequency === 'woechentlich' && (language === 'de' ? 'Wöchentlich' : 'Weekly')}
                  {formData.frequency === 'zweiwoechentlich' && (language === 'de' ? 'Alle 2 Wochen' : 'Every 2 weeks')}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-100">
                <span>{language === 'de' ? 'Anfahrt & Rüstzeit:' : 'Travel costs & prep:'}</span>
                <span className="font-extrabold text-green-400">
                  {language === 'de' ? 'KOSTENLOS (Berlin)' : 'FREE OF CHARGE (Berlin)'}
                </span>
              </div>
            </div>

            {formData.hasPflegegrad ? (
              <div className="bg-blue-800/80 p-3 rounded-xl border border-blue-600 flex items-start gap-2.5 mt-2 text-[11px] font-semibold text-blue-105 leading-relaxed">
                <span className="text-lg">💰</span>
                <div>
                  <span className="font-bold text-white block">
                    {language === 'de' ? 'Budgetauslastung:' : 'Care Limit details:'}
                  </span>
                  {language === 'de' 
                    ? `Ihre Pflegekasse stellt Ihnen 125,00 €/Monat für diese Leistung bereit. Dies entspricht ca. ${Math.floor(125 / selectedService.priceValue)} Stunden im Monat. Restguthaben wird in den Folgemonat übertragen.`
                    : `Your public Care Fund allocates 125.00 €/month for helper tasks. This matches ca. ${Math.floor(125 / selectedService.priceValue)} service hours a month. Rest budget rolls over.`}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-blue-200 leading-relaxed font-semibold italic">
                {language === 'de' 
                  ? '* Die finale Kalkulation hängt von der tatsächlichen Arbeitszeit bei Ihnen vor Ort ab. Sie erhalten eine detaillierte, steuerlich absetzbare Monatsrechnung.'
                  : '* Final invoices are adapted to real hours worked at place. You will receive an official tax-offset monthly receipt.'}
              </p>
            )}
          </div>

          {/* Guide Card - How our care process works */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-sm text-left flex flex-col gap-4 font-semibold text-xs">
            <h3 className="font-extrabold text-blue-950 text-base flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              {language === 'de' ? 'So läuft die Buchung ab:' : 'How the process flows:'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 font-extrabold rounded-full flex items-center justify-center shrink-0">1</div>
                <div>
                  <span className="font-bold text-gray-900 block">
                    {language === 'de' ? 'Unverbindliche Anfrage senden' : 'Send unbinding inquiry'}
                  </span>
                  <p className="text-gray-500 mt-0.5">
                    {language === 'de' ? 'Sie wählen eine Leistung und Ihren Wunschtermin aus.' : 'You specify domestic service details and a suitable date.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 font-extrabold rounded-full flex items-center justify-center shrink-0">2</div>
                <div>
                  <span className="font-bold text-gray-900 block">
                    {language === 'de' ? 'Persönlicher Rückruf in 2 Std.' : 'Personal callback in 2 hours'}
                  </span>
                  <p className="text-gray-500 mt-0.5">
                    {language === 'de' ? 'Wir kontaktieren Sie, klären alle Fragen und ermitteln Ihre Wunschkraft.' : 'We connect to evaluate care grades, explain procedures, and assign your regular worker.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 font-extrabold rounded-full flex items-center justify-center shrink-0">3</div>
                <div>
                  <span className="font-bold text-gray-900 block">
                    {language === 'de' ? 'Einführung & Ersttermin' : 'Introductory launch visit'}
                  </span>
                  <p className="text-gray-500 mt-0.5">
                    {language === 'de' ? 'Unser Team kommt zum vereinbarten Tag und führt die Tätigkeiten wunschgemäß aus.' : 'Our helper arrives at the designated hours and performs the activities according to your needs.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
