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
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎬 Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const focusAnim1 = useRef(new Animated.Value(0)).current;
  const focusAnim2 = useRef(new Animated.Value(0)).current;

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

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    const password = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!email) {
      Alert.alert("Error", "Session expired. Please try again.");
      navigation.replace("Login");
      return;
    }

    if (!password || !confirm) {
      triggerShake();
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirm) {
      triggerShake();
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/api/auth/reset-password", {
        email,
        newPassword: password,
      });

      Alert.alert("Success", "Password reset successful", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (err) {
      console.log("RESET ERROR 👉", err?.response?.data);

      Alert.alert(
        "Failed",
        err?.response?.data?.message || "Unable to reset password"
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

  const getBorder = (anim) =>
    anim.interpolate({
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
        {/* ICON */}
        <Text style={styles.icon}>🔑</Text>

        <Text style={styles.title}>Reset Password</Text>

        {/* NEW PASSWORD */}
        <Animated.View style={[styles.inputWrapper, { borderColor: getBorder(focusAnim1) }]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            onFocus={() =>
              Animated.timing(focusAnim1, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
              }).start()
            }
            onBlur={() =>
              Animated.timing(focusAnim1, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start()
            }
          />
        </Animated.View>

        {/* CONFIRM PASSWORD */}
        <Animated.View style={[styles.inputWrapper, { borderColor: getBorder(focusAnim2) }]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onFocus={() =>
              Animated.timing(focusAnim2, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
              }).start()
            }
            onBlur={() =>
              Animated.timing(focusAnim2, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start()
            }
          />
        </Animated.View>

        {/* BUTTON */}
        <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
          <TouchableOpacity
            style={[styles.button, (loading || !email) && styles.disabled]}
            onPress={handleSubmit}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading || !email}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* SHAKE WRAPPER */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }} />
      </Animated.View>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: 18,
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
});