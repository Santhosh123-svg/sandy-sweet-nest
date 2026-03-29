import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

const Splash = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const load = async () => {
      await SplashScreen.hideAsync();

      // Fade + scale
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating animation (loop)
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Loading %
      let value = 0;
      const interval = setInterval(() => {
        value += 1;
        setLoading(value);

        if (value >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigation.replace("Login");
          }, 500);
        }
      }, 30);

      // Progress bar
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    };

    load();
  }, []);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Shop Name */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity,
            transform: [{ scale }, { translateY: floatAnim }],
          },
        ]}
      >
        Sandy's Sweet Nest 🍰
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity }]}>
        Made with Love & Sugar ❤️
      </Animated.Text>

      {/* Loading % */}
      <Text style={styles.loadingText}>{loading}%</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[styles.progressBar, { width: widthInterpolate }]}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f97316", // rich orange
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
    marginBottom: 20,
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  progressContainer: {
    width: "70%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
  },
});