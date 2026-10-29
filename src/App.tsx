/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { testFirestoreConnection } from './lib/firebase';

export default function App() {
  useEffect(() => {
    // Validate connection to Firestore as mandated by the Firebase skill
    testFirestoreConnection();
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <DeviceFrame />
      </AppProvider>
    </AuthProvider>
  );
}
