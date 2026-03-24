import React, { useState, useRef, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎬 Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;

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

  const handleSendOtp = async () => {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/api/auth/forgot-password/send-otp", {
        email: normalizedEmail,
      });
      navigation.navigate("Otp", { email: normalizedEmail, flow: "forgot-password" });
    } catch (err) {
      Alert.alert(
        "Failed",
        err?.response?.data?.message || "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const pressIn = () => {
    Animated.spring(scaleBtn, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleBtn, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#eee", "#f59e0b"],
  });

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
        {/* ICON HEADER */}
        <Text style={styles.icon}>🔐</Text>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subText}>Enter your email to receive OTP</Text>

        {/* EMAIL INPUT */}
        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
          <Text style={styles.inputIcon}>📧</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Animated.View>

        {/* BUTTON */}
        <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleSendOtp}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* BACK */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ForgotPasswordScreen;

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
    padding: 24,
    borderRadius: 25,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 10,
  },

  icon: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d97706",
    textAlign: "center",
  },

  subText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 18,
    marginTop: 4,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    marginBottom: 14,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 6,
  },

  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
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

  backText: {
    textAlign: "center",
    marginTop: 16,
    color: "#d97706",
    fontWeight: "500",
  },
});