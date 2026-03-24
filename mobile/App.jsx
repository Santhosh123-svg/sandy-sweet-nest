import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { OrderProvider } from './src/context/OrderContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useEffect } from 'react';

export default function App() {

  useEffect(() => {
    // 🔔 Notification setup (unchanged)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <OrderProvider>
      {/* ✅ Navigation handled inside AppNavigator */}
      <AppNavigator />
      <StatusBar style="auto" />
    </OrderProvider>
  );
}