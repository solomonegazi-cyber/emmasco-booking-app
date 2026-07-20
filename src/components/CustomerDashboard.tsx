import React, { useState } from 'react';
import { 
  User, Lock, Mail, Phone, MapPin, Calendar, FileText, Download, 
  Upload, MessageSquare, Send, CheckCircle, Clock, Trash, Key, 
  PencilLine, ShieldAlert, ArrowRight, RefreshCw, ChevronDown, 
  ChevronUp, Check, Play, UserCheck, Shield, Bell, Star, CalendarDays
} from 'lucide-react';
import { Booking, UserDocument, ChatMessage } from '../types';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../LanguageContext';
import { useRegistrationErrorHandler } from '../hooks/useRegistrationErrorHandler';
import { useToast } from '../ToastContext';
import { 
  isNotificationSupported, 
  requestNotificationPermission, 
  getNotificationPermissionState, 
  sendBookingStatusNotification 
} from '../utils/notificationService';

interface CustomerDashboardProps {
  bookings: Booking[];
  isLoggedIn: boolean;
  onLogin: (email: string, name: string, role?: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'cancelled') => void;
  onAddMessage: (msg: ChatMessage) => void;
  chatMessages: ChatMessage[];
  onUploadDocument: (doc: UserDocument) => void;
  documents: UserDocument[];
  onUpdateProfile: (name: string, phone: string, address: string) => void;
  currentUser: { name: string; email: string; phone: string; address: string } | null;
  activeTab?: 'bookings' | 'documents' | 'profile' | 'support';
  onTabChange?: (tab: 'bookings' | 'documents' | 'profile' | 'support') => void;
  initialAuthMode?: 'login' | 'register' | 'verify' | 'forgot' | 'reset';
  onAuthModeChange?: (mode: 'login' | 'register' | 'verify' | 'forgot' | 'reset') => void;
  onNavigateToBooking?: (serviceId?: string) => void;
}

