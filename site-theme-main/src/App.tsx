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

import { SERVICES, INITIAL_BOOKINGS, BLOG_ARTICLES } from './data';
import { Service, Booking, BlogArticle, UserDocument, ChatMessage } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Authentication State
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string; address: string } | null>(null);

  // General App State (React memory persistence syncing across components)
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
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

    // Navigate to dashboard
    setCurrentPage('customer-dashboard');
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

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(bk => bk.id === bookingId ? { ...bk, status } : bk));
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(bk => bk.id !== bookingId));
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
      <main className="flex-1">
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

    </div>
  );
}
