import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';
import { NavigationContainer } from '@react-navigation/native';

// Auth Screens
import CompleteProfileScreen from '../screens/Auth/CompleteProfileScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

// Home Screens
import WelcomeScreen from '../screens/Home/WelcomeScreen';
import AboutScreen from '../screens/Home/AboutScreen';

// Product Screens
import CakesScreen from '../screens/Products/CakesScreen';
import ChocolatesScreen from '../screens/Products/ChocolatesScreen';
import CookiesScreen from '../screens/Products/CookiesScreen';
import MoreItemsScreen from '../screens/Products/MoreItemsScreen';

// Order Screens
import OrderHistoryScreen from '../screens/Orders/OrderHistoryScreen';
import OrderFlowScreen from '../screens/Orders/OrderFlowScreen';
import CustomerDetailsScreen from '../screens/Orders/CustomerDetailsScreen';
import PaymentScreen from '../screens/Orders/PaymentScreen';
import OrderSuccessScreen from '../screens/Orders/OrderSuccessScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import DashboardScreen from '../screens/Admin/DashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {

  // 🔥 Deep Link Handler (unchanged)
  const handleDeepLink = async (url, navigation) => {
    if (!url) return;
    try {
      const { queryParams } = Linking.parse(url);
      const token = queryParams?.token;
      if (!token) return;

      await axiosInstance.get(`/api/auth/magic-verify?token=${token}`);
      await AsyncStorage.setItem("token", token);

      const res = await axiosInstance.get("/api/auth/me");
      const user = res.data.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigation.replace("AdminDashboard");
      } else if (!user.profileCompleted) {
        navigation.replace("CompleteProfile");
      } else {
        navigation.replace("Welcome");
      }

    } catch (err) {
      console.log("Deep Link Error 👉", err?.response?.data || err.message);
    }
  };

  return (
    <NavigationContainer linking={{ prefixes: ['sandyapp://'] }} fallback={null}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fffbeb' } }}
      >

        {/* Authentication */}
        <Stack.Screen name="Login">
          {(props) => {
            useEffect(() => {
              Linking.getInitialURL().then((url) => handleDeepLink(url, props.navigation));
              const sub = Linking.addEventListener("url", (event) => handleDeepLink(event.url, props.navigation));
              return () => sub.remove();
            }, []);

            // ✅ First app entry: always show Login
            // ✅ Old users handled in OTPScreen or Login success
            return <LoginScreen {...props} />;
          }}
        </Stack.Screen>

        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />

        {/* Home */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />

        {/* Products */}
        <Stack.Screen name="Cakes" component={CakesScreen} />
        <Stack.Screen name="Chocolates" component={ChocolatesScreen} />
        <Stack.Screen name="Cookies" component={CookiesScreen} />
        <Stack.Screen name="MoreItems" component={MoreItemsScreen} />

        {/* Orders */}
        <Stack.Screen name="OrderFlow" component={OrderFlowScreen} />
        <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />

        {/* Admin */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;