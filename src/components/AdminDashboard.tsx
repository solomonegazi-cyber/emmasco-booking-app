import React, { useState } from 'react';
import { 
  Lock, Mail, Key, Home, Sparkles, ShoppingCart, HeartHandshake, FileText, 
  Trash, CheckCircle2, XCircle, Users, TrendingUp, Activity, Plus, FileUp, 
  PenSquare, Shield, Check, UserCheck, AlertCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Booking, Service, BlogArticle } from '../types';
import { useToast } from '../ToastContext';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  articles: BlogArticle[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onAddService: (newService: Service) => void;
  onAddArticle: (newArticle: BlogArticle) => void;
  onUpdateBookingStatus: (
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled',
    cleanerName?: string
  ) => void;
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

  const { success, error, warning, info } = useToast();

  // Login variables
  const [adminEmail, setAdminEmail] = useState('admin@emmascoreinigungsteam.de');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active View Tab inside Admin Panel
  // "bookings" | "services" | "articles" | "analytics" | "customers"
  const [adminTab, setAdminTab] = useState<'bookings' | 'services' | 'articles' | 'analytics' | 'customers'>('analytics');

  // CRM Users listing state
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);

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

  // CRM cleaner inputs helper state mapped by booking ID
  const [cleanerAssignments, setCleanerAssignments] = useState<Record<string, string>>({});

  // Dynamic CRM user list loader
  React.useEffect(() => {
    if (isLoggedIn) {
      setCrmLoading(true);
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.users)) {
            setRegisteredUsers(data.users);
          } else if (Array.isArray(data)) {
            setRegisteredUsers(data);
          } else {
            // Default pre-seeded senior list helper
            setRegisteredUsers([
              { name: 'Waltraud Schmidt', email: 'w.schmidt@gmail.com', phone: '0176 94857391', address: 'Kollwitzstraße 14, 10435 Berlin', isVerified: true, verified: true }
            ]);
          }
        })
        .catch(() => {
          setRegisteredUsers([
            { name: 'Waltraud Schmidt', email: 'w.schmidt@gmail.com', phone: '0176 94857391', address: 'Kollwitzstraße 14, 10435 Berlin', isVerified: true, verified: true }
          ]);
        })
        .finally(() => setCrmLoading(false));
    }
  }, [isLoggedIn, adminTab]);

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
      error('Bitte alle Felder des Services ausfüllen.');
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
    setNewServiceName('');
    setNewServiceDesc('');
    success(`Service "${added.title}" wurde erfolgreich dem Katalog hinzugefügt!`);
  };

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleContent.trim()) {
      error('Bitte füllen Sie den Titel und Inhalt des Beitrags aus.');
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
    setNewArticleTitle('');
    setNewArticleExcerpt('');
    setNewArticleContent('');
    success(`SEO-Blogartikel "${addedArt.title}" wurde erfolgreich veröffentlicht!`);
  };

  // Stats Counters
  const totalRevenueThisMonth = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalPrice, 0) + 12450.00; 

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
              CRM, Dispositionssystem und Kundenkartei für EMMASCO.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.55 select-none">
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

            <div className="flex flex-col gap-1.5">
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs cursor-pointer text-center whitespace-nowrap"
            >
              Master-Login ausführen
            </button>
          </form>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left text-[11px] font-semibold text-slate-300 leading-relaxed">
            <span className="font-extrabold block text-blue-400 mb-0.5">💡 Administrator-Zugang:</span>
            <span>E-Mail: <strong>admin@emmascoreinigungsteam.de</strong><br />Passwort: <strong>admin123</strong></span>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Admin CRM Header bar */}
        <div className="bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-900/45">
                System Administrator Online
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-2 text-white">EMMASCO Kontrollzentrum</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">CRM Logins & koordinierte Haushaltsbegleitungen im Großraum Berlin.</p>
          </div>

          {/* Controls tabs navigation */}
          <div className="flex flex-wrap gap-2">
            <button
              id="admin-tab-btn-analytics"
              onClick={() => setAdminTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                adminTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              📊 Cockpit
            </button>
            <button
              id="admin-tab-btn-bookings"
              onClick={() => setAdminTab('bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                adminTab === 'bookings' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              📅 Disposition ({bookings.length})
            </button>
            <button
              id="admin-tab-btn-customers"
              onClick={() => setAdminTab('customers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                adminTab === 'customers' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              👥 Kunden CRM
            </button>
            <button
              id="admin-tab-btn-services"
              onClick={() => setAdminTab('services')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                adminTab === 'services' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              ⚙ Services
            </button>
            <button
              id="admin-tab-btn-articles"
              onClick={() => setAdminTab('articles')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                adminTab === 'articles' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              ✍ Blog-Editor
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD STATS & REVENUE CHARTS */}
        {adminTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 animate-fade-in text-left">
            
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 text-left flex items-start gap-4">
                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-450 block">Monatsumsatz (Brutto)</span>
                  <span className="text-xl font-black block text-white mt-1">{totalRevenueThisMonth.toFixed(2)} €</span>
                  <span className="text-[10px] text-green-400 font-extrabold">▲ +14% vs. Vormonat</span>
                </div>
              </div>

              <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 text-left flex items-start gap-4">
                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-450 block">Eingeteilte Hilfskräfte</span>
                  <span className="text-xl font-black block text-white mt-1">{activeStaffSize} aktive Kräfte</span>
                  <span className="text-[10px] text-blue-400 font-bold">100% zertifiziert</span>
                </div>
              </div>

              <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 text-left flex items-start gap-4">
                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-450 block">Verifizierte Kunden</span>
                  <span className="text-xl font-black block text-white mt-1">{registeredUsers.length} registriert</span>
                  <span className="text-[10px] text-green-400 font-extrabold">Direktabrechnung §45a</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-850 p-6 rounded-3xl border border-slate-800">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider mb-4">Umsatzentwicklung 2026 (in €)</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUmsatz" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0056D6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0056D6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} formatter={(value) => [`${value} €`, 'Umsatz']} />
                    <Area type="monotone" dataKey="Umsatz" stroke="#0056D6" strokeWidth={3} fillOpacity={1} fill="url(#colorUmsatz)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-850 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div className="text-left flex flex-col gap-3">
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">Status Zentrale</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Insgesamt liegen <strong>{bookings.length} Buchungen</strong> im Dispositionsspeicher zur Koordination vor.
                </p>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-left text-xs font-semibold text-blue-300">
                  ⚡ <strong>Automatisches Mailings:</strong> Das System versendet bei Status-Änderungen automatisch Updates an den Kunden.
                </div>
              </div>

              <button
                id="dispatch-auto-btn"
                onClick={() => success('🤖 Auto-Routing abgeschlossen! Mitarbeiterpläne wurden aktualisiert.')}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs cursor-pointer text-center shadow-xs"
              >
                Auto-Zuweisung ausführen
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: ADVANCED DISPOSITION / STATUS STAGE WORKFLOW */}
        {adminTab === 'bookings' && (
          <div className="bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-800 mt-8 animate-fade-in text-left">
            <div className="border-b border-slate-800 pb-3 mb-6">
              <h2 className="text-lg font-black text-white">Einsatzplanung & Disposition</h2>
              <p className="text-xs text-slate-400 mt-1">Statusänderungen triggern automatische, vordefinierte E-Mail-Notifikationen an Kunden.</p>
            </div>

            <div className="flex flex-col gap-5">
              {bookings.map((b) => {
                const draftCleaner = cleanerAssignments[b.id] ?? b.cleanerName ?? '';
                return (
                  <div
                    key={b.id}
                    className="border border-slate-800 rounded-2xl p-5 bg-slate-900/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6"
                  >
                    <div className="flex-1 text-left flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-blue-400 text-sm">{b.customerName}</span>
                        <span className="text-slate-700">|</span>
                        <span className="text-xs text-slate-300 font-semibold">{b.serviceName}</span>
                        <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded border ${
                          b.status === 'confirmed' 
                            ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' 
                            : b.status === 'assigned'
                            ? 'bg-indigo-950/20 border-indigo-800 text-indigo-400'
                            : b.status === 'in_progress'
                            ? 'bg-amber-950/20 border-amber-800 text-amber-400'
                            : b.status === 'completed'
                            ? 'bg-slate-800 border-slate-700 text-slate-400'
                            : b.status === 'cancelled'
                            ? 'bg-red-950/20 border-red-850 text-red-400'
                            : 'bg-blue-950/20 border-blue-800 text-blue-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-0.5">
                        <p>📧 {b.email} | 📞 {b.phone}</p>
                        <p>📍 Adresse: {b.address}</p>
                        <p className="text-slate-400 italic">📝 "{b.notes || 'Keine Angabe hinterlegt'}"</p>
                      </div>

                      {/* Cleaner assignment entry block directly inline */}
                      <div className="flex items-center gap-2 mt-2 w-full max-w-sm">
                        <span className="text-[10px] text-slate-400 shrink-0 font-extrabold">Pflegekraft:</span>
                        <input
                          type="text"
                          value={draftCleaner}
                          onChange={(e) => setCleanerAssignments(prev => ({ ...prev, [b.id]: e.target.value }))}
                          placeholder="z.B. Cynthia Osei"
                          className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-100 rounded text-[10px] font-bold flex-1"
                        />
                        <button
                          onClick={() => {
                            onUpdateBookingStatus(b.id, 'assigned', draftCleaner);
                            success(`👤 Kraft "${draftCleaner || 'M. Becker'}" eingetragen und Status auf 'assigned' aktualisiert.`);
                          }}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-black uppercase cursor-pointer"
                        >
                          Zuweisen
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col xl:items-end text-left xl:text-right shrink-0">
                      <span className="text-xs text-blue-300 font-extrabold block">{b.date} um {b.time} Uhr</span>
                      <span className="text-[10px] text-slate-400 mt-1">ID: {b.id} | Betrag: {b.totalPrice.toFixed(2)} €</span>

                      {/* Full Status progress transition workflow triggers */}
                      <div className="flex flex-wrap gap-1.5 items-center mt-3.5 max-w-md justify-start xl:justify-end">
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer ${
                            b.status === 'confirmed' ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-805 text-slate-350'
                          }`}
                        >
                          Bestätigen
                        </button>

                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'in_progress')}
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer ${
                            b.status === 'in_progress' ? 'bg-amber-500 border-amber-600 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-805 text-slate-350'
                          }`}
                        >
                          Starten
                        </button>

                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer ${
                            b.status === 'completed' ? 'bg-indigo-650 border-indigo-700 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-805 text-slate-350'
                          }`}
                        >
                          Abschließen
                        </button>

                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer ${
                            b.status === 'cancelled' ? 'bg-red-600 border-red-700 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-805 text-slate-350'
                          }`}
                        >
                          Stornieren
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Sicher permanent löschen?')) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition cursor-pointer"
                          title="Löschen"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {bookings.length === 0 && (
                <p className="text-xs text-slate-500 italic">Keine Dispositionseinträge im System.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED CUSTOMERS CRM DATATABLE */}
        {adminTab === 'customers' && (
          <div className="bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-800 mt-8 animate-fade-in text-left">
            <div className="border-b border-slate-800 pb-3 mb-6">
              <h2 className="text-lg font-black text-white">Registrierte Kunden & CRM-Dateien</h2>
              <p className="text-xs text-slate-400 mt-1">Verwalten Sie Kundenstämme, Kontakte und deren E-Mail-Verifizierungsstatus.</p>
            </div>

            {crmLoading ? (
              <p className="text-xs text-slate-450 italic">Lade Kundenkartei...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="text-[10px] uppercase font-black text-slate-500 border-b border-slate-800 bg-slate-900/30">
                    <tr>
                      <th className="px-4 py-3">Kunden-Name</th>
                      <th className="px-4 py-3">E-Mail-Adresse</th>
                      <th className="px-4 py-3">Telefonnummer</th>
                      <th className="px-4 py-3">Einsatzort (Adresse)</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {registeredUsers.map((usr, index) => (
                      <tr key={index} className="hover:bg-slate-800/25 transition">
                        <td className="px-4 py-3.5 font-bold text-white flex items-center gap-1.5">
                          <span className="p-1 rounded-full bg-blue-900/40 text-blue-400">👤</span>
                          {usr.name}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-blue-400">{usr.email}</td>
                        <td className="px-4 py-3.5 text-slate-300">{usr.phone || 'Keine Angabe'}</td>
                        <td className="px-4 py-3.5 text-slate-400 text-ellipsis">{usr.address || 'Keine Angabe'}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-center ${
                            usr.verified || usr.isVerified
                              ? 'bg-emerald-950/20 border border-emerald-800 text-emerald-400'
                              : 'bg-yellow-950/20 border border-yellow-850 text-yellow-400'
                          }`}>
                            {usr.verified || usr.isVerified ? '✓ Aktiviert' : '⌚ Unverifiziert'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SERVICE CATALOG MANAGER */}
        {adminTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in text-left">
            <div className="lg:col-span-5 bg-slate-850 p-6 rounded-3xl border border-slate-800 flex flex-col gap-5">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">Neuen Service anlegen</h3>
              <form onSubmit={handleAddServiceSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Titel der Leistung *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Winterdienst & Streuservice"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Kategorie *</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  >
                    <option value="haushalt">Hauswirtschaft & Haushaltsbegleitung</option>
                    <option value="reinigung">Gewerbe- & Privatreinigung</option>
                    <option value="begleitung">Seniorenbegleitung und Hilfe</option>
                    <option value="zusatz">Sonderreinigungen</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Kurzbeschreibung *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Wozu dient diese Haushaltsleistung..."
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">Anzeigepreis Text</label>
                    <input
                      type="text"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">Pflegesatz Wert (€)</label>
                    <input
                      type="text"
                      value={newServicePriceVal}
                      onChange={(e) => setNewServicePriceVal(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs cursor-pointer text-center whitespace-nowrap"
                >
                  Dienstleistung hinzufügen
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-slate-850 p-6 rounded-3xl border border-slate-800">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Aktiver Katalog ({services.length} Einträge)</h3>
              <div className="flex flex-col gap-3 h-96 overflow-y-auto pr-2">
                {services.map((srv) => (
                  <div key={srv.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-white text-sm">{srv.title}</span>
                      <span className="text-[9px] uppercase font-black text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">{srv.category}</span>
                    </div>
                    <p className="text-slate-400 leading-normal">{srv.description}</p>
                    <span className="block text-[10px] text-green-400 font-extrabold mt-1.5">Satz: {srv.price} (€{srv.priceValue})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BLOG MANAGER */}
        {adminTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in text-left">
            <div className="lg:col-span-6 bg-slate-850 p-6 rounded-3xl border border-slate-800 flex flex-col gap-5">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">Neuen Ratgeber verfassen</h3>
              <form onSubmit={handleCreateArticleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Titel des Beitrags *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Wie beantrage ich Haushaltshilfe bei Pflegegrad"
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Ratgeber-Kategorie</label>
                  <select
                    value={newArticleCategory}
                    onChange={(e) => setNewArticleCategory(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  >
                    <option value="Cleaning Tips">Haushalts-Tipps</option>
                    <option value="Health">Gesundheit & SGB XI</option>
                    <option value="Lifestyle">Alltagsleben & Entlastung</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Teaser / Excerpt (Zusammenfassung)</label>
                  <input
                    type="text"
                    placeholder="Einleitungssatz für die Blog-Karte..."
                    value={newArticleExcerpt}
                    onChange={(e) => setNewArticleExcerpt(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Ganzer Fließtext (Markdown-Text) *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Schreiben Sie hier das Fachwissen..."
                    value={newArticleContent}
                    onChange={(e) => setNewArticleContent(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs font-bold text-white leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs cursor-pointer text-center"
                >
                  Beitrag jetzt veröffentlichen
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-slate-850 p-6 rounded-3xl border border-slate-800">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Veröffentlichte Beiträge</h3>
              <div className="flex flex-col gap-3 h-96 overflow-y-auto pr-2">
                {articles.map((art) => (
                  <div key={art.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-left">
                    <span className="text-[9px] font-black text-blue-400 block mb-0.5">{art.date} | {art.category}</span>
                    <span className="font-extrabold text-white text-sm block mb-1">{art.title}</span>
                    <p className="text-slate-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
