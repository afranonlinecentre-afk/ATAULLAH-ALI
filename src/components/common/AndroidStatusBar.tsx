import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface AndroidStatusBarProps {
  dark?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('10:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // When running inside the native Android APK (Capacitor) or in standalone mobile mode,
  // the Android OS already provides the real system status bar. Do not render a fake one.
  const isRealNativeApp = Capacitor.isNativePlatform() || 
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

  if (isRealNativeApp) {
    return null;
  }

  return (
    <div
      className={`w-full px-5 py-1.5 flex items-center justify-between text-xs select-none ${
        dark ? 'bg-slate-900 text-slate-200' : 'bg-[#1267B1] text-white'
      }`}
    >
      <div className="font-semibold tracking-wide flex items-center gap-1.5">
        <span>{time}</span>
        <span className="text-[10px] font-normal opacity-75">Jio 5G</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium tracking-tight">VoLTE</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">92%</span>
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
