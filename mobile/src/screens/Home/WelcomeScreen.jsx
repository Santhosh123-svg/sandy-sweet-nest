import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Linking,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [role, setRole] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const navbarAnim = useRef(new Animated.Value(-100)).current;
  const footerAnim = useRef(new Animated.Value(50)).current;
  const orderBtnScale = useRef(new Animated.Value(1)).current;
  const categoryAnimValues = useRef([]).current;

  // Social icon animation refs
  const instaScale = useRef(new Animated.Value(1)).current;
  const fbScale = useRef(new Animated.Value(1)).current;
  const waScale = useRef(new Animated.Value(1)).current;

  // BackHandler subscription ref
  const backHandlerSub = useRef(null);

  const categories = [
    { name: "Cakes", desc: "Birthday • Wedding • Special", color: "#fde68a" },
    { name: "Chocolates", desc: "Gift boxes • Special", color: "#fcd34d" },
    { name: "Cookies", desc: "Choco chips • Oats", color: "#fde68a" },
    { name: "More Items", desc: "Brownies • Pastries", color: "#fcd34d" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const userRole = await AsyncStorage.getItem("role");
      setRole(userRole || "");
    };
    loadUser();

    // Loader spin
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    rotation.start();

    // Main content animation
    const timer = setTimeout(() => {
      setShowIntro(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(navbarAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
        Animated.spring(footerAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
      ]).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // BackHandler: Block hardware back press (prevents going back after logout)
  useEffect(() => {
    backHandlerSub.current = BackHandler.addEventListener("hardwareBackPress", () => {
      return true; // Block back navigation
    });

    return () => {
      if (backHandlerSub.current) {
        backHandlerSub.current.remove();
      }
    };
  }, []);

  // Initialize category animations
  if (categoryAnimValues.length === 0) {
    categories.forEach(() => categoryAnimValues.push(new Animated.Value(0)));
  }

  const handleShowCategories = () => {
    animateButtonPress();
    setShowCategories(true);
    Animated.stagger(
      150,
      categoryAnimValues.map((anim) =>
        Animated.spring(anim, { toValue: 1, friction: 7, useNativeDriver: true })
      )
    ).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(orderBtnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(orderBtnScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleCategoryClick = (name) => {
    if (name === "Cakes") navigation.navigate("Cakes");
    if (name === "Chocolates") navigation.navigate("Chocolates");
    if (name === "Cookies") navigation.navigate("Cookies");
    if (name === "More Items") navigation.navigate("MoreItems");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role", "user", "phone"]);
      setShowMobileMenu(false);

      // ✅ Reset to Login safely
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Something went wrong while logging out");
    }
  };

  const openSocialLink = (url, anim) => {
    // Animate icon tap
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.2, friction: 4, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open link"));
  };

  // 🍰 Intro Loader
  if (showIntro) {
    const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
    return (
      <View style={styles.loaderContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Text style={styles.cakeEmoji}>🍰</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fffbeb" />

      {/* Navbar */}
      <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarAnim }] }]}>
        <View style={styles.navLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🍰</Text>
          </View>
          <View>
            <Text style={styles.brandName}>Sandy's Sweet Nest</Text>
            <Text style={styles.tagline}>Bright • Creamy • Yummy</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Ionicons name="menu" size={28} />
        </TouchableOpacity>

        {showMobileMenu && (
          <Animated.View style={styles.mobileMenu}>
            {role === "admin" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("AdminDashboard")}
              >
                <Ionicons name="grid" size={20} color="#b45309" />
                <Text style={styles.menuText}>Dashboard</Text>
              </TouchableOpacity>
            )}
            {role === "user" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("OrderHistory")}
              >
                <Ionicons name="bag" size={20} color="#d97706" />
                <Text style={styles.menuText}>My Orders</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("About")}
            >
              <Ionicons name="information-circle" size={20} color="#d97706" />
              <Text style={styles.menuText}>About</Text>
            </TouchableOpacity>
            {role === "user" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("CompleteProfile")}
              >
                <Ionicons name="person" size={20} />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {/* Main */}
      <ScrollView contentContainerStyle={styles.main}>
        {!showCategories ? (
          <View style={styles.welcomeCard}>
            <Text style={styles.title}>Welcome to{"\n"}Sandy's Sweet Nest</Text>
            <Text style={styles.description}>
              Order fresh cakes, chocolates, cookies and more.{"\n"}
              <Text style={styles.highlight}>
                Fast delivery • Fresh taste • Easy checkout
              </Text>
            </Text>

            <View style={styles.buttonRow}>
              <Animated.View style={{ transform: [{ scale: orderBtnScale }] }}>
                <TouchableOpacity style={styles.orderBtn} onPress={handleShowCategories}>
                  <Text style={styles.orderText}>Order Now</Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.aboutBtn}
                onPress={() => navigation.navigate("About")}
              >
                <Text style={styles.aboutText}>About Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Choose your category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat, i) => (
                <Animated.View
                  key={i}
                  style={{
                    opacity: categoryAnimValues[i],
                    transform: [
                      {
                        translateY: categoryAnimValues[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                    width: "100%",
                    marginBottom: 16,
                  }}
                >
                  <TouchableOpacity
                    style={[styles.categoryCard, { backgroundColor: cat.color }]}
                    onPress={() => handleCategoryClick(cat.name)}
                  >
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryDesc}>{cat.desc}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <Animated.View style={[styles.footer, { transform: [{ translateY: footerAnim }] }]}>
        <Text style={styles.copy}>© 2026 Sandy's Sweet Nest • All Rights Reserved</Text>
        <View style={styles.social}>
          <TouchableOpacity onPress={() => openSocialLink("https://www.instagram.com/_jith__sandy_?igsh=ZzVteXU1N2Jjemdi", instaScale)}>
            <Animated.View style={{ transform: [{ scale: instaScale }] }}>
              <Ionicons name="logo-instagram" size={28} color="#d97706" />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openSocialLink("https://www.facebook.com/profile.php?id=100088894746265", fbScale)}>
            <Animated.View style={{ transform: [{ scale: fbScale }] }}>
              <Ionicons name="logo-facebook" size={28} color="#1877f2" />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openSocialLink("https://wa.me/916374122294", waScale)}>
            <Animated.View style={{ transform: [{ scale: waScale }] }}>
              <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbeb" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fffbeb" },
  cakeEmoji: { fontSize: 100 },
  navbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 40, backgroundColor: "#ffffffcc", zIndex: 10 },
  navLeft: { flexDirection: "row", alignItems: "center" },
  logoBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#fde68a", justifyContent: "center", alignItems: "center", marginRight: 12 },
  logoEmoji: { fontSize: 28 },
  brandName: { fontWeight: "900", color: "#d97706", fontSize: 20 },
  tagline: { fontSize: 14, color: "#6b7280" },
  menuButton: { padding: 10, backgroundColor: "#fff", borderRadius: 8 },
  mobileMenu: { position: "absolute", top: 70, right: 20, backgroundColor: "#ffffffee", padding: 16, borderRadius: 16, elevation: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 8, zIndex: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 10 },
  menuText: { marginLeft: 12, fontWeight: "700", fontSize: 16 },
  main: { padding: 20, paddingBottom: 80 },
  welcomeCard: { backgroundColor: "#ffffffdd", padding: 30, borderRadius: 28, marginTop: 20 },
  title: { fontSize: 38, fontWeight: "900", color: "#d97706" },
  description: { marginTop: 12, fontSize: 16, color: "#4b5563" },
  highlight: { color: "#f59e0b", fontWeight: "700" },
  buttonRow: { flexDirection: "row", marginTop: 24 },
  orderBtn: { backgroundColor: "#f59e0b", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginRight: 12 },
  orderText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  aboutBtn: { backgroundColor: "#fff", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: "#fde68a" },
  aboutText: { color: "#b45309", fontWeight: "800", fontSize: 18 },
  categoriesCard: { backgroundColor: "#ffffffdd", padding: 24, borderRadius: 28, marginTop: 20 },
  categoriesTitle: { fontSize: 24, fontWeight: "900", color: "#d97706", textAlign: "center", marginBottom: 20 },
  categoriesGrid: { flexDirection: "column", width: "100%" },
  categoryCard: { width: "100%", padding: 20, borderRadius: 20, elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 8 },
  categoryName: { fontWeight: "900", fontSize: 18, color: "#b45309", marginBottom: 6 },
  categoryDesc: { fontSize: 14, color: "#6b7280" },
  footer: { padding: 20, alignItems: "center" },
  copy: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  social: { flexDirection: "row", gap: 25 },
});

export default WelcomeScreen;
