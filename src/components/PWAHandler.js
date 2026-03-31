'use client';

import { useEffect, useState } from 'react';

export default function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [manualHint, setManualHint] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check if already installed
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator).standalone === true;
    };
    
    setIsStandalone(checkStandalone());

    // 2. Detect Device Type
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // 3. Register Service Worker Immediately
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(reg => console.log('SW Registered'))
        .catch(err => console.log('SW Error', err));
    }

    // 4. Capture Install Event (Android/Chrome/Brave)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Install prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Show banner for mobile users
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasDismissed = localStorage.getItem('pwa_banner_dismissed');

    if (isMobile && !checkStandalone() && !hasDismissed) {
      setTimeout(() => setShowBanner(true), 2000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
       setShowIOSHint(true);
       return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
       // Instead of a boring alert, show a smart manual hint on the button
       setManualHint(true);
       setTimeout(() => setManualHint(false), 4000);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      <div className="fixed top-4 left-4 right-4 z-[9999] animate-fade-in-up md:max-w-md md:mx-auto">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-4 border border-white/60 flex items-center justify-between ring-1 ring-black/5">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={dismissBanner}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-400 hover:text-gray-900 transition-colors shrink-0"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-1 border border-emerald-50 shrink-0">
                <img src="/icon-192x192.png" alt="App Logo" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col gap-0.5 overflow-hidden">
              <h3 className="text-[14px] font-black text-gray-900 truncate">مشاعل المعرفة</h3>
              <p className="text-[10px] text-emerald-700 font-bold truncate">
                {manualHint ? 'استخدم قائمة المتصفح للتثبيت' : 'ثبت التطبيق الآن'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleInstallClick}
            className={`transition-all duration-300 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg active:scale-95 ${
              manualHint 
              ? 'bg-amber-100 text-amber-700 shadow-amber-100' 
              : 'bg-emerald-600 text-white shadow-emerald-200'
            }`}
          >
            {manualHint ? 'يدوي' : 'Install'}
          </button>
        </div>
      </div>

      {/* iOS Instructions remains the same but improved */}
      {showIOSHint && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center flex flex-col gap-6 scale-up">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center p-4">
               <img src="/icon-192x192.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
                <h4 className="text-xl font-black text-gray-900">تثبيت على الآيفون</h4>
                <p className="text-sm text-gray-500 mt-2">اضغط على زر <span className="font-bold text-blue-500">مشاركة</span> ثم <span className="font-bold text-gray-900">إضافة للشاشة الرئيسية</span></p>
            </div>
            <button 
              onClick={() => setShowIOSHint(false)}
              className="bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </>
  );
}
