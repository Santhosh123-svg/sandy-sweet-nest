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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
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

  const handleLogin = async () => {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/auth/login", {
        email: normalizedEmail,
        password,
      });

      const { token, user } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("role", user.role || "user");
      await AsyncStorage.setItem(
        "profileCompleted",
        JSON.stringify(Boolean(user.profileCompleted))
      );

      if (user.role === "admin") {
        navigation.replace("AdminDashboard");
      } else if (!user.profileCompleted) {
        navigation.replace("CompleteProfile");
      } else {
        navigation.replace("Welcome");
      }
    } catch (err) {
      console.log("LOGIN ERROR 👉", err?.response?.data || err.message);

      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Unable to login"
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
        <Text style={styles.title}>Welcome Back 🍰</Text>

        {/* EMAIL */}
        <Animated.View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Animated.View>

        {/* PASSWORD */}
        <Animated.View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animated.View>

        {/* LOGIN BUTTON */}
        <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleLogin}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.bottomText}>
            New User? <Text style={styles.linkInline}>Register</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Login;

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

    // 💎 Premium shadow
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
    marginBottom: 25,
    letterSpacing: 0.5,
  },

  inputWrapper: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",

    // subtle glow
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
    backgroundColor: "#fff",
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
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
  },

  bottomText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },

  linkInline: {
    color: "#d97706",
    fontWeight: "bold",
  },
});