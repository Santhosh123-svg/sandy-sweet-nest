import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

const { width, height } = Dimensions.get("window");

const Splash = ({ navigation }) => {
  // Main animations
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  
  // New particle animations
  const particles = useRef(Array.from({ length: 12 }, () => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(height),
    scale: new Animated.Value(0),
    rotate: new Animated.Value(0),
  }))).current;
  
  // Shine effect
  const shineAnim = useRef(new Animated.Value(0)).current;
  const shinePosition = useRef(new Animated.Value(-width * 2)).current;
  
  // Pulse effects
  const titlePulse = useRef(new Animated.Value(1)).current;
  const cakeBounce = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  
  // Sparkle stars
  const stars = useRef(Array.from({ length: 8 }, () => ({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;
  
  const [loading, setLoading] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const load = async () => {
      await SplashScreen.hideAsync();

      // Mega entrance animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Multi-layered floating
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -15,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 8,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Enhanced background gradient pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(bgAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Continuous shine effect across title
      Animated.loop(
        Animated.sequence([
          Animated.timing(shinePosition, {
            toValue: width * 2,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(shinePosition, {
            toValue: -width * 2,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Title breathing pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(titlePulse, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(titlePulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Cake bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(cakeBounce, {
            toValue: -10,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(cakeBounce, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Heart ring rotation
      Animated.loop(
        Animated.timing(ringRotation, {
          toValue: 360,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Particle explosion
      particles.forEach((particle, i) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(particle.opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(particle.scale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: 0,
              duration: 1000 + i * 100,
              useNativeDriver: true,
            }),
            Animated.timing(particle.rotate, {
              toValue: 360,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]).start();
        }, i * 80);
      });

      // Sparkle stars
      stars.forEach((star, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(star.opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(star.scale, {
                toValue: 1.4,
                duration: 500,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(star.opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(star.scale, {
                toValue: 0.8,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });

      // Loading percentage with smooth animation
      let value = 0;
      const interval = setInterval(() => {
        value += Math.random() * 3 + 1;
        if (value > 100) value = 100;
        setLoading(Math.floor(value));

        if (value >= 100) {
          clearInterval(interval);
          // Final celebration animation
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.replace("Login");
          });
        }
      }, 30);

      // Enhanced dots animation
      let dotCount = 0;
      setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setDots(".".repeat(dotCount));
      }, 350);

      // Multi-stage progress bar
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 0.7,
          duration: 2000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.elastic(1)),
          useNativeDriver: false,
        }),
      ]).start();
    };

    load();
  }, []);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "102%"],
  });

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#fffbeb", "#fed7aa"],
  });

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      
      {/* Floating Particles Background */}
      {particles.map((particle, i) => (
        <Animated.View
          key={`particle-${i}`}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateY: particle.translateY },
                { scale: particle.scale },
                { rotate: particle.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                }) }
              ],
              left: `${10 + (width - 100) * (i % 4) / 3}%`,
              top: `${20 + (height * 0.4) * Math.floor(i / 4) / 3}%`,
            },
          ]}
        />
      ))}

      {/* Sparkle Stars */}
      {stars.map((star, i) => (
        <Animated.View
          key={`star-${i}`}
          style={[
            styles.sparkle,
            {
              opacity: star.opacity,
              transform: [{ scale: star.scale }],
              top: 100 + (i * 60) % 300,
              left: 50 + ((i * 37) % 100),
            },
          ]}
        >
          <Text style={styles.starText}>✨</Text>
        </Animated.View>
      ))}

      {/* Main Content */}
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }, { translateY: floatAnim }],
        }}
      >
        {/* Rotating Heart Ring */}
        <Animated.View
          style={[
            styles.heartRing,
            {
              transform: [{ rotate: ringRotation.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
              }) }],
            },
          ]}
        >
          <Text style={styles.heart}>💖</Text>
        </Animated.View>

        {/* Shine Effect Overlay */}
        <Animated.View
          style={[
            styles.shineEffect,
            {
              transform: [{ translateX: shinePosition }],
              opacity: shineOpacity,
            },
          ]}
        />

        {/* Enhanced Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ scale: titlePulse }],
            },
          ]}
        >
          Sandy's Sweet Nest
          <Animated.Text style={styles.cakeEmoji}>
            {cakeBounce && (
              <Animated.Text
                style={{
                  transform: [{ translateY: cakeBounce }],
                }}
              >
                🍰
              </Animated.Text>
            )}
          </Animated.Text>
        </Animated.Text>

        {/* Enhanced Tagline */}
        <Animated.Text style={[styles.tagline, { opacity }]}>
          Made with Love & Sugar ❤️
        </Animated.Text>
      </Animated.View>

      {/* Enhanced Loading Text */}
      <Animated.Text style={[styles.loadingText, { opacity }]}>
        Loading{dots} {loading}%
      </Animated.Text>

      {/* Multi-layered Progress Bar */}
      <Animated.View style={[styles.progressContainer, { opacity }]}>
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: widthInterpolate,
                backgroundColor: "#f97316",
                shadowColor: "#f97316",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 10,
              },
            ]}
          />
          <View style={styles.progressGlow} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "rgba(253, 116, 22, 0.6)",
    borderRadius: 4,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  sparkle: {
    position: "absolute",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 15,
  },
  starText: {
    fontSize: 20,
    color: "#fbbf24",
  },
  heartRing: {
    position: "absolute",
    top: -80,
    left: "50%",
    marginLeft: -40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  heart: {
    fontSize: 32,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 12,
  },
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 60,
    zIndex: 3,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#d97706",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 15,
    textAlign: "center",
    marginBottom: 15,
    zIndex: 1,
  },
  cakeEmoji: {
    fontSize: 50,
    lineHeight: 50,
  },
  tagline: {
    fontSize: 16,
    color: "#7c2d12",
    fontWeight: "600",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: 18,
    color: "#444",
    fontWeight: "700",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    width: "80%",
    height: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  progressBg: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 20,
  },
  progressGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: "rgba(249, 115, 22, 0.3)",
    borderRadius: 22,
    zIndex: -1,
  },
});