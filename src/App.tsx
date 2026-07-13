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
import StaffDashboard from './components/StaffDashboard';
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

  // Authentication State with local session persistence
  const [isClientLoggedIn, setIsClientLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isClientLoggedIn') === 'true';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isStaffLoggedIn') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string; address: string } | null>(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

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

  const [customerActiveTab, setCustomerActiveTab] = useState<'bookings' | 'documents' | 'profile' | 'support'>(() => {
    const path = window.location.pathname;
    if (path === '/my-bookings' || path === '/bookings') return 'bookings';
    if (path === '/my-documents') return 'documents';
    if (path === '/account-settings' || path === '/profile') return 'profile';
    return 'bookings';
  });

  const [currentPage, _setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/imprint') return 'imprint';
    if (path === '/admin') return 'admin-dashboard';
    if (path === '/staff') return 'staff-dashboard';
    if (path === '/documents') return 'documents';
    if (['/customer-dashboard', '/portal', '/bookings', '/my-bookings', '/my-documents', '/account-settings', '/profile', '/login', '/register', '/forgot-password', '/verify', '/reset-password'].includes(path)) {
      return 'customer-dashboard';
    }
    return 'home';
  });

  // Safe navigation handler which synchronizes the URL pathname
  const setCurrentPage = (page: string) => {
    const loggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
    const staffLoggedIn = localStorage.getItem('isStaffLoggedIn') === 'true';

    if (page === 'imprint') {
      window.history.pushState({}, '', '/imprint');
    } else if (page === 'admin-dashboard') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'staff-dashboard') {
      window.history.pushState({}, '', '/staff');
    } else if (page === 'documents') {
      window.history.pushState({}, '', '/documents');
    } else if (page === 'customer-dashboard') {
      if (loggedIn) {
        let targetPath = '/portal';
        if (customerActiveTab === 'bookings') targetPath = '/my-bookings';
        else if (customerActiveTab === 'documents') targetPath = '/my-documents';
        else if (customerActiveTab === 'profile') targetPath = '/account-settings';
        window.history.pushState({}, '', targetPath);
      } else if (staffLoggedIn) {
        window.history.pushState({}, '', '/staff');
        _setCurrentPage('staff-dashboard');
        return;
      } else {
        const targetPath = customerAuthMode === 'forgot' ? '/forgot-password' : customerAuthMode === 'reset' ? '/reset-password' : `/${customerAuthMode}`;
        window.history.pushState({}, '', targetPath);
      }
    } else {
      window.history.pushState({}, '', '/');
    }
    _setCurrentPage(page);
  };

  // Safe customer active tab change handler which synchronizes URL pathname immediately
  const handleCustomerTabChange = (tab: 'bookings' | 'documents' | 'profile' | 'support') => {
    setCustomerActiveTab(tab);
    const loggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
    if (loggedIn) {
      let targetPath = '/portal';
      if (tab === 'bookings') targetPath = '/my-bookings';
      else if (tab === 'documents') targetPath = '/my-documents';
      else if (tab === 'profile') targetPath = '/account-settings';
      window.history.pushState({}, '', targetPath);
    }
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Fetch bookings, listen to route routing
  React.useEffect(() => {
    // Path route listener for reactive routing and auth guards
    const checkPath = () => {
      try {
        const path = window.location.pathname;
        console.log('[NAVIGATION] checkPath called. Pathname:', path, 'Search:', window.location.search);
        
        const loggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
        const staffLoggedIn = localStorage.getItem('isStaffLoggedIn') === 'true';
        const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

        // 1. Admin dashboard
        if (path === '/admin') {
          console.log('[NAVIGATION] Route matched: admin-dashboard');
          if (!adminLoggedIn) {
            window.history.replaceState({}, '', '/login');
            setCustomerAuthMode('login');
            _setCurrentPage('customer-dashboard');
          } else {
            _setCurrentPage('admin-dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 1b. Staff dashboard
        if (path === '/staff') {
          console.log('[NAVIGATION] Route matched: staff-dashboard');
          if (!staffLoggedIn) {
            window.history.replaceState({}, '', '/login');
            setCustomerAuthMode('login');
            _setCurrentPage('customer-dashboard');
          } else {
            _setCurrentPage('staff-dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        // 2. Imprint
        if (path === '/imprint') {
          console.log('[NAVIGATION] Route matched: imprint');
          _setCurrentPage('imprint');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 3. Document Workspace (Secure Document Portal)
        if (path === '/documents') {
          console.log('[NAVIGATION] Route matched: documents');
          if (!loggedIn) {
            console.log('[NAVIGATION] Unauthenticated user trying to access /documents. Redirecting to /login');
            window.history.replaceState({}, '', '/login');
            setCustomerAuthMode('login');
            _setCurrentPage('customer-dashboard');
          } else {
            _setCurrentPage('documents');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 4. Protected client portal tabs/pages
        const isClientPortalPath = ['/customer-dashboard', '/portal', '/bookings', '/my-bookings', '/my-documents', '/account-settings', '/profile'].includes(path);
        if (isClientPortalPath) {
          if (!loggedIn) {
            console.log('[NAVIGATION] Unauthenticated user trying to access protected client portal route. Redirecting to /login');
            window.history.replaceState({}, '', '/login');
            setCustomerAuthMode('login');
            _setCurrentPage('customer-dashboard');
          } else {
            if (path === '/bookings' || path === '/my-bookings') {
              setCustomerActiveTab('bookings');
            } else if (path === '/my-documents') {
              setCustomerActiveTab('documents');
            } else if (path === '/account-settings' || path === '/profile') {
              setCustomerActiveTab('profile');
            }
            _setCurrentPage('customer-dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 5. Auth / Guest routes
        const isAuthPath = ['/login', '/register', '/forgot-password', '/verify', '/reset-password'].includes(path);
        if (isAuthPath) {
          if (loggedIn) {
            console.log('[NAVIGATION] Authenticated user trying to access auth path. Redirecting to /portal');
            window.history.replaceState({}, '', '/portal');
            _setCurrentPage('customer-dashboard');
          } else if (staffLoggedIn) {
            console.log('[NAVIGATION] Authenticated staff. Redirecting to /staff');
            window.history.replaceState({}, '', '/staff');
            _setCurrentPage('staff-dashboard');
          } else if (adminLoggedIn) {
            console.log('[NAVIGATION] Authenticated admin. Redirecting to /admin');
            window.history.replaceState({}, '', '/admin');
            _setCurrentPage('admin-dashboard');
          } else {
            if (path === '/register') {
              setCustomerAuthMode('register');
            } else if (path === '/forgot-password') {
              setCustomerAuthMode('forgot');
            } else if (path === '/verify') {
              const params = new URLSearchParams(window.location.search);
              const emailParam = params.get('email');
              const historyEmail = window.history.state && (window.history.state as any).email;
              const storedEmail = localStorage.getItem("pendingVerificationEmail");
              
              if (!emailParam && !historyEmail && !storedEmail) {
                window.history.replaceState({}, '', '/register');
                setCustomerAuthMode('register');
              } else {
                setCustomerAuthMode('verify');
              }
            } else if (path === '/reset-password') {
              setCustomerAuthMode('reset');
            } else {
              setCustomerAuthMode('login');
            }
            _setCurrentPage('customer-dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 6. Public static routes
        if (path === '/about') {
          _setCurrentPage('about');
        } else if (path === '/services') {
          _setCurrentPage('services');
        } else if (path === '/booking') {
          _setCurrentPage('booking');
        } else if (path === '/blog') {
          _setCurrentPage('blog');
        } else if (path === '/contact') {
          _setCurrentPage('contact');
        } else if (path === '/' || path === '/home') {
          _setCurrentPage('home');
        } else {
          console.log('[NAVIGATION] Path did not match any routing rule, defaulting to home. Path:', path);
          _setCurrentPage('home');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('[Routing] Navigation error:', err);
        _setCurrentPage('home');
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

  // Redirect unauthenticated users is now fully handled inside checkPath. Our main state declarations have been moved to the top of the component.

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

  // Handle Client logins with role detection & redirection
  const handleClientLogin = (email: string, name: string, role?: string) => {
    // If no role is passed, let's detect it or default to customer
    const detectedRole = role || (email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('cleaner') || email.toLowerCase().includes('staff') ? 'staff' : 'customer');

    const finalPhone = email.includes('schmidt') ? '0176 94857391' : '0152 1234567';
    const finalAddr = email.includes('schmidt') ? 'Kollwitzstraße 14, 10435 Berlin' : 'Prenzlauer Allee, Berlin';
    
    const userObj = {
      name,
      email,
      phone: finalPhone,
      address: finalAddr,
      role: detectedRole
    };

    setCurrentUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));

    if (detectedRole === 'admin') {
      setIsAdminLoggedIn(true);
      setIsClientLoggedIn(false);
      setIsStaffLoggedIn(false);
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('isClientLoggedIn', 'false');
      localStorage.setItem('isStaffLoggedIn', 'false');
      
      _setCurrentPage('admin-dashboard');
      window.history.pushState({}, '', '/admin');
    } else if (detectedRole === 'staff') {
      setIsAdminLoggedIn(false);
      setIsClientLoggedIn(false);
      setIsStaffLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'false');
      localStorage.setItem('isClientLoggedIn', 'false');
      localStorage.setItem('isStaffLoggedIn', 'true');
      
      _setCurrentPage('staff-dashboard');
      window.history.pushState({}, '', '/staff');
    } else {
      setIsAdminLoggedIn(false);
      setIsClientLoggedIn(true);
      setIsStaffLoggedIn(false);
      localStorage.setItem('isAdminLoggedIn', 'false');
      localStorage.setItem('isClientLoggedIn', 'true');
      localStorage.setItem('isStaffLoggedIn', 'false');
      
      setCustomerActiveTab('bookings');
      _setCurrentPage('customer-dashboard');
      window.history.pushState({}, '', '/my-bookings');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Admin Logins (e.g. from static demo bypass buttons)
  const handleAdminLogin = () => {
    handleClientLogin('admin@emmascoreinigungsteam.de', 'Administrator Operator', 'admin');
  };

  // Handle general logs out
  const handleLogout = () => {
    setIsClientLoggedIn(false);
    setIsAdminLoggedIn(false);
    setIsStaffLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isClientLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('isStaffLoggedIn');
    localStorage.removeItem('currentUser');
    _setCurrentPage('home');
    window.history.pushState({}, '', '/');
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
        setCustomerActiveTab={handleCustomerTabChange}
        onOpenBooking={() => {
          setSelectedServiceId(null);
          setCurrentPage('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isLoggedIn={isClientLoggedIn || isAdminLoggedIn || isStaffLoggedIn}
        isAdmin={isAdminLoggedIn}
        isStaff={isStaffLoggedIn}
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
                    onTabChange={handleCustomerTabChange}
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

                {currentPage === 'staff-dashboard' && (
                  <StaffDashboard
                    userEmail={currentUser?.email || 'cleaner@emmascoreinigungsteam.de'}
                    userName={currentUser?.name || 'Mitarbeiter'}
                    onLogout={handleLogout}
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
                      const userObj = {
                        name,
                        email,
                        phone: isSolomon ? '0176 12345678' : '0176 87654321',
                        address: isSolomon ? 'Hauptstraße 15, Berlin' : 'Zweite Allee 4, Berlin'
                      };
                      setCurrentUser(userObj);
                      localStorage.setItem('isClientLoggedIn', 'true');
                      localStorage.setItem('isAdminLoggedIn', 'false');
                      localStorage.setItem('currentUser', JSON.stringify(userObj));
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
                    onTabChange={handleCustomerTabChange}
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
