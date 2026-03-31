'use client';

import { useEffect, useState } from 'react';

export default function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed/running in standalone mode
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator).standalone === true;
    };
    
    setIsStandalone(checkStandalone());

    // Register Service Worker if it's not already
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW registration successful with scope: ', reg.scope);
      });
    }

    // Capture the PWA install prompt event (Android/Chrome/Brave)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!checkStandalone()) {
        setTimeout(() => setShowAndroidPrompt(true), 3000);
      }
    };

    // Detect iOS to show manual instructions (as Apple doesn't support the prompt event)
    const detectIOS = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isIOS && !checkStandalone()) {
        setShowIOSPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    detectIOS();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  // If already installed, don't show anything
  if (isStandalone) return null;

  return (
    <>
      {/* Android/Brave/Chrome Prompt */}
      {showAndroidPrompt && (
        <div className="fixed bottom-6 left-6 right-6 z-[9999] md:left-auto md:max-w-xs animate-fade-in-up">
          <div className="glass-light backdrop-blur-xl border border-white/40 p-5 rounded-[2.5rem] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 flex items-center justify-center shadow-lg transform rotate-3">
                <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-exrabold text-emerald-950 text-base leading-tight">تثبيت التطبيق</h3>
                <p className="text-emerald-800 text-[11px] opacity-70">تمتع بكامل خدمات المنصة بلمسة زر</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAndroidPrompt(false)}
                className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-gray-500 bg-gray-100/50 hover:bg-gray-200 transition-all"
              >
                تجاهل
              </button>
              <button 
                onClick={handleInstallClick}
                className="flex-[2] py-3 px-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200/50 transition-all active:scale-95"
              >
                تثبيت الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS (iPhone/Safari) Instruction Popover */}
      {showIOSPrompt && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-sm animate-fade-in-up">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src="/icon-192x192.png" alt="Icon" className="w-10 h-10 rounded-xl" />
                <span className="font-bold text-sm text-gray-800">تثبيت مشاعل المعرفة</span>
              </div>
              <button onClick={() => setShowIOSPrompt(false)} className="text-gray-400 p-1">×</button>
            </div>
            
            <p className="text-[12px] text-gray-600 leading-relaxed text-center px-2">
              لتثبيت التطبيق على جهاز الـ iPhone الخاص بك، اضغط على زر <span className="bg-gray-100 p-1 rounded font-bold">المشاركة (Share)</span> في المتصفح ثم اختر <span className="font-bold">"إضافة إلى الشاشة الرئيسية"</span>.
            </p>

            <div className="flex justify-center gap-4 py-2 border-t border-gray-100">
               <div className="flex flex-col items-center gap-1">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM11,7h2v6H11Zm0,8h2v2H11Z"/></svg>
                 </div>
                 <span className="text-[9px] text-gray-400">1. زر المشاركة</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                 </div>
                 <span className="text-[9px] text-gray-400">2. إضافة للشاشة</span>
               </div>
            </div>
          </div>
          {/* Subtle pointer towards the share icon in Safari bottom center */}
          <div className="w-6 h-6 bg-white rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 -z-10 shadow-lg"></div>
        </div>
      )}
    </>
  );
}
