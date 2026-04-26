import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true || 
        document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone);
      return isStandalone;
    };

    const isStandalone = checkStandalone();

    const ua = window.navigator.userAgent;
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    const isIOSMobile = isIPad || isIPhone;
    const isSafari = isIOSMobile && !!ua.match(/WebKit/i) && !ua.match(/CriOS/i);
    
    if (isSafari && !isStandalone) {
      setIsIOS(true);
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (isIOS) {
      alert("To install Bries on your iPhone/iPad:\n\n1. Tap the 'Share' icon at the bottom of Safari.\n2. Scroll down and select 'Add to Home Screen'.");
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return { isInstallable, isInstalled, isIOS, promptInstall };
}
