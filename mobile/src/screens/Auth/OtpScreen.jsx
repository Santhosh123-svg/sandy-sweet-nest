import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigation, useRoute } from "@react-navigation/native";

const OtpScreen = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const email = route?.params?.email;
  const flow = route?.params?.flow || "register";

  // 🎬 Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      triggerShake();
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      if (flow === "forgot-password") {
        await axiosInstance.post("/api/auth/forgot-password/verify-otp", {
          email,
          otp,
        });
        navigation.replace("ResetPassword", { email });
      } else {
        await axiosInstance.post("/api/auth/register/verify-otp", {
          email,
          otp,
        });
        await AsyncStorage.removeItem("token");
        Alert.alert("Success", "Account created successfully", [
          { text: "OK", onPress: () => navigation.replace("Login") },
        ]);
      }

    } catch (err) {
      triggerShake();
      console.log("OTP ERROR 👉", err?.response?.data || err.message);

      const statusCode = err?.response?.status;
      const message = err.response?.data?.message || "OTP verification failed";

      Alert.alert(
        statusCode === 429 ? "Wait Before Retry" : "Invalid OTP",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !email || resending) return;

    try {
      setResending(true);
      await axiosInstance.post("/api/auth/register/send-otp", { email });
      setTimer(60);
      Alert.alert("Success", "OTP sent again");
    } catch (err) {
      const statusCode = err?.response?.status;
      if (statusCode === 429) {
        Alert.alert("Wait", err?.response?.data?.message || "Please wait before retrying");
      } else {
        Alert.alert("Error", "Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  const pressIn = () => {
    Animated.spring(scaleBtn, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleBtn, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>Verify OTP 🔐</Text>

        <Text style={styles.subText}>OTP sent to {email}</Text>

        {/* OTP INPUT */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TextInput
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={otp}
            onChangeText={(value) => setOtp(value.replace(/\D/g, ""))}
            keyboardType="numeric"
            maxLength={6}
          />
        </Animated.View>

        {/* VERIFY BUTTON */}
        <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleVerifyOtp}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* RESEND */}
        {timer > 0 ? (
          <Text style={styles.link}>Resend OTP in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
            <Text style={[styles.link, resending && styles.linkDisabled]}>
              {resending ? "Resending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fde68a",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 320,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 25,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d97706",
    textAlign: "center",
    marginBottom: 10,
  },

  subText: {
    textAlign: "center",
    marginBottom: 18,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 8,

    shadowColor: "#f59e0b",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  button: {
    backgroundColor: "#f59e0b",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",

    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  disabled: {
    backgroundColor: "#fcd34d",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    color: "#d97706",
    textAlign: "center",
    marginTop: 14,
  },

  linkDisabled: {
    color: "#9ca3af",
  },
});