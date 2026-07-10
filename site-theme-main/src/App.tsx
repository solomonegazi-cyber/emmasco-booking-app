/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import BookingForm from './components/Booking';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import Blog from './components/Blog';
import Contact from './components/Contact';
import WhatsAppFloating from './components/WhatsAppFloating';
import DocumentPortal from './components/DocumentPortal';
import Imprint from './components/Imprint';
import PwaInstallBanner from './components/PwaInstallBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { sendBookingStatusNotification, requestNotificationPermission } from './utils/notificationService';

import { SERVICES, INITIAL_BOOKINGS, BLOG_ARTICLES } from './data';
import { Service, Booking, BlogArticle, UserDocument, ChatMessage } from './types';

export default function App() {
  const { language } = useLanguage();
  const [customerAuthMode, setCustomerAuthMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>(() => {
    const path = window.location.pathname;
    if (path === '/register') return 'register';
    if (path === '/forgot-password') return 'forgot';
    if (path === '/verify') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const historyEmail = window.history.state && (window.history.state as any).email;
      const storedEmail = localStorage.getItem("pendingVerificationEmail");
      if (!emailParam && !historyEmail && !storedEmail) {
        setTimeout(() => {
          window.history.replaceState({}, '', '/register');
        }, 0);
        return 'register';
      }
      return 'verify';
    }
    if (path === '/reset-password') return 'reset';
    return 'login';
  });

  const [currentPage, _setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/imprint') return 'imprint';
    if (path === '/admin') return 'admin-dashboard';
    if (path === '/documents') return 'documents';
    if (['/customer-dashboard', '/portal', '/login', '/register', '/forgot-password', '/verify', '/reset-password'].includes(path)) {
      return 'customer-dashboard';
    }
    return 'home';
  });

  const setCurrentPage = (page: string) => {
    if (page === 'imprint') {
      window.history.pushState({}, '', '/imprint');
    } else if (page === 'admin-dashboard') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'documents') {
      window.history.pushState({}, '', '/documents');
    } else if (page === 'customer-dashboard') {
      const targetPath = customerAuthMode === 'forgot' ? '/forgot-password' : customerAuthMode === 'reset' ? '/reset-password' : `/${customerAuthMode}`;
      window.history.pushState({}, '', targetPath);
    } else {
      window.history.pushState({}, '', '/');
    }
    _setCurrentPage(page);
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [customerActiveTab, setCustomerActiveTab] = useState<'bookings' | 'documents' | 'profile' | 'support'>('bookings');

  // Fetch bookings, listen to route routing
  React.useEffect(() => {
    // Path route listener for Admin and Imprint bypass
    const checkPath = () => {
      try {
        const path = window.location.pathname;
        console.log('[NAVIGATION] checkPath called. Pathname:', path, 'Search:', window.location.search);
        
        if (path === '/admin') {
          console.log('[NAVIGATION] Route matched: admin-dashboard');
          _setCurrentPage('admin-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (path === '/imprint') {
          console.log('[NAVIGATION] Route matched: imprint');
          _setCurrentPage('imprint');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (path === '/documents') {
          console.log('[NAVIGATION] Route matched: documents');
          _setCurrentPage('documents');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (['/customer-dashboard', '/portal', '/login', '/register', '/forgot-password', '/verify', '/reset-password'].includes(path)) {
          console.log('[NAVIGATION] Route matched customer portal path:', path);
          if (path === '/register') {
            console.log('[STATE UPDATE] setting customerAuthMode to: register');
            setCustomerAuthMode('register');
          } else if (path === '/forgot-password') {
            console.log('[STATE UPDATE] setting customerAuthMode to: forgot');
            setCustomerAuthMode('forgot');
          } else if (path === '/verify') {
            const params = new URLSearchParams(window.location.search);
            const emailParam = params.get('email');
            const historyEmail = window.history.state && (window.history.state as any).email;
            const storedEmail = localStorage.getItem("pendingVerificationEmail");
            console.log('[NAVIGATION] Verification route parameters:', { emailParam, historyEmail, storedEmail });
            
            if (!emailParam && !historyEmail && !storedEmail) {
              console.warn('[NAVIGATION] No email context found for /verify. Redirecting to /register');
              window.history.replaceState({}, '', '/register');
              console.log('[STATE UPDATE] setting customerAuthMode to: register (fallback)');
              setCustomerAuthMode('register');
            } else {
              console.log('[STATE UPDATE] setting customerAuthMode to: verify');
              setCustomerAuthMode('verify');
            }
          }
          else if (path === '/reset-password') {
            console.log('[STATE UPDATE] setting customerAuthMode to: reset');
            setCustomerAuthMode('reset');
          } else {
            console.log('[STATE UPDATE] setting customerAuthMode to: login');
            setCustomerAuthMode('login');
          }

          console.log('[STATE UPDATE] setting currentPage to: customer-dashboard');
          _setCurrentPage('customer-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          console.log('[NAVIGATION] Path did not match dashboard routes, setting currentPage to: home');
          _setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error('[Routing] Navigation error, retrying automatically...', err);
        setTimeout(() => {
          try {
            _setCurrentPage('customer-dashboard');
            setCustomerAuthMode('verify');
          } catch (retryErr) {
            console.error('[Routing] Critical routing recovery failed:', retryErr);
          }
        }, 150);
      }
    };

    // Proxy pushState and replaceState to trigger reactive route matching immediately without browser refresh
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const res = originalPushState.apply(this, args);
      checkPath();
      return res;
    };

    window.history.replaceState = function (...args) {
      const res = originalReplaceState.apply(this, args);
      checkPath();
      return res;
    };

    // If the path was already matched in initial state, we don't necessarily override unless they pop
    window.addEventListener('popstate', checkPath);

    const loadBookings = async () => {
      let serverBookings: Booking[] = [];
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            serverBookings = data;
          }
        }
      } catch (err) {
        console.error('[APP] Failed to fetch bookings from backend:', err);
      }

      try {
        const { getOfflineBookings } = await import('./utils/db');
        const offlineBookings = await getOfflineBookings();
        const merged = [
          ...offlineBookings,
          ...serverBookings.filter(sb => !offlineBookings.some(ob => ob.id === sb.id))
        ];
        setBookings(merged);
      } catch (dbErr) {
        console.error('[APP] Failed to load offline bookings:', dbErr);
        if (serverBookings.length > 0) {
          setBookings(serverBookings);
        }
      }
    };

    loadBookings();

    // Auto-poll bookings list every 8 seconds to fetch status updates (Assigned/Completed) from server
    const pollInterval = setInterval(() => {
      loadBookings();
    }, 8000);

    const handleSyncSuccess = (event: MessageEvent) => {
      if (event.data && event.data.type === 'BOOKING_SYNC_SUCCESS') {
        console.log('[APP] Service worker notified successful background sync, reloading bookings.');
        loadBookings();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSyncSuccess);
    }

    const handleOnline = () => {
      console.log('[APP] Online event detected, triggering sync trigger message to SW.');
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TRY_SYNC' });
      }
      setTimeout(loadBookings, 1500);
    };

    window.addEventListener('online', handleOnline);

    // Request notification permission on startup if not already granted/denied
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        requestNotificationPermission();
      }, 3000);
    }

    return () => {
      clearInterval(pollInterval);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('online', handleOnline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSyncSuccess);
      }
    };
  }, []);

  // Authentication State
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string; address: string } | null>(null);

  // Redirect unauthenticated users back to login if they try to access documents (Secure Workspace)
  React.useEffect(() => {
    if (currentPage === 'documents' && !isClientLoggedIn) {
      setCurrentPage('customer-dashboard');
    }
  }, [currentPage, isClientLoggedIn]);

  // General App State (React memory persistence syncing across components)
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS as Booking[]);

  // Track the previous state of bookings to detect status transitions
  const prevBookingsRef = React.useRef<Booking[]>([]);

  React.useEffect(() => {
    // If the ref is uninitialized, seed it with the current bookings list and return.
    // This prevents triggering push notifications for already 'assigned' or 'completed' bookings on startup.
    if (prevBookingsRef.current.length === 0) {
      prevBookingsRef.current = bookings;
      return;
    }

    bookings.forEach((curr) => {
      const prev = prevBookingsRef.current.find((b) => b.id === curr.id);
      if (prev && prev.status !== curr.status) {
        if (curr.status === 'assigned' || curr.status === 'completed') {
          console.log(`[Notification Engine] Booking ${curr.id} status transitioned from "${prev.status}" to "${curr.status}". Triggering push notification.`);
          sendBookingStatusNotification(curr.serviceName, curr.status, curr.cleanerName, language);
        }
      }
    });

    prevBookingsRef.current = bookings;
  }, [bookings, language]);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES);
  
  // Document tracker (pre-populated with some documents for the demo user w.schmidt@gmail.com)
  const [documents, setDocuments] = useState<UserDocument[]>([
    {
      id: 'DOC-582',
      name: 'Pflegegradeinstufung_Klaus_Schmidt.pdf',
      size: '1.4 MB',
      type: 'PDF-Dokument',
      uploadDate: '12. Mai 2026',
      status: 'approved'
    },
    {
      id: 'DOC-910',
      name: 'Haushaltshilfe_Verordnung_Krankenkasse.pdf',
      size: '2.1 MB',
      type: 'PDF-Dokument',
      uploadDate: '01. Juni 2026',
      status: 'approved'
    }
  ]);

  // Support messages pre-populated for demo user
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      text: 'Guten Tag, Frau Schmidt! Das Emmasco Serviceteam begrüsst Sie in unserem neuen Kundenportal. Wie können wir Ihnen heute im Haushalt beistehen?',
      sender: 'support',
      timestamp: '08:30'
    }
  ]);

  // Handle Client logins
  const handleClientLogin = (email: string, name: string) => {
    setIsClientLoggedIn(true);
    setIsAdminLoggedIn(false);
    
    // Default phone/address if it is our test card user
    const finalPhone = email.includes('schmidt') ? '0176 94857391' : '0152 1234567';
    const finalAddr = email.includes('schmidt') ? 'Kollwitzstraße 14, 10435 Berlin' : 'Prenzlauer Allee, Berlin';
    
    setCurrentUser({
      name,
      email,
      phone: finalPhone,
      address: finalAddr
    });

    // Navigate immediately to the Secure Workspace (Document Portal) after login
    setCurrentPage('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Admin Logins
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setIsClientLoggedIn(false);
    setCurrentUser({
      name: 'Administrator Operator',
      email: 'admin@emmascoreinigungsteam.de',
      phone: '017621856044',
      address: 'Schönhauser Allee 163, Berlin'
    });

    setCurrentPage('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle general logs out
  const handleLogout = () => {
    setIsClientLoggedIn(false);
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manage Bookings State Actions
  const handleBookingSubmit = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = async (
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled',
    cleanerName?: string
  ) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cleanerName })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.booking) {
          setBookings(prev => prev.map(bk => bk.id === bookingId ? { ...bk, ...result.booking } : bk));
          return;
        }
      }
    } catch (e) {
      console.error('[App] Failed status sync on server:', e);
    }
    // Fallback updating state
    setBookings(prev => prev.map(bk => bk.id === bookingId ? { ...bk, status, cleanerName: cleanerName ?? bk.cleanerName } : bk));
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBookings(prev => prev.filter(bk => bk.id !== bookingId));
      }
    } catch (e) {
      console.error('[App] Failed to delete on server:', e);
      setBookings(prev => prev.filter(bk => bk.id !== bookingId));
    }
  };

  // Manage Services State Actions
  const handleAddService = (newService: Service) => {
    setServices(prev => [...prev, newService]);
  };

  // Manage Blog Articles Actions
  const handleAddArticle = (newArticle: BlogArticle) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  // Chat message support handler
  const handleAddChatMessage = (newMsg: ChatMessage) => {
    setChatMessages(prev => [...prev, newMsg]);
  };

  // Document uploads list tracker
  const handleUploadDocument = (newDoc: UserDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  // Profile data updating
  const handleUpdateProfile = (name: string, phone: string, address: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name,
        phone,
        address
      });
    }
  };

  // Quick Action: Book particular service direct routing
  const handleSelectServiceAndBook = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F6FAFF] flex flex-col font-sans antialiased text-gray-800">
      
      {/* Sticky Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        customerActiveTab={customerActiveTab}
        setCustomerActiveTab={setCustomerActiveTab}
        onOpenBooking={() => {
          setSelectedServiceId(null);
          setCurrentPage('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isLoggedIn={isClientLoggedIn || isAdminLoggedIn}
        isAdmin={isAdminLoggedIn}
        onLogout={handleLogout}
        userEmail={currentUser?.email}
      />

      {/* Main Pages Content Views */}
      <main className="flex-1 overflow-x-hidden">
        <React.Suspense fallback={
          <div className="min-h-[400px] flex items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm m-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        }>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <ErrorBoundary>
                {currentPage === 'home' && (
                  <Home
                    setCurrentPage={setCurrentPage}
                    onOpenBooking={() => {
                      setSelectedServiceId(null);
                      setCurrentPage('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSelectService={(serviceId) => {
                      setSelectedServiceId(serviceId);
                    }}
                  />
                )}

                {currentPage === 'about' && <About />}

                {currentPage === 'services' && (
                  <Services
                    onSelectServiceAndBook={handleSelectServiceAndBook}
                    preselectedServiceId={selectedServiceId}
                    clearPreselection={() => setSelectedServiceId(null)}
                  />
                )}

                {currentPage === 'booking' && (
                  <BookingForm
                    selectedServiceId={selectedServiceId}
                    onBookingSubmit={handleBookingSubmit}
                    isLoggedIn={isClientLoggedIn}
                    currentUser={currentUser}
                  />
                )}

                {currentPage === 'customer-dashboard' && (
                  <CustomerDashboard
                    bookings={bookings}
                    isLoggedIn={isClientLoggedIn}
                    onLogin={handleClientLogin}
                    onUpdateBookingStatus={(id, status) => handleUpdateBookingStatus(id, status as any)}
                    onAddMessage={handleAddChatMessage}
                    chatMessages={chatMessages}
                    onUploadDocument={handleUploadDocument}
                    documents={documents}
                    onUpdateProfile={handleUpdateProfile}
                    currentUser={currentUser}
                    activeTab={customerActiveTab}
                    onTabChange={setCustomerActiveTab}
                    initialAuthMode={customerAuthMode}
                    onAuthModeChange={(mode) => {
                      setCustomerAuthMode(mode);
                      const targetPath = mode === 'forgot' ? '/forgot-password' : mode === 'reset' ? '/reset-password' : `/${mode}`;
                      if (window.location.pathname !== targetPath) {
                        window.history.pushState({}, '', targetPath);
                      }
                    }}
                    onNavigateToBooking={(serviceId) => {
                      if (serviceId) {
                        setSelectedServiceId(serviceId);
                      }
                      setCurrentPage('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {currentPage === 'admin-dashboard' && (
                  <AdminDashboard
                    bookings={bookings}
                    services={services}
                    articles={articles}
                    isLoggedIn={isAdminLoggedIn}
                    onLogin={handleAdminLogin}
                    onAddService={handleAddService}
                    onAddArticle={handleAddArticle}
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    onDeleteBooking={handleDeleteBooking}
                  />
                )}

                {currentPage === 'blog' && <Blog articles={articles} />}

                {currentPage === 'contact' && <Contact />}

                {currentPage === 'imprint' && <Imprint />}

                {currentPage === 'documents' && (
                  <DocumentPortal
                    language={language}
                    currentUserEmail={currentUser?.email || null}
                    currentUserName={currentUser?.name || null}
                    onLoginRequest={(email, name) => {
                      setIsClientLoggedIn(true);
                      const isSolomon = email.toLowerCase() === 'solomonegazi@gmail.com';
                      setCurrentUser({
                        name,
                        email,
                        phone: isSolomon ? '0176 12345678' : '0176 87654321',
                        address: isSolomon ? 'Hauptstraße 15, Berlin' : 'Zweite Allee 4, Berlin'
                  });
                    }}
                    onLogoutRequest={handleLogout}
                  />
                )}

                {/* Fallback route block to prevent any blank white screen */}
                {!['home', 'about', 'services', 'booking', 'customer-dashboard', 'admin-dashboard', 'blog', 'contact', 'imprint', 'documents'].includes(currentPage) && (
                  <CustomerDashboard
                    bookings={bookings}
                    isLoggedIn={isClientLoggedIn}
                    onLogin={handleClientLogin}
                    onUpdateBookingStatus={(id, status) => handleUpdateBookingStatus(id, status as any)}
                    onAddMessage={handleAddChatMessage}
                    chatMessages={chatMessages}
                    onUploadDocument={handleUploadDocument}
                    documents={documents}
                    onUpdateProfile={handleUpdateProfile}
                    currentUser={currentUser}
                    activeTab={customerActiveTab}
                    onTabChange={setCustomerActiveTab}
                    initialAuthMode={customerAuthMode}
                    onAuthModeChange={(mode) => {
                      setCustomerAuthMode(mode);
                      const targetPath = mode === 'forgot' ? '/forgot-password' : mode === 'reset' ? '/reset-password' : `/${mode}`;
                      if (window.location.pathname !== targetPath) {
                        window.history.pushState({}, '', targetPath);
                      }
                    }}
                  />
                )}
              </ErrorBoundary>
            </motion.div>
        </AnimatePresence>
        </React.Suspense>
      </main>

      {/* Global Bottom Multi-column Footer */}
      <Footer 
        setCurrentPage={setCurrentPage} 
        onOpenBooking={() => {
          setSelectedServiceId(null);
          setCurrentPage('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Quick-Inquiry Button */}
      <WhatsAppFloating 
        currentUser={currentUser} 
        selectedServiceId={selectedServiceId} 
      />

      {/* Elegant PWA Install Banner */}
      <PwaInstallBanner />

    </div>
  );
}
