/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Phone, MapPin, Heart, ShieldAlert, User, Lock, Globe, Sun, Moon,
  ChevronDown, LayoutDashboard, FolderOpen, Calendar, FileText, Settings, LogOut
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  customerActiveTab?: 'bookings' | 'documents' | 'profile' | 'support';
  setCustomerActiveTab?: (tab: 'bookings' | 'documents' | 'profile' | 'support') => void;
  onOpenBooking: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  userEmail?: string;
}

export default function Header({
  currentPage,
  setCurrentPage,
  customerActiveTab,
  setCustomerActiveTab,
  onOpenBooking,
  isLoggedIn,
  isAdmin,
  onLogout,
  userEmail
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileClientMenuOpen, setMobileClientMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Load theme preference from localStorage or system scheme
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep dark class in sync with isDark state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'blog', label: t('nav.blog') },
    { id: 'contact', label: t('nav.contact') },
    { id: 'imprint', label: t('nav.imprint') }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDropdownItemClick = (actionType: 'portal' | 'workspace' | 'bookings' | 'documents' | 'profile' | 'logout') => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    if (actionType === 'logout') {
      onLogout();
      return;
    }

    if (!isLoggedIn) {
      // If user is not authenticated: redirect to login page (customer-dashboard)
      setCurrentPage('customer-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Authenticated flow
    if (actionType === 'workspace') {
      setCurrentPage('documents');
    } else if (actionType === 'portal' || actionType === 'bookings') {
      if (setCustomerActiveTab) setCustomerActiveTab('bookings');
      setCurrentPage('customer-dashboard');
    } else if (actionType === 'documents') {
      if (setCustomerActiveTab) setCustomerActiveTab('documents');
      setCurrentPage('customer-dashboard');
    } else if (actionType === 'profile') {
      if (setCustomerActiveTab) setCustomerActiveTab('profile');
      setCurrentPage('customer-dashboard');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isClientLoginActive = currentPage === 'customer-dashboard' || currentPage === 'documents';

  return (
    <header className="w-full z-50 sticky top-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,86,214,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-b border-blue-50/50 dark:border-slate-800/70 transition-colors duration-300">
      {/* Top bar */}
      <div className="bg-[#0056D6] dark:bg-slate-950 text-white text-[11px] pt-[calc(8px+env(safe-area-inset-top,0px))] pb-2 px-4 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-blue-200" />
              <a href="tel:017621856044" className="hover:underline font-bold text-white">0176 21856044</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-blue-100 dark:text-slate-300 font-medium font-semibold">
              <MapPin className="w-3.5 h-3.5 text-blue-200" />
              {t('topbar.address')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#0056D6]/30 dark:bg-slate-800/65 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20 dark:border-slate-700/80">
              <Heart className="w-3 h-3 text-red-300 fill-current" />
              {t('topbar.accreditation')}
            </span>
            <span className="bg-emerald-600/30 text-emerald-100 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
              {t('topbar.insured')}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center transition-all duration-300">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center select-none text-left cursor-pointer transition transform hover:opacity-95"
            id="header-logo-btn"
          >
            <img 
              src="https://emmascoreinigungsteam.de/wp-content/uploads/2026/06/cropped-emmascoreinigungsteam-logo-200x89.png" 
              alt="ERT EMMASCO REINIGUNGSTEAM Logo" 
              className="h-[42px] md:h-[56px] w-auto object-contain bg-transparent"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50/80 font-bold dark:text-blue-400 dark:bg-slate-800'
                    : 'text-gray-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action buttons + Language Swapper */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Desktop Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-inner mr-1.5 select-none">
              <button
                id="lang-toggle-de"
                onClick={() => setLanguage('de')}
                className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full transition-all duration-150 cursor-pointer ${
                  language === 'de'
                    ? 'bg-[#0056D6] text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Schnittstelle auf Deutsch umstellen"
              >
                DE
              </button>
              <button
                id="lang-toggle-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full transition-all duration-150 cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#0056D6] text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Switch interface to English"
              >
                EN
              </button>
            </div>

            {/* Desktop Theme Switcher */}
            <button
              id="theme-mode-toggle-desktop"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full transition-all duration-200 cursor-pointer mr-1.5 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-inner select-none text-slate-700 dark:text-amber-400"
              title={isDark ? "Light-Modus aktivieren" : "Dark-Modus aktivieren"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 fill-current" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:text-indigo-600" />
              )}
            </button>

            {isAdmin && (
              <button
                id="admin-dashboard-btn"
                onClick={() => handleNavClick('admin-dashboard')}
                className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-slate-700 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer mr-2 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t('nav.admin_portal')}
              </button>
            )}

            {/* Client Login Dropdown */}
            <div className="relative">
              <button
                id="nav-client-login-dropdown"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isClientLoginActive
                    ? 'text-blue-600 bg-blue-50/80 font-bold dark:text-blue-400 dark:bg-slate-800'
                    : 'text-gray-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-blue-500" />
                <span>{isLoggedIn ? (userEmail ? `${userEmail.split('@')[0]}` : t('nav.login_client')) : t('nav.login_client')}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10 cursor-default" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-25">
                    <div className="px-4 pb-2 mb-2 border-b border-gray-100 dark:border-slate-800/60 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-left">
                      {isLoggedIn ? (userEmail || 'Client Account') : t('nav.login_client')}
                    </div>
                    
                    <button
                      onClick={() => handleDropdownItemClick('portal')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                        currentPage === 'customer-dashboard' && customerActiveTab === 'bookings'
                          ? 'text-blue-600 bg-blue-50/40 dark:text-blue-400 dark:bg-slate-800/60 font-bold'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-500" />
                      <span>{language === 'de' ? 'Kundenportal' : 'Customer Portal'}</span>
                    </button>

                    {isLoggedIn && (
                      <button
                        onClick={() => handleDropdownItemClick('workspace')}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                          currentPage === 'documents'
                            ? 'text-blue-600 bg-blue-50/40 dark:text-blue-400 dark:bg-slate-800/60 font-bold'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <FolderOpen className="w-4 h-4 shrink-0 text-blue-500 animate-pulse" />
                        <span>{language === 'de' ? 'Workspace (Dokumentencenter)' : 'Workspace (Document Portal)'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDropdownItemClick('bookings')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                        currentPage === 'customer-dashboard' && customerActiveTab === 'bookings'
                          ? 'text-blue-600 bg-blue-50/45 dark:text-blue-400'
                          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/45 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                      <span>{language === 'de' ? 'Meine Buchungen' : 'My Bookings'}</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('documents')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                        currentPage === 'customer-dashboard' && customerActiveTab === 'documents'
                          ? 'text-blue-600 bg-blue-50/40 dark:text-blue-400 dark:bg-slate-800/60 font-bold'
                          : 'text-gray-605 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                      <span>{language === 'de' ? 'Meine Dokumente' : 'My Documents'}</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('profile')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                        currentPage === 'customer-dashboard' && customerActiveTab === 'profile'
                          ? 'text-blue-600 bg-blue-50/40 dark:text-blue-400 dark:bg-slate-800/60'
                          : 'text-gray-605 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Settings className="w-4 h-4 shrink-0 text-gray-400" />
                      <span>{language === 'de' ? 'Kontoeinstellungen' : 'Account Settings'}</span>
                    </button>

                    {isLoggedIn && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                        <button
                          onClick={() => handleDropdownItemClick('logout')}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/20 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              id="header-booking-cta"
              onClick={onOpenBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer"
            >
              {t('nav.book')}
            </button>
          </div>

          {/* Mobile menu button and mini language & theme switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Theme Toggle */}
            <button
              id="theme-mode-toggle-mobile"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 fill-current" />
              ) : (
                <Moon className="w-4 h-4 text-slate-650" />
              )}
            </button>

            {/* Round inline language toggle for mobile heading bar */}
            <button
              id="mobile-quick-lang-toggle"
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-[11px] font-extrabold cursor-pointer"
              title={language === 'de' ? "Switch to English" : "Auf Deutsch umstellen"}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              id="header-booking-cta-mobile"
              onClick={onOpenBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-full cursor-pointer"
            >
              {t('nav.book_short')}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-850 focus:outline-none cursor-pointer"
              aria-label={t('nav.menu_label')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-blue-50 dark:border-slate-800/80 animate-fade-in py-4 px-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50/80 dark:text-blue-400 dark:bg-slate-800/80'
                    : 'text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-805/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Drawer Language Selection Tray */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 my-2 flex items-center justify-between text-left">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                Sprache / Language
              </span>
              <div className="flex gap-1.5 bg-white dark:bg-slate-905 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  id="mobile-lang-tray-de"
                  onClick={() => setLanguage('de')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                    language === 'de'
                      ? 'bg-[#0056D6] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  DE
                </button>
                <button
                  id="mobile-lang-tray-en"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                    language === 'en'
                      ? 'bg-[#0056D6] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile collapsible Client Login Subsection */}
            <div className="border-t border-gray-150 dark:border-slate-800 my-2 pt-2">
              <button
                id="mobile-nav-client-login-expander"
                onClick={() => setMobileClientMenuOpen(!mobileClientMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer ${
                  isClientLoginActive
                    ? 'text-[#0056D6] bg-blue-50/50 dark:text-blue-400 dark:bg-slate-800/50'
                    : 'text-gray-750 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-805/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#0056D6] dark:text-blue-400 shrink-0" />
                  <span>{isLoggedIn ? (userEmail ? `${userEmail.split('@')[0]}` : t('nav.login_client')) : t('nav.login_client')}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileClientMenuOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </button>

              {mobileClientMenuOpen && (
                <div className="pl-4 mt-1 flex flex-col gap-1 border-l-2 border-blue-100/60 ml-6 animate-fade-in text-left">
                  <button
                    id="mobile-sub-portal"
                    onClick={() => handleDropdownItemClick('portal')}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2.5 rounded-lg ${
                      currentPage === 'customer-dashboard' && customerActiveTab === 'bookings'
                        ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-slate-800/60'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-500" />
                    <span>{language === 'de' ? 'Kundenportal' : 'Customer Portal'}</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      id="mobile-sub-workspace"
                      onClick={() => handleDropdownItemClick('workspace')}
                      className={`w-full text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2.5 rounded-lg ${
                        currentPage === 'documents'
                          ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-slate-800/60'
                          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4 shrink-0 text-blue-500" />
                      <span>{language === 'de' ? 'Workspace (Dokumentencenter)' : 'Workspace (Document Portal)'}</span>
                    </button>
                  )}

                  <button
                    id="mobile-sub-bookings"
                    onClick={() => handleDropdownItemClick('bookings')}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2.5 rounded-lg ${
                      currentPage === 'customer-dashboard' && customerActiveTab === 'bookings'
                        ? 'text-blue-600 bg-blue-50/50 dark:text-blue-300'
                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                    <span>{language === 'de' ? 'Meine Buchungen' : 'My Bookings'}</span>
                  </button>

                  <button
                    id="mobile-sub-documents"
                    onClick={() => handleDropdownItemClick('documents')}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2.5 rounded-lg ${
                      currentPage === 'customer-dashboard' && customerActiveTab === 'documents'
                        ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-slate-800/60 font-bold'
                        : 'text-gray-650 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                    <span>{language === 'de' ? 'Meine Dokumente' : 'My Documents'}</span>
                  </button>

                  <button
                    id="mobile-sub-profile"
                    onClick={() => handleDropdownItemClick('profile')}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2.5 rounded-lg ${
                      currentPage === 'customer-dashboard' && customerActiveTab === 'profile'
                        ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-slate-800/60'
                        : 'text-gray-655 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0 text-gray-400" />
                    <span>{language === 'de' ? 'Kontoeinstellungen' : 'Account Settings'}</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      id="mobile-sub-logout"
                      onClick={() => handleDropdownItemClick('logout')}
                      className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  )}
                </div>
              )}

              {isAdmin && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <button
                    id="mobile-admin-dashboard-btn"
                    onClick={() => handleNavClick('admin-dashboard')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-700 dark:text-red-400 bg-red-50 dark:bg-slate-800/80 font-bold cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                    {t('nav.admin_portal')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
