/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, Lock, Mail, Phone, MapPin, Calendar, FileText, Download, 
  Upload, MessageSquare, Send, CheckCircle, Clock, Trash, Key, PencilLine 
} from 'lucide-react';
import { Booking, UserDocument, ChatMessage } from '../types';
import { jsPDF } from 'jspdf';

interface CustomerDashboardProps {
  bookings: Booking[];
  isLoggedIn: boolean;
  onLogin: (email: string, name: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'cancelled') => void;
  onAddMessage: (msg: ChatMessage) => void;
  chatMessages: ChatMessage[];
  onUploadDocument: (doc: UserDocument) => void;
  documents: UserDocument[];
  onUpdateProfile: (name: string, phone: string, address: string) => void;
  currentUser: { name: string; email: string; phone: string; address: string } | null;
}

export default function CustomerDashboard({
  bookings,
  isLoggedIn,
  onLogin,
  onUpdateBookingStatus,
  onAddMessage,
  chatMessages,
  onUploadDocument,
  documents,
  onUpdateProfile,
  currentUser
}: CustomerDashboardProps) {
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('w.schmidt@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginName, setLoginName] = useState('Waltraud Schmidt');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab state inside customer dashboard
  // "bookings" | "documents" | "profile" | "support"
  const [activeTab, setActiveTab] = useState<'bookings' | 'documents' | 'profile' | 'support'>('bookings');

  // New Chat Message State
  const [chatInput, setChatInput] = useState('');
  
  // Edit Profile States
  const [profileName, setProfileName] = useState(currentUser?.name || 'Waltraud Schmidt');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '0176 94857391');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || 'Kollwitzstraße 14, 10435 Berlin');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Upload States
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileNameError, setUploadFileNameError] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    
    // Auto-login with appropriate names
    const displayName = isRegisterMode ? loginName : (loginEmail.includes('schmidt') ? 'Waltraud Schmidt' : 'Gast-Kunde');
    onLogin(loginEmail, displayName);
    setLoginError('');
    
    // Set profile field defaults
    setProfileName(displayName);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileName, profilePhone, profileAddress);
    setProfileSavedMsg('Profil erfolgreich gespeichert!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      text: chatInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };

    onAddMessage(userMsg);
    setChatInput('');

    // Trigger instant cute simulated reply from support agent
    setTimeout(() => {
      const supportMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        text: `Vielen Dank für Ihre Nachricht! Unser Berliner Support-Mitarbeiter ist informiert und meldet sich innerhalb von 15 Minuten telefonisch oder hier direkt im Portal bei Ihnen.`,
        sender: 'support',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(supportMsg);
    }, 1500);
  };

  const handleMockPdfDownload = (invoiceName: string) => {
    // Elegant mocked browser triggers
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', invoiceName);
    document.body.appendChild(link);
    
    // Visual alert to user for immersive feel
    alert(`📥 PDF-Download gestartet:\nDatei: "${invoiceName}" wird simuliert heruntergeladen.`);
    document.body.removeChild(link);
  };

  const generateInvoicePdf = (booking: Booking) => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Coordinates helper and branding colors
      const primaryColor = [0, 86, 214]; // #0056D6
      const accentColor = [47, 181, 255]; // #2FB5FF
      const textColor = [30, 41, 59]; // Slate-800
      const lightLineColor = [226, 232, 240];

      // Draw Top branding colored bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 8, 'F');

      // Header Brand Info
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('EMMASCO REINIGUNGSTEAM', 20, 25);

      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('IHR PARTNER FÜR HAND IN HAND SENIORENHILFE & HAUSHALTSPFLEGE', 20, 29);

      // Business Info Block
      doc.setTextColor(100, 116, 139);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Emmasco Reinigungsteam GmbH • Kollwitzstraße 14 • 10435 Berlin', 20, 35);
      doc.text('Tel: 0176 21856044 • Web: www.emmasco-reinigungsteam.de', 20, 39);

      // Top Divider Line
      doc.setDrawColor(lightLineColor[0], lightLineColor[1], lightLineColor[2]);
      doc.setLineWidth(0.3);
      doc.line(20, 42, 190, 42);

      // Address & Invoice Metadata Header Info
      doc.setTextColor(148, 163, 184);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('KUNDENDATEN / EMPFÄNGER', 20, 50);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(booking.customerName, 20, 56);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      const addressParts = booking.address.split(',');
      if (addressParts.length >= 2) {
        doc.text(addressParts[0].trim(), 20, 61.5);
        doc.text(addressParts[1].trim(), 20, 67);
      } else {
        const wrappedAddress = doc.splitTextToSize(booking.address, 75);
        doc.text(wrappedAddress, 20, 61.5);
      }

      // Metadata Box (Right)
      const invoiceNo = `RE-2026-${booking.id.toUpperCase()}`;
      const todayString = new Date().toLocaleDateString('de-DE');
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      const dueDateString = dueDate.toLocaleDateString('de-DE');

      doc.setTextColor(148, 163, 184);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('RECHNUNGSMETADATEN', 125, 50);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      
      doc.text('Rechnungs-Nr:', 125, 56);
      doc.setFont('Helvetica', 'bold');
      doc.text(invoiceNo, 162, 56);

      doc.setFont('Helvetica', 'normal');
      doc.text('Rechnungsdatum:', 125, 61.5);
      doc.text(todayString, 162, 61.5);

      doc.text('Dienstleistung:', 125, 67);
      doc.text(booking.date, 162, 67);

      doc.text('Fälligkeitsdatum:', 125, 72.5);
      doc.setFont('Helvetica', 'bold');
      doc.text(dueDateString, 162, 72.5);

      // Invoice Title Header
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('OFFIZIELLE RECHNUNG', 20, 88);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      const textIntro = `Sehr geehrte(r) ${booking.customerName},\n\nwir bedanken uns für den erteilten Reinigungs- und Betreuungsauftrag im Raum Berlin-Pankow. Hiermit stellen wir Ihnen die vertragsgemäß erbrachte Dienstleistung ordnungsgemäß in Rechnung.`;
      const wrappedIntro = doc.splitTextToSize(textIntro, 170);
      doc.text(wrappedIntro, 20, 94);

      // TABLE OF ITEMS
      const tableTopY = 118;
      
      // Header rect
      doc.setFillColor(248, 250, 252);
      doc.rect(20, tableTopY, 170, 7.5, 'F');
      
      // Header line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(20, tableTopY, 190, tableTopY);
      doc.line(20, tableTopY + 7.5, 190, tableTopY + 7.5);

      // Header titles
      doc.setTextColor(100, 116, 139);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('POSITION / BESCHREIBUNG', 23, tableTopY + 5);
      doc.text('SATZ / KOSTEN', 115, tableTopY + 5);
      doc.text('MENGE', 148, tableTopY + 5);
      doc.text('BETRAG (NETTO)', 166, tableTopY + 5);

      // Item Row Value
      const rowY = tableTopY + 14;
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(booking.serviceName, 23, rowY);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      const rowDetails = `Haushalts- und Alltagshilfe am ${booking.date} um ${booking.time} Uhr.`;
      doc.text(rowDetails, 23, rowY + 4.5);

      if (booking.notes) {
        doc.setFont('Helvetica', 'italic');
        doc.setTextColor(115, 115, 115);
        const wrappedNotes = doc.splitTextToSize(`Kundenhinweis: "${booking.notes}"`, 85);
        doc.text(wrappedNotes, 23, rowY + 9);
      }

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 115, rowY);
      doc.text('1,00 Psch.', 148, rowY);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, rowY);

      // Row divider
      const bottomRowY = booking.notes ? rowY + 16 : rowY + 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, bottomRowY, 190, bottomRowY);

      // Calculation Breakdown Box
      const calcY = bottomRowY + 8;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Zwischensumme (Netto):', 118, calcY);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, calcY);

      doc.text('Umsatzsteuer (0% / Befreit):', 118, calcY + 5.5);
      doc.text('0,00 €', 166, calcY + 5.5);

      // Bold Gross Total Line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.4);
      doc.line(115, calcY + 9, 190, calcY + 9);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('RECHNUNGSBETRAG:', 118, calcY + 14.5);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, calcY + 14.5);

      // TAX BREAKDOWN INFO & LEGAL STUFF
      doc.setTextColor(51, 65, 85);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('STEUERLICHE ABSETZBARKEIT (§ 35a EStG):', 20, calcY + 22);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Als haushaltsnahe Dienstleistung nach § 35a Absatz 2 EStG steuerlich begünstigt (20% der Lohnkosten absetzbar).', 20, calcY + 26);
      doc.text('Umsatzsteuerbefreite Pflegesachleistung nach § 4 Nr. 16 SGB XI. Registrierter Anbieter für Entlastungsbetrag.', 20, calcY + 30);

      // Signature/Stamp Placeholders
      doc.setTextColor(148, 163, 184);
      doc.setDrawColor(203, 213, 225);
      doc.rect(20, calcY + 38, 45, 18);
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.text('Cynthia Osei', 22, calcY + 52);
      doc.text('Geschäftsführung Emmasco', 22, calcY + 54);

      // Payment details footer
      const footerY = 245;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(20, footerY, 190, footerY);

      doc.setTextColor(115, 115, 115);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Bitte überweisen Sie den Betrag unter Angabe des Verwendungszwecks (Rechnungs-Nr) innerhalb der Zahlungsfrist.', 20, footerY + 5);
      
      doc.setFont('Helvetica', 'bold');
      doc.text('Bankdaten für Überweisung:', 20, footerY + 10);
      doc.setFont('Helvetica', 'normal');
      doc.text('Berliner Volksbank • IBAN: DE78 1009 0000 1234 5678 90 • BIC: BEVO DE BB XXX', 20, footerY + 14);

      doc.setTextColor(100, 116, 139);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('Herzlichen Dank für Ihre Buchung bei EMMASCO!', 20, footerY + 23);

      doc.save(`Rechnung_${invoiceNo}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Der PDF-Download ist fehlgeschlagen. Bitte laden Sie die Seite neu.');
    }
  };

  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      setUploadFileNameError('Bitte wählen Sie ein Dokument (bzw. tragen Sie einen Dateinamen ein).');
      return;
    }

    const newDoc: UserDocument = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
      size: `${(0.5 + Math.random() * 3).toFixed(1)} MB`,
      type: 'PDF-Dokument',
      uploadDate: new Date().toLocaleDateString('de-DE'),
      status: 'pending'
    };

    onUploadDocument(newDoc);
    setUploadFileName('');
    setUploadFileNameError('');
    alert('📄 Dokument erfolgreich hochgeladen! Status ist nun "In Prüfung" durch unser Team.');
  };

  // Filter Bookings relative to customer
  const clientBookings = bookings.filter(b => b.email === (currentUser?.email || 'w.schmidt@gmail.com'));

  // Render Login Panel as default
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-left">
        <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-xl flex flex-col gap-6">
          
          <div className="text-center flex flex-col items-center">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-black text-blue-900 mt-2">EMMASCO Kundenportal</h1>
            <p className="text-gray-500 font-semibold text-xs mt-1 leading-relaxed">
              Verwalten Sie Ihre Buchungen, laden Sie Genehmigungen hoch und laden Sie Rechnungen direkt auf einen Klick herunter.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {isRegisterMode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">Ihr Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Waltraud Schmidt"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-gray-750">E-Mail-Adresse *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@portal.de"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-gray-750">Passwort *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loginError && <p className="text-xs text-red-600 font-bold">{loginError}</p>}

            <button
              type="submit"
              id="customer-login-submit"
              className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-3 rounded-xl text-sm shadow cursor-pointer text-center"
            >
              {isRegisterMode ? 'Konto anlegen' : 'Im Kundenportal einloggen'}
            </button>
          </form>

          {/* Quick Sandbox Guide for testing */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left text-[11px] font-semibold text-blue-900 leading-relaxed">
            <span className="font-extrabold block mb-0.5">💡 Demo-Testkonto:</span>
            <span>
              Verwenden Sie die E-Mail <strong>w.schmidt@gmail.com</strong> und ein beliebiges Passwort, um sich als unser Muster-Senior anzumelden und bereits bestehende Buchungen zu sehen!
            </span>
          </div>

          <button
            id="toggle-auth-mode-btn"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setLoginError('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline font-bold"
          >
            {isRegisterMode ? 'Bereits registriert? Hier einloggen' : 'Noch kein Konto? Hier registrieren'}
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left">
      
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-blue-800 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-blue-600 border border-blue-500 rounded-full px-2.5 py-1 uppercase font-black text-blue-100">
            Sicher eingeloggt als Kunde
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">Herzlich Willkommen, {currentUser?.name}!</h1>
          <p className="text-xs font-semibold text-blue-200 mt-1">
            Hier verwalten Sie Ihren Haushaltsplan und den Schriftverkehr mit Ihrer Pflegekasse.
          </p>
        </div>
        <div className="bg-blue-800 px-4 py-3 rounded-2xl border border-blue-600 font-extrabold text-xs">
          <span>Einzugsgebiet: Berlin-Pankow</span>
        </div>
      </div>

      {/* Dashboard container layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
        
        {/* Left Side: Sidebar navigation options */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <button
            id="tab-btn-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-50'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            Mein Haushaltsplan
          </button>

          <button
            id="tab-btn-documents"
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-50'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            Kassendokumente & Rechnungen
          </button>

          <button
            id="tab-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-50'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            Profildaten verwalten
          </button>

          <button
            id="tab-btn-support"
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-50'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            Live-Hilfe & Beistand
            {chatMessages.length > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>
        </div>

        {/* Right Side: Tab panel rendering details */}
        <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-md">
          
          {/* TAB 1: MY BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-blue-900">Aktuelle & geplante Einsätze</h2>
                <p className="text-xs text-gray-400 mt-1">Hier finden Sie alle gebuchten Termine für Ihre Haushaltshilfe.</p>
              </div>

              <div className="flex flex-col gap-4">
                {clientBookings.map((b) => (
                  <div 
                    key={b.id} 
                    id={`client-booking-row-${b.id}`}
                    className="border border-blue-50 rounded-2xl p-5 hover:bg-[#F6FAFF]/60 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F6FAFF]"
                  >
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-950 text-sm">{b.serviceName}</span>
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                          b.status === 'confirmed' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : b.status === 'cancelled'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}>
                          {b.status === 'confirmed' && '✔ Bestätigt'}
                          {b.status === 'pending' && '⌚ In Prüfung'}
                          {b.status === 'cancelled' && '✕ Storniert'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-505 leading-relaxed mt-1 font-semibold">
                        📍 <strong>Ort:</strong> {b.address}
                      </p>
                      
                      {b.notes && (
                        <p className="text-xs text-gray-500 italic mt-1 font-semibold">
                          📝 "{b.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col md:items-end text-left md:text-right shrink-0">
                      <span className="text-xs font-black text-blue-900 block">{b.date} um {b.time} Uhr</span>
                      <span className="text-[11px] font-bold text-gray-500 mt-0.5">Budgetbetrag: {b.totalPrice.toFixed(2)} €</span>
                      
                      {b.status !== 'cancelled' && (
                        <>
                          <button
                            id={`download-invoice-pdf-btn-${b.id}`}
                            onClick={() => generateInvoicePdf(b)}
                            className="mt-2 text-[11px] font-extrabold text-blue-700 hover:text-blue-900 bg-blue-50/75 hover:bg-blue-105/90 dark:text-blue-400 dark:hover:text-amber-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-slate-700 flex items-center gap-1 cursor-pointer transition-all duration-200"
                            title="Rechnung als PDF herunterladen"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Rechnung (PDF)
                          </button>

                          <button
                            id={`cancel-booking-btn-${b.id}`}
                            onClick={() => {
                              if (confirm('Möchten Sie diesen Termin wirklich stornieren? Unser Team wird sofort benachrichtigt.')) {
                                onUpdateBookingStatus(b.id, 'cancelled');
                              }
                            }}
                            className="mt-3.5 text-[10px] text-red-600 hover:text-red-800 font-extrabold hover:underline block text-left md:text-right"
                          >
                            ✕ Termin absagen
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {clientBookings.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-gray-150 rounded-2xl flex flex-col items-center gap-3">
                    <span className="text-3xl">📅</span>
                    <div>
                      <h4 className="font-extrabold text-[#0056D6] text-sm">Aktuell keine aktiven Einsätze</h4>
                      <p className="text-xs text-gray-400 mt-1">Sie haben bislang noch keinen Termin für diese E-Mail-Adresse angefragt.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS UPLOADER & INVOICES DOWNLOADER */}
          {activeTab === 'documents' && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* Document upload form (care grad approvals) */}
              <div className="text-left flex flex-col gap-4">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-blue-900">Leistungsbewilligungen & Atteste</h2>
                    <p className="text-xs text-gray-400 mt-1">Laden Sie Bescheide des Medizinischen Dienstes (MD) oder Ihrer Pflegekasse hoch.</p>
                  </div>
                </div>

                <form onSubmit={handleDocumentUpload} className="bg-[#F6FAFF] p-5 rounded-2xl border border-blue-50/50 flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-extrabold text-blue-900">Dateiname für Upload eintragen *</label>
                    <input
                      type="text"
                      placeholder="z.B. Bescheid_Pflegegrad3_Schmidt.pdf"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full bg-white border border-blue-105 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {uploadFileNameError && <span className="text-[10px] text-red-600 font-bold">{uploadFileNameError}</span>}
                  </div>
                  <button
                    type="submit"
                    id="submit-doc-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
                  >
                    <Upload className="w-4 h-4" />
                    Hochladen
                  </button>
                </form>

                {/* Document Status List */}
                <div className="flex flex-col gap-3 mt-2">
                  <h3 className="font-extrabold text-blue-950 text-sm">Status Ihrer Dokumente:</h3>
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.id} className="border border-blue-50 rounded-xl p-3.5 flex justify-between items-center text-xs bg-[#F6FAFF]/40">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">📄</span>
                          <div>
                            <span className="font-bold text-gray-900 block">{doc.name}</span>
                            <span className="text-[10px] text-gray-500">Größe: {doc.size} | Hochgeladen: {doc.uploadDate}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                          doc.status === 'approved' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-yellow-50 border-yellow-250 text-yellow-750'
                        }`}>
                          {doc.status === 'approved' ? '✔ Bewilligt / OK' : '⌚ In Prüfung'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Noch keine Genehmigungsdokumente hinterlegt.</p>
                  )}
                </div>
              </div>

              {/* PDF Invoices List */}
              <div className="text-left flex flex-col gap-4 border-t border-gray-150 pt-6">
                <div>
                  <h2 className="text-xl font-black text-blue-900">Abrechnungen & Monatsrechnungen</h2>
                  <p className="text-xs text-gray-400 mt-1">Laden Sie Ihre steuerlich absetzbaren Rechnungen nach §35a EStG herunter.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-blue-50 bg-white p-4 rounded-2xl flex justify-between items-center transition shadow-xs">
                    <div className="text-left">
                      <span className="block font-extrabold text-blue-950 text-xs">Rechnung Mai 2026</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">RE-2026-05 | 118,50 €</span>
                    </div>
                    <button
                      id="download-re-may"
                      onClick={() => handleMockPdfDownload('RE-2026-05_Emmasco.pdf')}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                      title="Herunterladen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="border border-blue-50 bg-white p-4 rounded-2xl flex justify-between items-center transition shadow-xs">
                    <div className="text-left">
                      <span className="block font-extrabold text-blue-950 text-xs">Rechnung April 2026</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">RE-2026-04 | 145,00 €</span>
                    </div>
                    <button
                      id="download-re-apr"
                      onClick={() => handleMockPdfDownload('RE-2026-04_Emmasco.pdf')}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                      title="Herunterladen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {clientBookings.filter(b => b.status === 'confirmed').map((b) => (
                    <div key={`inv-${b.id}`} className="border border-blue-200/60 dark:border-slate-800 bg-blue-50/15 dark:bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center transition shadow-xs">
                      <div className="text-left">
                        <span className="block font-extrabold text-blue-950 dark:text-slate-200 text-xs">Rechnung {b.serviceName}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">RE-2026-{b.id.toUpperCase()} | {b.date} | {b.totalPrice.toFixed(2)} €</span>
                      </div>
                      <button
                        id={`download-re-dynamic-${b.id}`}
                        onClick={() => generateInvoicePdf(b)}
                        className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition cursor-pointer"
                        title="Rechnung PDF generieren & herunterladen"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDIT PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-blue-900">Anschrift & Kontaktdaten ändern</h2>
                <p className="text-xs text-gray-400 mt-1">Passen Sie Ihre Daten für zukünftige Pflegerechnungen und Einsatzfahrten an.</p>
              </div>

              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-750">Name des Pflegebedürftigen</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-750">Telefon für Rückfragen</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-750">Einsatzadresse (Berlin)</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {profileSavedMsg && (
                  <p className="text-xs text-green-700 font-extrabold flex items-center gap-1">
                    ✔ {profileSavedMsg}
                  </p>
                )}

                <button
                  type="submit"
                  id="profile-save-submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl text-xs transition cursor-pointer self-start"
                >
                  Änderungen speichern
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: LIVE DISPATCH CHAT & SUPPORT */}
          {activeTab === 'support' && (
            <div className="flex flex-col gap-4 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-blue-900">Beistand & Support-Gespräch</h2>
                <p className="text-xs text-gray-400 mt-1">Hier schreiben Sie direkt mit unserer Teamleitung im Berliner Büro.</p>
              </div>

              {/* Chat Thread */}
              <div className="bg-[#F6FAFF] border border-blue-50 rounded-2xl p-4 h-64 overflow-y-auto flex flex-col gap-3">
                
                <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 p-3 rounded-2xl text-[11px] font-semibold text-blue-900 leading-normal mb-1">
                  <span>ℹ</span>
                  <span>
                    Unser Support ist Montag bis Freitag von 08:30 bis 18:00 Uhr besetzt. Für dringliche Pflegenotfälle am Wochenende wählen Sie bitte direkt unser Notruftelefon: 0176 21856044.
                  </span>
                </div>

                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed font-semibold transition-all ${
                        isUser 
                          ? 'self-end bg-blue-600 text-white border border-blue-500' 
                          : 'self-start bg-white text-gray-800 border border-blue-50 shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`block text-[8px] text-right mt-1 font-mono ${
                        isUser ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ihre Frage an Frau Osei oder Herrn Becker..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 border border-blue-50 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  id="chat-send-submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
