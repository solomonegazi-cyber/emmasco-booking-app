import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function PwaInstallBanner() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser mini-infobar prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom banner
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If the app is already installed/standalone, do not show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the native browser install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Install Choice outcome: ${outcome}`);
    } catch (err) {
      console.error('Error prompting PWA installation:', err);
    }

    // Clear the prompt state
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // Persist dismissal in session storage to not annoy the user during the current browsing session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    setIsVisible(false);
  };

  const t = (de: string, en: string) => (language === 'de' ? de : en);

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          id="pwa-install-banner-container"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-[400px] bg-white border border-blue-100 rounded-2xl shadow-xl p-5 z-50 flex flex-col gap-4"
        >
          {/* Close button */}
          <button
            id="pwa-install-close-btn"
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-3">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B5ED7]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">
                {t('App installieren', 'Install App')}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {t(
                  'Installieren Sie das Emmasco Reinigungsteam für schnellen Offline-Zugriff und ein optimales mobiles Erlebnis direkt auf Ihrem Startbildschirm.',
                  'Install Emmasco Reinigungsteam directly on your home screen for fast offline access and an optimal mobile experience.'
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end text-xs font-semibold mt-1">
            <button
              id="pwa-install-later-btn"
              onClick={handleDismiss}
              className="px-3.5 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              {t('Später', 'Later')}
            </button>
            <button
              id="pwa-install-now-btn"
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B5ED7] hover:bg-[#094cb0] active:bg-[#073c8c] text-white rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {t('Installieren', 'Install Now')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
