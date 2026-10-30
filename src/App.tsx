/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminApp } from './components/admin/AdminApp';
import { testFirestoreConnection } from './lib/firebase';
import { Monitor } from 'lucide-react';

const MainAppRouter: React.FC = () => {
  const { activeApp, setActiveApp } = useAuth();

  // Detect whether we are running in the production Android APK or standalone full-screen mobile mode
  const [isStandaloneApp, setIsStandaloneApp] = useState<boolean>(() => {
    // 1. Native Capacitor detection (Android APK build)
    if (Capacitor.isNativePlatform()) return true;

    if (typeof window !== 'undefined') {
      // 2. Check for Capacitor injected runtime or custom scheme
      const isCapacitorScheme =
        window.location.protocol === 'capacitor:' ||
        (window.location.hostname === 'localhost' && !window.location.port && window.location.protocol === 'https:');
      if (isCapacitorScheme) return true;

      // 3. Standalone PWA / WebApp mode
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;

      // 4. URL parameter explicit mode: ?standalone=true or ?app=customer or ?mode=app
      const params = new URLSearchParams(window.location.search);
      if (params.get('standalone') === 'true' || params.get('mode') === 'app' || params.get('app') === 'customer') {
        return true;
      }
    }
    return false;
  });

  // On native Android APK launch, ensure customer app is the initial active screen
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const savedApp = localStorage.getItem('aoc_active_app');
      if (!savedApp) {
        setActiveApp('customer');
      }
    }
  }, [setActiveApp]);

  // Production Android APK & Standalone Full-screen Mode
  // Clean, full-screen, responsive application without any outer mockups, device borders, or demo frames
  if (isStandaloneApp) {
    return (
      <div className="w-full h-[100dvh] min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col overflow-hidden relative select-none">
        {activeApp === 'customer' ? <CustomerApp /> : <AdminApp />}

        {/* If user on desktop web manually tested standalone mode, provide a subtle toggle to return to preview dashboard */}
        {!Capacitor.isNativePlatform() && (
          <button
            onClick={() => setIsStandaloneApp(false)}
            className="fixed bottom-20 right-4 z-50 bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Return to Website Preview Dashboard"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>ওয়েব ড্যাশবোর্ড (Web Preview)</span>
          </button>
        )}
      </div>
    );
  }

  // Desktop Web Preview & Testing Dashboard
  return <DeviceFrame onLaunchFullscreen={() => setIsStandaloneApp(true)} />;
};

export default function App() {
  useEffect(() => {
    // Validate connection to Firestore as mandated by the Firebase skill
    testFirestoreConnection();
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <MainAppRouter />
      </AppProvider>
    </AuthProvider>
  );
}