// Helper component for logging component mount/unmount lifecycles
function LifecycleLogger({ name }: { name: string }) {
  React.useEffect(() => {
    if (name === 'VerifyForm') {
      console.log('[STEP] Before Verify mount');
      console.log(`[LIFECYCLE] +++ ${name} component MOUNTED (Verify mount)`);
      console.log('[STEP] After Verify mount');
    } else {
      console.log(`[LIFECYCLE] +++ ${name} component MOUNTED`);
    }

    return () => {
      if (name === 'RegisterForm') {
        console.log('[STEP] Before Register unmount');
        console.log(`[LIFECYCLE] --- ${name} component UNMOUNTED (Register unmount)`);
        console.log('[STEP] After Register unmount');
      } else {
        console.log(`[LIFECYCLE] --- ${name} component UNMOUNTED`);
      }
    };
  }, [name]);
  return null;
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
  currentUser,
  activeTab: controlledActiveTab,
  onTabChange,
  initialAuthMode,
  onAuthModeChange,
  onNavigateToBooking
}: CustomerDashboardProps) {

  const { language } = useLanguage();
  const isDe = language === 'de';
  const { success, error, warning, info } = useToast();

  const {
    error: registrationError,
    setError: setRegistrationError,
    clearError: clearRegistrationError,
    handleApiError: handleRegistrationApiError,
    handleNetworkError: handleRegistrationNetworkError
  } = useRegistrationErrorHandler();

  // Authentication Flow states
  // 'login' | 'register' | 'verify' | 'forgot' | 'reset'
  const [authModeState, setAuthModeState] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>(initialAuthMode || 'login');

  const authMode = initialAuthMode || authModeState;

  const setAuthMode = React.useCallback((mode: 'login' | 'register' | 'verify' | 'forgot' | 'reset') => {
    setAuthModeState(mode);
    if (onAuthModeChange) {
      onAuthModeChange(mode);
    }
  }, [onAuthModeChange]);

  // Extract registered email from location query string, history state, or localStorage fallback
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const historyEmail = window.history.state && (window.history.state as any).email;
      const storedEmail = localStorage.getItem("pendingVerificationEmail");

      const resolvedEmail = emailParam || historyEmail || storedEmail || "";

      if (resolvedEmail) {
        setNeedsVerificationEmail(prev => prev !== resolvedEmail ? resolvedEmail : prev);
        setAuthEmail(prev => prev !== resolvedEmail ? resolvedEmail : prev);
      } else if (authMode === 'verify') {
        // No email exists, redirect back to Register mode
        setAuthMode('register');
        setAuthError(isDe ? 'Bitte registrieren Sie sich zuerst.' : 'Please register first.');
        if (window.location.pathname !== '/register') {
          window.history.replaceState({}, '', '/register');
        }
      }
    } catch (err) {
      console.error('[Dashboard] Error parsing email from route state:', err);
    }
  }, [authMode, isDe]);
  
  // Registration and Authentication inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  
  // Validation Codes
  const [typedCode, setTypedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Dynamic errors or successes
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [needsVerificationEmail, setNeedsVerificationEmail] = useState('');
  

  // Active Tab state inside customer dashboard
  // "bookings" | "documents" | "profile" | "support"
  const [activeTab, setActiveTab] = useState<'bookings' | 'documents' | 'profile' | 'support'>(controlledActiveTab || 'bookings');

  // Sync active tab state from props if controlled
  React.useEffect(() => {
    if (controlledActiveTab) {
      setActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  const handleTabChange = (tab: 'bookings' | 'documents' | 'profile' | 'support') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Notification Permission state
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    return getNotificationPermissionState();
  });

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (perm) {
      setNotifPermission(perm);
      if (perm === 'granted') {
        // Trigger a friendly welcome notification
        sendBookingStatusNotification(
          language === 'de' ? 'Ihr Kundenportal' : 'Your Customer Portal',
          'assigned',
          language === 'de' ? 'Mitteilungen aktiv' : 'Notifications active',
          language
        );
      }
    }
  };

  const handleTestNotification = () => {
    sendBookingStatusNotification(
      language === 'de' ? 'Haushaltsreinigung (Muster)' : 'Household Cleaning (Sample)',
      'completed',
      undefined,
      language
    );
  };

  // New Chat Message State
  const [chatInput, setChatInput] = useState('');
  
  // Edit Profile States
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Expandable Booking details row tracker
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // File Upload States
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileNameError, setUploadFileNameError] = useState('');

  // Sync profile editing when currentUser loads
  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfilePhone(currentUser.phone);
      setProfileAddress(currentUser.address);
    }
  }, [currentUser]);

  // Rescheduling states
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('09:00');

  // Reviews states
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('');

  // Notifications states
  const [clientNotifications, setClientNotifications] = useState<any[]>([]);

  // Address book states
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [newAddressInput, setNewAddressInput] = useState('');

  // Preferences states
  const [favouriteServices, setFavouriteServices] = useState<string[]>([]);

  // Effect to load notifications, address book and favourite services
  React.useEffect(() => {
    if (isLoggedIn && currentUser) {
      // Fetch in-app notifications
      fetch(`/api/notifications?email=${encodeURIComponent(currentUser.email)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setClientNotifications(data);
          }
        })
        .catch(() => {});

      // Load advanced user preferences
      fetch('/api/admin/users-detailed')
        .then(res => res.json())
        .then(resData => {
          if (resData.success && Array.isArray(resData.users)) {
            const thisUser = resData.users.find((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
            if (thisUser) {
              setSavedAddresses(thisUser.savedAddresses || [currentUser.address].filter(Boolean));
              setFavouriteServices(thisUser.preferences?.favouriteServices || []);
            }
          }
        })
        .catch(() => {});
    }
  }, [isLoggedIn, currentUser]);

  // Auth Handler: LOGIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        onLogin(result.user.email, result.user.name, result.user.role);
      } else if (response.status === 403 && result.needsVerification) {
        // Needs verification setup code input
        setNeedsVerificationEmail(authEmail);
setAuthMode('verify');
setAuthError(
  language === 'de'
    ? 'E-Mail-Adresse ist noch nicht verifiziert.'
    : 'Email address is not verified yet.'
);
      } else {
        const msg = language === 'de' ? 'E-Mail oder Passwort falsch.' : 'Incorrect email or password.';
        setAuthError(msg);
      }
    } catch (err: any) {
      const msg = language === 'de' ? 'E-Mail oder Passwort falsch.' : 'Incorrect email or password.';
      setAuthError(msg);
    }
  };

  // Auth Handler: REGISTER Account Creation
  const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError('');
  setAuthSuccess('');
  clearRegistrationError();

    console.log('[REGISTRATION] Form submitted. Email:', authEmail, 'Name:', authName);

    if (!authEmail || !authPassword || !authName || !authConfirmPassword) {
      console.warn('[REGISTRATION] Missing required fields');
      setRegistrationError(language === 'de' ? 'Bitte füllen Sie alle erforderlichen Felder aus.' : 'Please fill out all required fields.');
      return;
    }

    if (authPassword !== authConfirmPassword) {
      console.warn('[REGISTRATION] Passwords do not match');
      setRegistrationError(language === 'de' ? 'Die Passwörter stimmen nicht überein.' : 'Passwords do not match.');
      return;
    }

    try {
      console.log('[REGISTRATION] Sending POST request to /api/auth/register...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword
        })
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.error('[REGISTRATION] Failed to parse response JSON:', jsonErr);
      }

      if (response.ok && result && result.success) {
        const registeredEmail = authEmail;
        console.log('[STEP] Before Registration API success handler');
        console.log('[REGISTRATION SUCCESS] Registration API success. Succeeded for email:', registeredEmail);
        console.log('[STEP] After Registration API success handler');

        console.log('[STEP] Before Email sent handling');
        console.log('[EMAIL SENDING] Backend has successfully dispatched the 6-digit confirmation email to:', registeredEmail);
        console.log('[STEP] After Email sent handling');

        console.log('[STEP] Before State update');
        setNeedsVerificationEmail(registeredEmail);
        setAuthSuccess(language === 'de' ? 'Registrierung erfasst! Ein 6-stelliger Verifizierungscode wurde gesendet.' : 'Registration received! A 6-digit verification code has been sent.');
        
        
        
        // Save to localStorage so verification page has fallback
        console.log('[REGISTRATION SUCCESS] Saving pending verification email to localStorage:', registeredEmail);
        localStorage.setItem("pendingVerificationEmail", registeredEmail);
        console.log('[STEP] After State update');
        
        console.log('[STEP] Before Navigate to Verify');
        // Single synchronous navigation update with history state
        const targetPath = `/verify?email=${encodeURIComponent(registeredEmail)}`;
        console.log('[NAVIGATION] Updating history path state to:', targetPath);
        if (window.location.pathname !== '/verify') {
          window.history.pushState({ email: registeredEmail }, '', targetPath);
        }
        console.log('[STEP] After Navigate to Verify');
        
        // NO double state updates or setAuthMode('verify') here!
        // The window.history.pushState call synchronously triggers checkPath() in App.tsx,
        // which sets customerAuthMode to 'verify'.
        // This updates CustomerDashboard's props and triggers the sync useEffect cleanly,
        // avoiding concurrent state updates, double unmounts, and the removeChild error.
      } else {
        console.error('[REGISTRATION FAILED] Error response:', result);
        await handleRegistrationApiError({
          error: result?.error,
          status: response.status
        }, language === 'de' ? 'Registrierung fehlgeschlagen.' : 'Registration failed.');
      }
    } catch (err: any) {
      console.error('[REGISTRATION] Error during registration network call:', err);
      handleRegistrationNetworkError(err);
    }
  };

  // Auth Handler: VERIFICATION Code confirming
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: needsVerificationEmail || authEmail, code: typedCode })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setAuthSuccess('Verifizierung erfolgreich! Sie können sich jetzt anmelden.');
        setAuthMode('login');
        
        // Autofill password credentials
        setTypedCode('');
      } else {
        setAuthError(result.error || 'Ungültiger Verifizierungscode.');
      }
    } catch (err: any) {
      setAuthError('Code-Verifizierung fehlgeschlagen.');
    }
  };

  // Auth Handler: FORGOT Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail })
      });

      const result = await response.json();
      if (response.ok) {
        setNeedsVerificationEmail(authEmail);
        setAuthMode('reset');
        setAuthSuccess('Sicherheitscode zum Zurücksetzen wurde versendet.');
        
      } else {
        setAuthError(result.error || 'Zurücksetzen fehlgeschlagen.');
      }
    } catch (err) {
      setAuthError('Zahlungsanbieter offline.');
    }
  };

  // Auth Handler: RESET Password with code
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: needsVerificationEmail || authEmail,
          code: typedCode,
          newPassword
        })
      });

      const result = await response.json();
      if (response.ok) {
        setAuthSuccess('Passwort erfolgreich zurückgesetzt! Bitte loggen Sie sich ein.');
        setAuthMode('login');
        
        setTypedCode('');
        setNewPassword('');
      } else {
        setAuthError(result.error || 'Passwort-Zurücksetzung fehlgeschlagen.');
      }
    } catch (err) {
      setAuthError('Netzwerk-Kommunikationsfehler.');
    }
  };

  // Profile data saver
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileName, profilePhone, profileAddress);
    success(isDe ? 'Profil erfolgreich aktualisiert!' : 'Profile updated successfully!');
    setProfileSavedMsg('Profil erfolgreich gespeichert!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  // Support dispatch chatting
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
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', invoiceName);
    link.click();
  };

  const generateInvoicePdf = (booking: Booking) => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const primaryColor = [0, 86, 214]; // #0056D6
      const accentColor = [47, 181, 255]; // #2FB5FF
      const textColor = [30, 41, 59]; // Slate-800
      const lightLineColor = [226, 232, 240];

      // Top branding colored bar
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

      doc.setDrawColor(lightLineColor[0], lightLineColor[1], lightLineColor[2]);
      doc.setLineWidth(0.3);
      doc.line(20, 42, 190, 42);

      // Customer section
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

      // Metadata
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
      doc.text(invoiceNo, 162, 56);

      doc.setFont('Helvetica', 'normal');
      doc.text('Rechnungsdatum:', 125, 61.5);
      doc.text(todayString, 162, 61.5);

      doc.text('Dienstleistung:', 125, 67);
      doc.text(booking.date, 162, 67);

      doc.text('Fälligkeitsdatum:', 125, 72.5);
      doc.setFont('Helvetica', 'bold');
      doc.text(dueDateString, 162, 72.5);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('OFFIZIELLE RECHNUNG', 20, 88);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      const textIntro = `Sehr geehrte(r) ${booking.customerName},\n\nwir bedanken uns für den erteilten Reinigungs- und Betreuungsauftrag im Raum Berlin. Hiermit stellen wir Ihnen die vertragsgemäß erbrachte Dienstleistung ordnungsgemäß in Rechnung.`;
      const wrappedIntro = doc.splitTextToSize(textIntro, 170);
      doc.text(wrappedIntro, 20, 94);

      // Table items
      const tableTopY = 118;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, tableTopY, 170, 7.5, 'F');
      
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(20, tableTopY, 190, tableTopY);
      doc.line(20, tableTopY + 7.5, 190, tableTopY + 7.5);

      doc.setTextColor(100, 116, 139);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('POSITION / BESCHREIBUNG', 23, tableTopY + 5);
      doc.text('SATZ / KOSTEN', 115, tableTopY + 5);
      doc.text('MENGE', 148, tableTopY + 5);
      doc.text('BETRAG (NETTO)', 166, tableTopY + 5);

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
        const wrappedNotes = doc.splitTextToSize(`Hinweis: "${booking.notes}"`, 85);
        doc.text(wrappedNotes, 23, rowY + 9);
      }

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 115, rowY);
      doc.text('1,00 Psch.', 148, rowY);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, rowY);

      const bottomRowY = booking.notes ? rowY + 16 : rowY + 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, bottomRowY, 190, bottomRowY);

      const calcY = bottomRowY + 8;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Zwischensumme (Netto):', 118, calcY);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, calcY);
      doc.text('Umsatzsteuer (0% / Befreit):', 118, calcY + 5.5);
      doc.text('0,00 €', 166, calcY + 5.5);

      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.4);
      doc.line(115, calcY + 9, 190, calcY + 9);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('RECHNUNGSBETRAG:', 118, calcY + 14.5);
      doc.text(`${booking.totalPrice.toFixed(2)} €`, 166, calcY + 14.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('STEUERLICHE ABSETZBARKEIT (§ 35a EStG):', 20, calcY + 22);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Als haushaltsnahe Dienstleistung nach § 35a Absatz 2 EStG steuerlich begünstigt (20% absetzbar).', 20, calcY + 26);
      doc.text('Umsatzsteuerbefreite Pflegesachleistung nach § 4 Nr. 16 SGB XI.', 20, calcY + 30);

      const footerY = 245;
      doc.setDrawColor(203, 213, 225);
      doc.line(20, footerY, 190, footerY);

      doc.setTextColor(115, 115, 115);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Bitte überweisen Sie den Betrag unter Angabe des Verwendungszwecks innerhalb der Zahlungsfrist.', 20, footerY + 5);
      doc.setFont('Helvetica', 'bold');
      doc.text('Bankdaten:', 20, footerY + 10);
      doc.setFont('Helvetica', 'normal');
      doc.text('Berliner Volksbank • IBAN: DE78 1009 0000 1234 5678 90 • BIC: BEVO DE BB XXX', 20, footerY + 14);

      doc.save(`Rechnung_${invoiceNo}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      error(isDe ? 'Der PDF-Download ist fehlgeschlagen.' : 'The PDF download failed.');
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;
    
    fetch(`/api/bookings/${reschedulingBooking.id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: rescheduleDate,
        time: rescheduleTime
      })
    })
    .then(res => res.json())
    .then(data => {
      // Send alert notification
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          title: 'Termin verschoben',
          titleEn: 'Appointment Rescheduled',
          message: `Ihr Termin für ${reschedulingBooking.serviceName} wurde auf den ${rescheduleDate} um ${rescheduleTime} Uhr verlegt.`,
          messageEn: `Your appointment for ${reschedulingBooking.serviceName} has been rescheduled to ${rescheduleDate} at ${rescheduleTime}.`
        })
      });

      success(isDe ? 'Termin erfolgreich verschoben!' : 'Appointment rescheduled successfully!');
      setReschedulingBooking(null);
      
      // Update local state or reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
    .catch(() => {
      error(isDe ? 'Fehler beim Verschieben des Termins.' : 'Failed to reschedule appointment.');
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: currentUser?.name || 'Kunde',
        email: currentUser?.email || 'kunde@emmasco.de',
        rating: reviewRating,
        serviceId: reviewBooking.serviceId,
        text: reviewText,
        photoUrl: reviewPhoto
      })
    })
    .then(res => res.json())
    .then(data => {
      success(isDe ? 'Bewertung erfolgreich eingereicht! Sie wird nach der Prüfung veröffentlicht.' : 'Review submitted! It will be published after approval.');
      setReviewBooking(null);
      setReviewText('');
      setReviewPhoto('');
      setReviewRating(5);
    })
    .catch(() => {
      error(isDe ? 'Fehler beim Senden der Bewertung.' : 'Failed to submit review.');
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim() || !currentUser) return;

    const updatedAddresses = [...savedAddresses, newAddressInput.trim()];
    
    fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        savedAddresses: updatedAddresses
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSavedAddresses(updatedAddresses);
        setNewAddressInput('');
        success(isDe ? 'Adresse hinzugefügt!' : 'Address added!');
      }
    });
  };

  const handleRemoveAddress = (addressToRemove: string) => {
    if (!currentUser) return;
    const updatedAddresses = savedAddresses.filter(a => a !== addressToRemove);
    
    fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        savedAddresses: updatedAddresses
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSavedAddresses(updatedAddresses);
        warning(isDe ? 'Adresse entfernt.' : 'Address removed.');
      }
    });
  };

  const handleToggleFavouriteService = (serviceId: string) => {
    if (!currentUser) return;
    const updated = favouriteServices.includes(serviceId)
      ? favouriteServices.filter(id => id !== serviceId)
      : [...favouriteServices, serviceId];

    fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        preferences: { favouriteServices: updated }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setFavouriteServices(updated);
        info(isDe ? 'Favoriten aktualisiert!' : 'Favorites updated!');
      }
    });
  };

  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      setUploadFileNameError('Bitte tragen Sie einen Dateinamen oder Pfad ein.');
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
    success(
      isDe
        ? '📄 Dokument erfolgreich hochgeladen! Status ist nun "In Prüfung" durch unser Team.'
        : '📄 Document uploaded successfully! Status is now "Under Review" by our team.'
    );
  };

  // Rebooking trigger
  const handleRebookService = (b: Booking) => {
    // Show visual confirmation
    info(
      isDe
        ? `🔁 Rebooking initialisiert: Dienstleistung "${b.serviceName}" wird übernommen. Wir leiten Sie nun zur Buchungsseite weiter, wo Ihre Adress- & Kontaktdaten bereits vorbelegt sind.`
        : `🔁 Rebooking initialized: service "${b.serviceName}" is being transferred. We will now redirect you to the booking page, where your address and contact details are already pre-filled.`
    );
    if (onNavigateToBooking) {
      onNavigateToBooking(b.serviceId);
    }
  };

  // Filter Bookings relative to customer
  const clientBookings = bookings.filter(b => b.email.toLowerCase() === (currentUser?.email || 'w.schmidt@gmail.com').toLowerCase());

  // Split bookings into upcoming vs historical
  const upcomingBookings = clientBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = clientBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  // Render Authentication Views
  // Render Authentication Views
  if (!isLoggedIn) {
    const renderAuthForm = () => {
      switch (authMode) {
        case 'login':
          return (
            <form key="login-form" onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <LifecycleLogger name="LoginForm" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'E-Mail-Adresse *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'Ihr Passwort *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="customer-login-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer mt-2 shadow-sm"
              >
                {isDe ? 'Einloggen' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-gray-100 font-extrabold px-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-[#0056D6] hover:text-blue-800 transition cursor-pointer"
                >
                  {isDe ? 'Konto erstellen' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-[#0056D6] hover:text-blue-800 transition cursor-pointer"
                >
                  {isDe ? 'Passwort vergessen?' : 'Forgot Password?'}
                </button>
              </div>
            </form>
          );

        case 'register':
          return (
            <form key="register-form" onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <LifecycleLogger name="RegisterForm" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'Ihr vollständiger Name *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={isDe ? 'z.B. Waltraud Schmidt' : 'e.g. Waltraud Schmidt'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'E-Mail-Adresse *' : 'Email *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'Wählen Sie ein Passwort *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'Passwort bestätigen *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="customer-register-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer mt-2 shadow-sm"
              >
                {isDe ? 'Konto erstellen' : 'Create Account'}
                <CheckCircle className="w-4 h-4" />
              </button>

              <div className="text-center text-xs mt-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-gray-500 hover:text-gray-800 transition font-bold"
                >
                  {isDe ? 'Zurück zum Login' : 'Back to Login'}
                </button>
              </div>
            </form>
          );

        case 'verify':
          return (
            <form key="verify-form" onSubmit={handleVerifySubmit} className="flex flex-col gap-4 text-center">
              <LifecycleLogger name="VerifyForm" />
              <span className="text-3xl mx-auto">📧</span>
              <div className="flex flex-col gap-1 text-center">
                <h3 className="font-extrabold text-blue-900 text-sm">
                  {isDe ? 'Überprüfungscode eingeben' : 'Enter Verification Code'}
                </h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  {isDe 
                    ? `Wir haben Ihnen einen 6-stelligen Code an geschickt.` 
                    : `We have sent a 6-digit confirmation code.`}
                </p>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                value={typedCode}
                onChange={(e) => setTypedCode(e.target.value)}
                className="w-full py-3 bg-[#F6FAFF] border-2 border-blue-200 text-center text-xl tracking-widest font-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="123456"
              />

              <button
                type="submit"
                id="customer-verify-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                {isDe ? 'Verifizierung abschließen' : 'Complete Verification'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-gray-500 hover:text-gray-800 font-bold underline animate-pulse"
              >
                {isDe ? 'Zurück zum Login' : 'Back to Login'}
              </button>
            </form>
          );

        case 'forgot':
          return (
            <form key="forgot-form" onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <LifecycleLogger name="ForgotForm" />
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl">🔑</span>
                <h3 className="font-extrabold text-blue-900 text-sm mt-1">
                  {isDe ? 'Passwort vergessen?' : 'Forgot Password?'}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 text-center leading-normal">
                  {isDe 
                    ? 'Wir senden Ihnen einen Code per E-Mail, um Ihr Passwort zurückzusetzen.' 
                    : 'We will send a code to your email in order to reset your password.'}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-extrabold text-gray-750">
                  {isDe ? 'Ihre E-Mail-Adresse *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F6FAFF] border border-blue-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="customer-forgot-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs cursor-pointer shadow-sm"
              >
                {isDe ? 'Code anfordern' : 'Request Code'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-gray-500 hover:text-gray-800 font-bold text-center mt-1 underline"
              >
                {isDe ? 'Abbrechen' : 'Cancel'}
              </button>
            </form>
          );

        case 'reset':
          return (
            <form key="reset-form" onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <LifecycleLogger name="ResetForm" />
              <div className="flex flex-col gap-1 text-center">
                <span className="text-3xl mx-auto">🛡️</span>
                <h3 className="font-extrabold text-blue-900 text-sm">
                  {isDe ? 'Sicherheitscode eingeben' : 'Enter Security Code'}
                </h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  {isDe 
                    ? 'Tragen Sie den erhaltenen Code und Ihr neues Passwort ein.' 
                    : 'Insert the received code and your new password.'}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-750">
                  {isDe ? '6-stelliger Reset-Code' : '6-digit Reset Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={typedCode}
                  onChange={(e) => setTypedCode(e.target.value)}
                  className="w-full py-2 bg-[#F6FAFF] border border-blue-105 text-center text-md tracking-wider font-extrabold rounded-xl"
                  placeholder="123456"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-750">
                  {isDe ? 'Neues Wunsch-Passwort' : 'New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F6FAFF] border border-blue-105 text-sm font-bold rounded-xl"
                  placeholder={isDe ? 'Neues Passwort festlegen' : 'Define password'}
                />
              </div>

              <button
                type="submit"
                id="customer-reset-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                {isDe ? 'Neues Passwort speichern' : 'Save New Password'}
              </button>
            </form>
          );

        default:
          return null;
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-16 text-left">
        <div className="bg-white p-8 rounded-3xl border border-blue-105 shadow-xl flex flex-col gap-6">
          
          <div className="text-center flex flex-col items-center">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-black text-blue-900 mt-2">
              {authMode === 'login' && (isDe ? 'Kunden-Login' : 'Client Login')}
              {authMode === 'register' && (isDe ? 'Konto erstellen' : 'Create Account')}
              {authMode === 'forgot' && (isDe ? 'Passwort vergessen?' : 'Forgot Password?')}
              {authMode === 'verify' && (isDe ? 'Code eingeben' : 'Enter Code')}
              {authMode === 'reset' && (isDe ? 'Passwort ändern' : 'Change Password')}
            </h1>
            <p className="text-gray-500 font-semibold text-xs mt-1 leading-relaxed">
              {authMode === 'login' && (isDe ? 'Melden Sie sich an, um Ihr sicheres Portal zu betreten.' : 'Log in to access your secure client portal.')}
              {authMode === 'register' && (isDe ? 'Registrieren Sie ein neues Kundenkonto.' : 'Create a new customer account.')}
              {authMode === 'forgot' && (isDe ? 'Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Code anzufordern.' : 'Provide your email in order to request a reset code.')}
              {authMode === 'verify' && (isDe ? 'Bitte verifizieren Sie Ihre E-Mail-Adresse.' : 'Please verify your email address.')}
              {authMode === 'reset' && (isDe ? 'Legen Sie ein neues Wunschpasswort fest.' : 'Define a secure new password.')}
            </p>
          </div>

          {/* Feedback alerts - housed in a stable child block to prevent sibling reordering bugs */}
          <div className="flex flex-col gap-2 empty:hidden">
            {(authError || (authMode === 'register' && registrationError)) && (
              <div key="auth-error-alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 font-bold text-xs flex items-start gap-2 animate-fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authMode === 'register' ? registrationError : authError}</span>
              </div>
            )}

            {authSuccess && (
              <div key="auth-success-alert" className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 font-extrabold text-xs flex items-start gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            
          </div>

          {/* Render exactly one active form dynamically */}
          <div className="w-full">
            {renderAuthForm()}
          </div>

        </div>
      </div>
    );
  }

  // PORTAL LOGGED IN VIEWS
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-left">
      
      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-blue-800 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-blue-600 border border-blue-500 rounded-full px-2.5 py-1 uppercase font-black text-blue-100">
            Sicher eingeloggt als Kunde
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">Herzlich Willkommen, {currentUser?.name}!</h1>
          <p className="text-xs font-semibold text-blue-200 mt-1">
            Hier verwalten Sie Ihren Haushaltsplan und den Schriftverkehr mit Ihrem Pflegeteam.
          </p>
        </div>
        <div className="bg-blue-800 px-4 py-3 rounded-2xl border border-blue-600 font-extrabold text-xs">
          <span>Einzugsgebiet: Berlin-Pankow</span>
        </div>
      </div>

      {/* In-App Notifications Banner */}
      {clientNotifications.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 mt-6 text-left animate-fade-in max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3 border-b border-blue-100/50 pb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0056D6] animate-bounce shrink-0" />
              <h3 className="font-extrabold text-blue-900 text-sm">
                {isDe ? 'Ihre Mitteilungen & Benachrichtigungen' : 'Your Notifications & Alerts'}
              </h3>
            </div>
            <button 
              onClick={() => {
                fetch('/api/notifications/read', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: currentUser?.email })
                })
                .then(() => setClientNotifications([]));
              }}
              className="text-[10px] font-bold text-[#0056D6] hover:underline cursor-pointer bg-transparent border-none"
            >
              {isDe ? 'Alle als gelesen markieren' : 'Mark all as read'}
            </button>
          </div>
          <div className="flex flex-col gap-2.5 max-h-40 overflow-y-auto pr-2">
            {clientNotifications.map((notif: any) => (
              <div key={notif.id || Math.random()} className="flex gap-3 text-xs bg-white p-3 rounded-xl border border-blue-50 shadow-xs">
                <span className="text-[10px] text-gray-400 font-bold shrink-0 self-start mt-0.5">
                  {new Date(notif.createdAt || Date.now()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-gray-800">{isDe ? (notif.title || notif.titleDe) : (notif.titleEn || notif.title)}</span>
                  <span className="text-gray-650">{isDe ? (notif.message || notif.messageDe) : (notif.messageEn || notif.message)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid container layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <button
            id="tab-btn-bookings"
            onClick={() => handleTabChange('bookings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-700 border border-blue-100 shadow-sm'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            Mein Haushaltsplan
          </button>

          <button
            id="tab-btn-documents"
            onClick={() => handleTabChange('documents')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-100 shadow-sm'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            Nachweise & Rechnungen
          </button>

          <button
            id="tab-btn-profile"
            onClick={() => handleTabChange('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-100 shadow-sm'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            Profildaten verwalten
          </button>

          <button
            id="tab-btn-support"
            onClick={() => handleTabChange('support')}
            className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-gray-750 border border-blue-100 shadow-sm'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            Live-Hilfe & Unterstützung
            {chatMessages.length > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>

          {/* Push Notification Panel */}
          {isNotificationSupported() && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-blue-50 mt-4 text-left shadow-sm">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0056D6] shrink-0" />
                <span className="text-xs font-bold text-gray-800">
                  {isDe ? 'Browser-Mitteilungen' : 'Push Notifications'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {isDe 
                  ? 'Erhalten Sie Echtzeit-Meldungen bei Zuweisung oder Fertigstellung Ihrer Einsätze.' 
                  : 'Get instant browser alerts when your cleaning visits are assigned or completed.'}
              </p>
              <div className="mt-3">
                {notifPermission === 'granted' ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      {isDe ? 'Aktiviert' : 'Active'}
                    </div>
                    <button
                      onClick={handleTestNotification}
                      className="w-full text-center bg-white border border-blue-200 hover:bg-blue-50 text-[10px] text-[#0056D6] font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                    >
                      {isDe ? 'Testen' : 'Test Notification'}
                    </button>
                  </div>
                ) : notifPermission === 'denied' ? (
                  <div className="text-[10px] font-bold text-red-500 bg-red-50/50 p-2 rounded-lg border border-red-100">
                    {isDe ? 'Mitteilungen blockiert. Bitte im Browser freischalten.' : 'Notifications blocked. Please enable in settings.'}
                  </div>
                ) : (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full text-center bg-[#0056D6] hover:bg-blue-700 text-white text-[11px] font-extrabold py-2 px-3 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    {isDe ? 'Aktivieren' : 'Enable'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel Main Panel */}
        <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-md">
          
          {/* TAB 1: MEIN HAUSHALTSPLAN (UPCOMING & HISTORY) */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black text-blue-900">Aktuelle & geplante Einsätze</h2>
                <p className="text-xs text-gray-400 mt-1">Planen Sie Ihre Haushaltsbegleitung und verfolgen Sie den Einsatzfortschritt live.</p>
              </div>

              {/* Upcoming Bookings lists */}
              <div className="flex flex-col gap-4">
                <h3 className="font-extrabold text-blue-950 text-sm">Ausstehende & Aktive Termine</h3>
                {upcomingBookings.map((b) => {
                  const isExpanded = expandedBookingId === b.id;
                  
                  // Visual Progress Stepper Step value
                  let stepValue = 1; // pending
                  if (b.status === 'confirmed') stepValue = 2;
                  if (b.status === 'assigned') stepValue = 3;
                  if (b.status === 'in_progress') stepValue = 4;
                  if (b.status === 'completed') stepValue = 5;

                  return (
                    <div 
                      key={b.id}
                      className="border border-blue-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* Summary Row clickable for Expand details */}
                      <div 
                        onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                        className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-blue-50/20' : 'bg-[#F6FAFF]/40 hover:bg-[#F6FAFF]/80'
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-blue-900 text-sm">{b.serviceName}</span>
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                              b.status === 'confirmed' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : b.status === 'assigned'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : b.status === 'in_progress'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>
                              {b.status === 'pending' && '⌚ In Prüfung'}
                              {b.status === 'confirmed' && '✔ Bestätigt'}
                              {b.status === 'assigned' && '👤 Kraft Zugewiesen'}
                              {b.status === 'in_progress' && '⏳ Einsatz läuft'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{b.date} um {b.time} Uhr</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between">
                          <span className="text-xs font-bold text-gray-500">{b.totalPrice.toFixed(2)} €</span>
                          <span className="p-1 rounded-full bg-blue-50 text-blue-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Booking Details Page section */}
                      {isExpanded && (
                        <div className="p-5 border-t border-blue-50 bg-white flex flex-col gap-6 animate-fade-in">
                          
                          {/* Visual Progress Stepper bar */}
                          <div className="flex flex-col gap-3">
                            <span className="text-[10px] lowercase uppercase font-black tracking-wider text-slate-400">Einsatz Statusfortschritt:</span>
                            
                            <div className="relative flex justify-between items-center w-full max-w-lg mx-auto py-2">
                              {/* Horizontal Background bar */}
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                              <div 
                                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${(stepValue - 1) * 25}%` }}
                              ></div>

                              {/* Stepper Nodes */}
                              {[
                                { step: 1, label: 'Eingereicht' },
                                { step: 2, label: 'Bestätigt' },
                                { step: 3, label: 'Kraft eingeteilt' },
                                { step: 4, label: 'Haushalt läuft' },
                                { step: 5, label: 'Abgeschlossen' }
                              ].map((node) => {
                                const active = stepValue >= node.step;
                                return (
                                  <div key={node.step} className="flex flex-col items-center gap-1 z-10 relative">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                                      active 
                                        ? 'bg-blue-600 border-blue-700 text-white' 
                                        : 'bg-white border-gray-200 text-gray-400'
                                    }`}>
                                      {stepValue > node.step ? <Check className="w-3 h-3" /> : node.step}
                                    </div>
                                    <span className={`text-[9px] font-black text-center whitespace-nowrap hidden sm:block ${
                                      active ? 'text-blue-900' : 'text-gray-400'
                                    }`}>
                                      {node.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-y border-dashed border-gray-150 py-4">
                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-gray-400 lowercase uppercase font-black tracking-wider text-[9px]">Dienstleistung / Service:</span>
                              <span className="font-extrabold text-slate-800 text-sm">{b.serviceName}</span>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-gray-400 lowercase uppercase font-black tracking-wider text-[9px]">Termin und Startzeit:</span>
                              <span className="font-extrabold text-[#0056D6]">{b.date} um {b.time} Uhr</span>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-gray-400 lowercase uppercase font-black tracking-wider text-[9px]">Einsatzadresse (Berlin):</span>
                              <span className="font-extrabold text-slate-800">{b.address}</span>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-gray-400 lowercase uppercase font-black tracking-wider text-[9px]">Satz / Preis (Haushaltsbudget):</span>
                              <span className="font-extrabold text-emerald-650">{b.totalPrice.toFixed(2)} € (Abrechenbar nach §45a)</span>
                            </div>

                            <div className="flex flex-col gap-1 text-left md:col-span-2">
                              <span className="text-gray-400 lowercase uppercase font-black tracking-wider text-[9px]">Zugewiesene Haushaltshilfe:</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-black text-[10px]">
                                  {b.cleanerName || (b.status === 'assigned' || b.status === 'in_progress' ? 'M. Becker' : 'Wird eingeteilt')}
                                </span>
                                <span className="text-gray-400 text-[10px]">(zertifizierte Haushaltskraft der Emmasco GmbH)</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 justify-end flex-wrap">
                            <button
                              onClick={() => {
                                setReschedulingBooking(b);
                                setRescheduleDate(b.date);
                                setRescheduleTime(b.time);
                              }}
                              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                            >
                              <CalendarDays className="w-4 h-4" />
                              Termin verschieben
                            </button>

                            <button
                              onClick={() => generateInvoicePdf(b)}
                              className="px-4 py-2 bg-blue-50 text-[#0056D6] border border-blue-200 hover:bg-[#0056D6] hover:text-white rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                            >
                              <Download className="w-4 h-4" />
                              Voranschlag PDF laden
                            </button>

                            <button
                              onClick={() => {
                                if (confirm('Möchten Sie diesen Termin wirklich stornieren? Unser Team wird sofort benachrichtigt.')) {
                                  onUpdateBookingStatus(b.id, 'cancelled');
                                }
                              }}
                              className="px-4 py-2 hover:bg-red-50 text-red-650 border border-red-200/50 rounded-xl text-xs font-extrabold cursor-pointer"
                            >
                              Einsatz absagen
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}

                {upcomingBookings.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Keine ausstehenden geplanten Haushaltstermine.</p>
                )}
              </div>

              {/* Booking History & Previous bookings list */}
              <div className="flex flex-col gap-4 mt-6">
                <h3 className="font-extrabold text-blue-950 text-sm border-t border-gray-100 pt-6">Abgeschlossene oder stornierte Termine (Historie)</h3>
                <div className="flex flex-col gap-3">
                  {pastBookings.map((b) => (
                    <div 
                      key={b.id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 text-xs"
                    >
                      <div className="text-left flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-gray-800">{b.serviceName}</span>
                          <span className={`text-[8px] uppercase font-black px-1.5 py-0.2 rounded border ${
                            b.status === 'completed' 
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-600' 
                              : 'bg-red-50 border-red-150 text-red-650'
                          }`}>
                            {b.status === 'completed' ? 'Abgeschlossen' : 'Storniert'}
                          </span>
                        </div>
                        <span className="text-gray-400">{b.date} um {b.time} Uhr | {b.totalPrice.toFixed(2)} €</span>
                      </div>

                      <div className="flex gap-2">
                        {b.status === 'completed' && (
                          <button
                            onClick={() => {
                              setReviewBooking(b);
                              setReviewRating(5);
                              setReviewText('');
                              setReviewPhoto('');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-amber-100 hover:border-amber-300 text-amber-700 bg-[#FFFBEB] hover:bg-amber-100 shadow-xs font-black text-[10px] flex items-center gap-1 cursor-pointer"
                            title="Einsatz bewerten"
                          >
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            Bewerten
                          </button>
                        )}

                        {/* Quick Rebook Trigger */}
                        <button
                          id={`rebook-btn-${b.id}`}
                          onClick={() => handleRebookService(b)}
                          className="px-3 py-1.5 rounded-xl border border-blue-100 hover:border-blue-300 text-blue-700 bg-white shadow-xs font-black text-[10px] flex items-center gap-1 cursor-pointer"
                          title="Gleichen Service erneut anfragen"
                        >
                          <RefreshCw className="w-3 h-3 text-blue-500 animate-spin-hover" />
                          Erneut buchen
                        </button>
                      </div>
                    </div>
                  ))}

                  {pastBookings.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Noch keine historischen Termine abgeschlossen.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INVOICES AND KASSENDOKUMENTE */}
          {activeTab === 'documents' && (
            <div className="flex flex-col gap-8 animate-fade-in text-left">
              
              <div className="text-left flex flex-col gap-4">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-blue-900">Leistungsbewilligungen & Atteste</h2>
                    <p className="text-xs text-gray-400 mt-1">Laden Sie Bescheide des Medizinischen Dienstes (MD) oder Ihrer Pflegekasse hoch.</p>
                  </div>
                </div>

                <form onSubmit={handleDocumentUpload} className="bg-[#F6FAFF] p-5 rounded-2xl border border-blue-50/50 flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-extrabold text-blue-900">Dateiname oder Pfad des Dokuments *</label>
                    <input
                      type="text"
                      placeholder="z.B. Bescheid_Pflegegrad3.pdf"
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

                {/* State documents */}
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

              {/* Invoices List */}
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
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-605 hover:text-white transition cursor-pointer"
                      title="Herunterladen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {clientBookings.map((b) => (
                    <div key={`inv-${b.id}`} className="border border-blue-200/60 bg-blue-50/15 p-4 rounded-2xl flex justify-between items-center transition shadow-xs">
                      <div className="text-left">
                        <span className="block font-extrabold text-blue-950 text-xs text-ellipsis">Rechnung {b.serviceName}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">RE-2026-{b.id.toUpperCase()} | {b.date} | {b.totalPrice.toFixed(2)} €</span>
                      </div>
                      <button
                        id={`download-re-dynamic-${b.id}`}
                        onClick={() => generateInvoicePdf(b)}
                        className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
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

          {/* TAB 3: PROFILE CONTROLS */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-blue-900">Anschrift & Kontaktdaten ändern</h2>
                <p className="text-xs text-gray-400 mt-1">Passen Sie Ihre Daten für zukünftige Pflegerechnungen und Einsatzfahrten an.</p>
              </div>

              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-750">Name des Pflegebedürftigen (Kunde) *</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-750">Telefon für Rückfragen *</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-750">Einsatzadresse (Berlin) *</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {profileSavedMsg && (
                  <p className="text-xs text-green-750 font-extrabold flex items-center gap-1">
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

              {/* Address Book Section */}
              <div className="border-t border-gray-150 pt-6 mt-6">
                <h3 className="text-sm font-black text-blue-900 mb-1">
                  {isDe ? 'Adressbuch (Gespeicherte Anschriften)' : 'Address Book (Saved Addresses)'}
                </h3>
                <p className="text-[11px] text-gray-400 mb-3">
                  {isDe 
                    ? 'Fügen Sie zusätzliche Adressen für Pflegestellen oder Zweitwohnsitze hinzu.'
                    : 'Manage alternative care or cleaning service addresses.'}
                </p>

                {savedAddresses.length > 0 ? (
                  <div className="flex flex-col gap-2 mb-4">
                    {savedAddresses.map((addr) => (
                      <div key={addr} className="flex justify-between items-center bg-[#F6FAFF] border border-blue-50 px-4 py-2.5 rounded-xl text-xs font-semibold">
                        <div className="flex items-center gap-2 text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{addr}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(addr)}
                          className="p-1 text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mb-4">
                    {isDe ? 'Keine zusätzlichen Adressen gespeichert.' : 'No secondary addresses saved.'}
                  </p>
                )}

                <form onSubmit={handleAddAddress} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder={isDe ? 'Neue Adresse in Berlin...' : 'Add a new address...'}
                    className="flex-1 bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#0056D6] hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer whitespace-nowrap"
                  >
                    {isDe ? 'Hinzufügen' : 'Add'}
                  </button>
                </form>
              </div>

              {/* Favourite Services Section */}
              <div className="border-t border-gray-150 pt-6 mt-6">
                <h3 className="text-sm font-black text-blue-900 mb-1">
                  {isDe ? 'Lieblingsleistungen & Favoriten' : 'Favorite Services'}
                </h3>
                <p className="text-[11px] text-gray-400 mb-4">
                  {isDe 
                    ? 'Markieren Sie Ihre am häufigsten genutzten Services für Schnellbuchungen.'
                    : 'Mark services you regularly book for fast checkout and preferences.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'unterhaltsreinigung', nameDe: 'Unterhaltsreinigung', nameEn: 'Basic Cleaning' },
                    { id: 'alltagsbegleitung', nameDe: 'Alltagsbegleitung', nameEn: 'Senior Companion Care' },
                    { id: 'haushaltshilfe', nameDe: 'Haushaltshilfe', nameEn: 'Domestic Help' },
                    { id: 'fensterreinigung', nameDe: 'Fensterreinigung', nameEn: 'Window Cleaning' },
                    { id: 'grundreinigung', nameDe: 'Spezial-Grundreinigung', nameEn: 'Deep Cleaning' }
                  ].map((service) => {
                    const isFav = favouriteServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleToggleFavouriteService(service.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left cursor-pointer transition ${
                          isFav 
                            ? 'bg-blue-50/50 border-blue-200 text-blue-950 font-extrabold' 
                            : 'bg-white border-gray-150 text-gray-650 hover:bg-slate-50 font-semibold'
                        }`}
                      >
                        <Star className={`w-4 h-4 shrink-0 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                        <span className="text-xs">{isDe ? service.nameDe : service.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
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
              <div className="bg-[#F6FAFF] border border-blue-55 rounded-2xl p-4 h-64 overflow-y-auto flex flex-col gap-3">
                
                <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-105 p-3 rounded-2xl text-[11px] font-semibold text-blue-900 leading-normal mb-1">
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
                  className="flex-1 border border-blue-50 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-blue-50 shadow-2xl p-6 md:p-8 max-w-md w-full text-left">
            <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              {isDe ? 'Einsatz verschieben' : 'Reschedule Visit'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isDe 
                ? `Wählen Sie einen neuen Wunschtermin für den Service "${reschedulingBooking.serviceName}".`
                : `Select a new preferred date and time for "${reschedulingBooking.serviceName}".`}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="flex flex-col gap-4 mt-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">{isDe ? 'Wunschdatum' : 'Desired Date'}</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">{isDe ? 'Startzeit' : 'Start Time'}</label>
                <select
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="08:00">08:00 Uhr (Vormittag)</option>
                  <option value="10:00">10:00 Uhr</option>
                  <option value="12:00">12:00 Uhr (Mittag)</option>
                  <option value="14:00">14:00 Uhr (Nachmittag)</option>
                  <option value="16:00">16:00 Uhr (Spätnachmittag)</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-center cursor-pointer transition"
                >
                  {isDe ? 'Abbrechen' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold text-center cursor-pointer transition shadow-sm"
                >
                  {isDe ? 'Termin verlegen' : 'Confirm Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-blue-50 shadow-2xl p-6 md:p-8 max-w-md w-full text-left">
            <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {isDe ? 'Einsatz bewerten' : 'Rate Your Cleaner'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isDe 
                ? `Wie zufrieden waren Sie mit dem Service "${reviewBooking.serviceName}"? Ihre ehrliche Bewertung hilft uns, die Qualität stetig zu sichern.`
                : `How satisfied were you with "${reviewBooking.serviceName}"? Your feedback ensures excellent service quality.`}
            </p>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 mt-5">
              <div className="flex flex-col gap-1.5 items-center">
                <span className="text-xs font-extrabold text-gray-700 mb-1">{isDe ? 'Ihre Sternebewertung:' : 'Your Rating:'}</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className="p-1 hover:scale-115 transition bg-transparent border-none cursor-pointer"
                    >
                      <Star 
                        className={`w-8 h-8 transition ${
                          stars <= reviewRating 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-gray-250 hover:text-amber-350'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">{isDe ? 'Kommentar / Lob / Kritik' : 'Comment'}</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={isDe ? 'Was hat Ihnen besonders gut gefallen? Gab es Verbesserungsvorschläge?' : 'Tell us about your experience...'}
                  className="bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">{isDe ? 'Foto hochladen (optional)' : 'Upload Photo (Optional)'}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={reviewPhoto}
                    onChange={(e) => setReviewPhoto(e.target.value)}
                    placeholder="/images/review-completed.jpg"
                    className="flex-1 bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Autoprefill a nice default cleaning picture for testing or showcase
                      setReviewPhoto('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80');
                      success(isDe ? 'Musterfoto geladen!' : 'Sample photo prefilled!');
                    }}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#0056D6] rounded-xl text-[10px] font-black cursor-pointer whitespace-nowrap"
                  >
                    Musterfoto
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-center cursor-pointer transition"
                >
                  {isDe ? 'Abbrechen' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold text-center cursor-pointer transition shadow-sm"
                >
                  {isDe ? 'Bewertung senden' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
