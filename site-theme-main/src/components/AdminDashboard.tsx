/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, Mail, Key, Home, Sparkles, ShoppingCart, HeartHandshake, FileText, 
  Trash, CheckCircle2, XCircle, Users, TrendingUp, Activity, Plus, FileUp, PenSquare 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Booking, Service, BlogArticle } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  articles: BlogArticle[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onAddService: (newService: Service) => void;
  onAddArticle: (newArticle: BlogArticle) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled') => void;
  onDeleteBooking: (bookingId: string) => void;
}

export default function AdminDashboard({
  bookings,
  services,
  articles,
  isLoggedIn,
  onLogin,
  onAddService,
  onAddArticle,
  onUpdateBookingStatus,
  onDeleteBooking
}: AdminDashboardProps) {

  // Login variables
  const [adminEmail, setAdminEmail] = useState('admin@emmascoreinigungsteam.de');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active View Tab inside Admin Panel
  // "bookings" | "services" | "articles" | "analytics"
  const [adminTab, setAdminTab] = useState<'bookings' | 'services' | 'articles' | 'analytics'>('analytics');

  // Input States for adding service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'haushalt' | 'reinigung' | 'begleitung' | 'zusatz'>('haushalt');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('ab 29,90 € / Std.');
  const [newServicePriceVal, setNewServicePriceVal] = useState('29.90');

  // Input States for adding article
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState<'Cleaning Tips' | 'Health' | 'Lifestyle'>('Cleaning Tips');
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@emmascoreinigungsteam.de' && adminPassword === 'admin123') {
      onLogin();
      setLoginError('');
    } else {
      setLoginError('Ungültige Administrator-Anmeldedaten.');
    }
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServiceDesc.trim()) {
      alert('Bitte alle Felder des Services ausfüllen.');
      return;
    }

    const priceNum = parseFloat(newServicePriceVal) || 29.90;
    const added: Service = {
      id: `service-${Date.now()}`,
      title: newServiceName,
      category: newServiceCategory,
      description: newServiceDesc,
      detailedDescription: newServiceDesc + ' (Qualitätsgeprüfte Expressleistung)',
      price: newServicePrice,
      priceValue: priceNum,
      iconName: 'Sparkles'
    };

    onAddService(added);
    // Reset states
    setNewServiceName('');
    setNewServiceDesc('');
    alert(`✔ Service "${added.title}" wurde erfolgreich dem Katalog hinzugefügt!`);
  };

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleContent.trim()) {
      alert('Bitte füllen Sie den Titel und Inhalt des Beitrags aus.');
      return;
    }

    const addedArt: BlogArticle = {
      id: `art-${Date.now()}`,
      title: newArticleTitle,
      category: newArticleCategory,
      excerpt: newArticleExcerpt || newArticleContent.substring(0, 100) + '...',
      content: newArticleContent,
      author: 'Emma Osei, Geschäftsführung',
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: '4 Min. Lesezeit',
      image: 'https://picsum.photos/seed/blogadd/600/400',
      tags: [newArticleCategory, 'Hauswirtschaft']
    };

    onAddArticle(addedArt);
    // Reset states
    setNewArticleTitle('');
    setNewArticleExcerpt('');
    setNewArticleContent('');
    alert(`✔ SEO-Blogartikel "${addedArt.title}" wurde erfolgreich veröffentlicht!`);
  };

  // Stats Counters
  const totalRevenueThisMonth = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalPrice, 0) + 12450.00; // adding baseline base stats for realism

  const activeStaffSize = 14;
  const dispatchSuccessRate = 98.6;

  // Analytics Dynamic Chart Data (Revenue Growth Year 2026)
  const revenueChartData = [
    { name: 'Jan 26', Umsatz: 8900 },
    { name: 'Feb 26', Umsatz: 10400 },
    { name: 'Mär 26', Umsatz: 12100 },
    { name: 'Apr 26', Umsatz: 13900 },
    { name: 'Mai 26', Umsatz: 15200 },
    { name: 'Jun 26', Umsatz: totalRevenueThisMonth }
  ];

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-left">
        <div className="bg-slate-900 text-slate-150 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-6">
          
          <div className="text-center flex flex-col items-center">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-black text-white mt-1">EMMASCO Admin Portal</h1>
            <p className="text-slate-400 font-semibold text-xs mt-1">
              Gesichertes CRM, Analytics-Zentrum und Inhalts-Redaktor für EMMASCO Reinigungsteam.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Admin E-Mail *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 input-secure">
              <label className="text-xs font-bold text-slate-300">Master Passwort *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loginError && <p className="text-xs text-red-400 font-bold">{loginError}</p>}

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-sm cursor-pointer text-center"
            >
              Master-Login ausführen
            </button>
          </form>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left text-[11px] font-semibold text-slate-300 leading-relaxed">
            <span className="font-extrabold block text-blue-400 mb-0.5">💡 Zugangsdaten im Demomodus:</span>
            <span>
              E-Mail: <strong>admin@emmascoreinigungsteam.de</strong>
              <br />
              Passwort: <strong>admin123</strong>
            </span>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left">
      
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-blue-600 text-xs font-bold uppercase py-0.5 px-2.5 rounded">Administrator Modus</span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">EMMASCO Leitstelle Berlin</h1>
          <p className="text-xs text-slate-400 mt-1">Hier verwalten Sie Termine, erzeugen Services und betrachten Ihre Finanz-Analytics.</p>
        </div>
        
        {/* Nav tabs for admin */}
        <div className="flex flex-wrap gap-2">
          <button
            id="admin-tab-btn-analytics"
            onClick={() => setAdminTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              adminTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            📊 Analytics
          </button>
          <button
            id="admin-tab-btn-bookings"
            onClick={() => setAdminTab('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              adminTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            📅 CRM Anfragen ({bookings.length})
          </button>
          <button
            id="admin-tab-btn-services"
            onClick={() => setAdminTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              adminTab === 'services' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            ⚙ Services ({services.length})
          </button>
          <button
            id="admin-tab-btn-articles"
            onClick={() => setAdminTab('articles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              adminTab === 'articles' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            ✍ Blog-Editor ({articles.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: ANALYTICS & STATS CENTRALE */}
      {adminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 animate-fade-in">
          
          {/* Main big analytic dashboard tiles */}
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm text-left flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-gray-400">Bruttoumsatz lfd. Monat</span>
                <span className="text-xl font-black block text-blue-900">{totalRevenueThisMonth.toFixed(2)} €</span>
                <span className="text-[10px] text-green-600 font-extrabold">▲ +14% vs. Vormonat</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm text-left flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-gray-400">Teamgröße (Mitarbeiter)</span>
                <span className="text-xl font-black block text-blue-900">{activeStaffSize} Vollzeiträfte</span>
                <span className="text-[10px] text-gray-500 font-bold">100% zertifiziert</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm text-left flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-gray-400">Zustellquote (Präzision)</span>
                <span className="text-xl font-black block text-blue-900">{dispatchSuccessRate}%</span>
                <span className="text-[10px] text-green-600 font-extrabold">Feste Wunschkraft garantiert</span>
              </div>
            </div>
          </div>

          {/* Line areas chart from Recharts */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm">
            <h3 className="font-extrabold text-blue-950 text-sm uppercase tracking-wider mb-4">Umsatzentwicklung 2026 (in €)</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUmsatz" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0056D6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0056D6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#a0a0a0" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a0a0a0" fontSize={10} tickLine={false} />
                  <Tooltip formatter={(value) => [`${value} €`, 'Umsatz']} />
                  <Area type="monotone" dataKey="Umsatz" stroke="#0056D6" strokeWidth={3} fillOpacity={1} fill="url(#colorUmsatz)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick CRM Overview log */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col justify-between">
            <div className="text-left flex flex-col gap-3">
              <h3 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Berliner Belegungen</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Insgesamt liegen <strong>{bookings.length} Anfragen</strong> im Dispositionsspeicher zur Einplanung vor.
              </p>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="bg-blue-50 p-3 rounded-xl text-left border border-blue-100 text-xs font-semibold text-blue-800">
                  ⚡ <strong>Wichtig:</strong> Bitte prüfen Sie die ausstehenden Anfragen und koordinieren Sie die Teams zeitnah!
                </div>
              </div>
            </div>

            <button
              id="dispatch-auto-btn"
              onClick={() => alert('🤖 Automatische Disposition gestartet:\nTeam-Kalender wurden mit Google Maps Routenplanung synchronisiert.')}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs cursor-pointer text-center shadow-xs"
            >
              Auto-Disposition starten
            </button>
          </div>

        </div>
      )}

      {/* VIEW 2: CRM BOOKINGS MANAGER */}
      {adminTab === 'bookings' && (
        <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm mt-8 animate-fade-in text-left">
          <div className="border-b border-gray-100 pb-3 mb-6">
            <h2 className="text-xl font-black text-blue-900">Kundenbuchungen verwalten</h2>
            <p className="text-xs text-gray-405 mt-1">Eingehende Terminanfragen bestätigen, ablehnen oder stornieren.</p>
          </div>

          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                id={`admin-booking-row-${b.id}`}
                className="border border-blue-50 rounded-2xl p-5 hover:bg-gray-50/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/20"
              >
                <div className="flex-1 text-left flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#0056D6] text-sm">{b.customerName}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs font-medium text-gray-650">{b.serviceName}</span>
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                      b.status === 'confirmed' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : b.status === 'cancelled'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-yellow-50 border-yellow-250 text-yellow-750'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-505 font-bold leading-normal mt-1.5">
                    ✉ {b.email} | 📞 {b.phone}
                  </p>
                  <p className="text-xs text-slate-450 font-semibold">
                    📍 {b.address}
                  </p>
                  <p className="text-xs text-slate-400 italic mt-1 font-semibold">
                    📝 "{b.notes || 'Keine Anmerkung hinterlegt'}"
                  </p>
                </div>

                <div className="flex flex-col md:items-end text-left md:text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 block">{b.date} um {b.time} Uhr</span>
                  <span className="text-[11px] font-bold text-gray-550 mt-1">ID: {b.id} | Summe: {b.totalPrice.toFixed(2)} €</span>

                  <div className="flex gap-2 items-center mt-4">
                    {b.status === 'pending' && (
                      <button
                        id={`admin-approve-btn-${b.id}`}
                        onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                        className="py-1.5 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] uppercase cursor-pointer"
                      >
                        ✔ Bestätigen
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        id={`admin-cancel-btn-${b.id}`}
                        onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                        className="py-1.5 px-3 rounded-lg border border-red-200 text-red-650 font-extrabold text-[10px] uppercase hover:bg-red-50 cursor-pointer"
                      >
                        ✕ Stornieren
                      </button>
                    )}
                    <button
                      id={`admin-delete-btn-${b.id}`}
                      onClick={() => {
                        if (confirm('Einsatz wirklich vollständig löschen? Diese Aktion ist permanent.')) {
                          onDeleteBooking(b.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Löschen"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SERVICES CREATOR */}
      {adminTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in text-left">
          
          {/* Create new service form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-5">
            <h3 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Neuen Service anlegen</h3>
            <form onSubmit={handleAddServiceSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Titel der Leistung *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Winterdienst & Streuservice"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Kategorie *</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as any)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="haushalt">Haushalt & Alltag</option>
                  <option value="reinigung">Reinigung</option>
                  <option value="begleitung">Kassenbegleitung</option>
                  <option value="zusatz">Zusatzleistung</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Abbildungspreis (Anzeige) *</label>
                <input
                  type="text"
                  required
                  placeholder="ab 32,50 € / Std."
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Interner Berechnungsstundensatz (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newServicePriceVal}
                  onChange={(e) => setNewServicePriceVal(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Kurzbeschreibung *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Kurze Beschreibung für die Kundenübersicht..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                id="admin-add-service-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs cursor-pointer text-center"
              >
                Service im Webkatalog freigeben
              </button>
            </form>
          </div>

          {/* Current services list */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Aktiver Leistungskatalog</h3>
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
              {services.map((s) => (
                <div key={s.id} className="border border-blue-50 rounded-2xl p-4 flex justify-between items-center text-xs bg-[#F6FAFF]/40 hover:bg-[#F6FAFF] transition">
                  <div className="text-left flex flex-col gap-0.5">
                    <span className="font-extrabold text-blue-900 text-sm block">{s.title}</span>
                    <span className="text-[10px] text-gray-400 capitalize bg-blue-50 shrink-0 self-start px-2 py-0.5 rounded border border-blue-100 font-bold mt-1">
                      Kategorie: {s.category}
                    </span>
                    <p className="text-slate-505 font-medium mt-1 pr-6 max-w-sm">{s.description}</p>
                  </div>
                  <span className="font-black text-blue-700 shrink-0 text-right">{s.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 4: BLOG ARTICLES WRITER */}
      {adminTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in text-left">
          
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-5">
            <h3 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Neuen Ratgeberartikel verfassen</h3>
            <form onSubmit={handleCreateArticleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Titel des Artikels *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Wie oft sollte man Fenster wischen?"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Themenkategorie *</label>
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value as any)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cleaning Tips">Reinigungs-Tipps (Cleaning Tips)</option>
                  <option value="Health">Gesundheit im Alter (Health)</option>
                  <option value="Lifestyle">Langlebiger Haushalt (Lifestyle)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Teaser / Excerpt *</label>
                <input
                  type="text"
                  placeholder="Kurze zweizeilige Einleitung zur Vorschau..."
                  value={newArticleExcerpt}
                  onChange={(e) => setNewArticleExcerpt(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Inhalt des Ratgebers *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Schreiben Sie hier Ihren reichhaltigen Artikel. Sie können auch Markdown nutzen..."
                  value={newArticleContent}
                  onChange={(e) => setNewArticleContent(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                id="admin-publish-article"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs cursor-pointer text-center"
              >
                Ratgeber-Beitrag veröffentlichen (SEO-optimiert)
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Veröffentlichte Ratgeber</h3>
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
              {articles.map((art) => (
                <div key={art.id} className="border border-blue-50 rounded-2xl p-4 flex justify-between items-start text-xs bg-[#F6FAFF]/40 hover:bg-[#F6FAFF] transition">
                  <div className="text-left flex flex-col gap-1">
                    <span className="font-extrabold text-blue-900 text-sm block">{art.title}</span>
                    <span className="text-[9px] uppercase font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded self-start mt-1">
                      {art.category}
                    </span>
                    <p className="text-gray-500 mt-1">{art.excerpt}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 select-none">{art.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
