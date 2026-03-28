import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const Splash = ({ navigation }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const load = async () => {
      await SplashScreen.hideAsync(); // Hide default Expo splash

      // Animation sequence
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();

      // Wait 4.5 sec and navigate to Login
      setTimeout(() => {
        navigation.replace("Login");
      }, 4500);
    };

    load();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/LOGO2.jpeg")}
        style={{
          width: 180,
          height: 180,
          opacity,
          transform: [{ scale }, { rotate: rotation }],
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbeb",
    justifyContent: "center",
    alignItems: "center",
  },
});