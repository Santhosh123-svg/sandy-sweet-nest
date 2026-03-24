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
import axiosInstance from "../../utils/axiosInstance";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // 🎬 Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

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

  // 📝 REGISTER SEND OTP FUNCTION (UNCHANGED)
  const handleSignup = async () => {
    const trimmedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!trimmedName || !normalizedEmail || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/api/auth/register/send-otp", {
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      navigation.navigate("Otp", { email: normalizedEmail, flow: "register" });

    } catch (err) {
      console.log("SEND OTP ERROR 👉", err?.response?.data || err.message);

      Alert.alert(
        "OTP Send Failed",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const pressIn = () => {
    Animated.spring(scaleBtn, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleBtn, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
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
        <Text style={styles.title}>Create Account 🍰</Text>

        {/* NAME */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* GENERATE OTP BUTTON */}
        <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleSignup}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Generate OTP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* LOGIN NAVIGATION */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.bottomText}>
            Already have an account?{" "}
            <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 320,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 25,

    // 💎 Premium shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d97706",
    textAlign: "center",
    marginBottom: 22,
    letterSpacing: 0.5,
  },

  inputWrapper: {
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "#fff",

    shadowColor: "#f59e0b",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#f59e0b",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,

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
    letterSpacing: 0.5,
  },

  link: {
    color: "#d97706",
    fontWeight: "bold",
  },

  bottomText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
  },
});