import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const cakeImages = [
  require("../../assets/images/cakes1.jpeg"),
  require("../../assets/images/cakes2.jpeg"),
  require("../../assets/images/cakes3.jpeg"),
  require("../../assets/images/cakes4.jpg"),
  require("../../assets/images/cakes5.jpeg"),
];

const AboutScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);

  // Slider animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Hero pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Footer fade animation
  const footerFade = useRef(new Animated.Value(0)).current;

  // Social icon scales
  const instaScale = useRef(new Animated.Value(1)).current;
  const fbScale = useRef(new Animated.Value(1)).current;
  const waScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => next(), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const next = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setIndex((i) => (i + 1) % cakeImages.length);
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const prev = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 30, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setIndex((i) => (i - 1 + cakeImages.length) % cakeImages.length);
      fadeAnim.setValue(0);
      slideAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const openLink = async (url, anim) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.3, friction: 4, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    try {
      await Linking.openURL(url);
    } catch (err) {
      console.log("Cannot open link");
    }
  };

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 500) {
      Animated.timing(footerFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#b45309" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 70 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Animated.Text style={[styles.heroTitle, { transform: [{ scale: pulseAnim }] }]}>
            🍰 Welcome to Sandy's Sweet Nest
          </Animated.Text>

          <View style={styles.heroSubtitleRow}>
            <Ionicons name="heart" size={16} color="#ec4899" />
            <Text style={styles.heroSubtitle}> Every Cake Made With Love</Text>
          </View>

          <Text style={styles.heroDescription}>
            Step into a world where every creation is crafted with love,
            passion, and the finest ingredients. From intimate celebrations
            to grand occasions, we turn your sweetest dreams into{" "}
            <Text style={styles.highlight}>delicious reality.</Text>
          </Text>
        </View>

        {/* CREATIONS */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="nutrition" size={24} color="#d97706" />
            <Text style={styles.sectionTitle}> Our Delicious Creations</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Animated.Image
              source={cakeImages[index]}
              style={[
                styles.sliderImage,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.navButton} onPress={prev}>
              <Ionicons name="chevron-back" size={20} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.navButtonRight]}
              onPress={next}
            >
              <Ionicons name="chevron-forward" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SHOPS */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="storefront" size={24} color="#d97706" />
            <Text style={styles.sectionTitle}> Visit Our Shops</Text>
          </View>

          {[{
            title: "Downtown Flagship",
            image: require("../../assets/images/shop1.jpeg"),
            address: "66/1 2nd Market Street, Ammapet, Salem",
            landmark: "SKT Text Opposite",
            time: "9 AM – 9 PM",
          }, {
            title: "Suburb Branch",
            image: require("../../assets/images/shop2.jpeg"),
            address: "24B Alazhgapan Street, Ammapet, Salem",
            landmark: "Kamarajar Statue Near",
            time: "10 AM – 10 PM",
          }].map((shop, idx) => (
            <View key={idx} style={styles.shopCard}>
              <Image source={shop.image} style={styles.shopImage} />
              <Text style={styles.shopTitle}>{shop.title}</Text>
              <View style={styles.row}>
                <Ionicons name="location" size={16} color="#f59e0b" />
                <Text style={styles.locationText}>{shop.address}</Text>
              </View>
              <Text style={styles.landmarkText}>{shop.landmark}</Text>
              <View style={styles.row}>
                <Ionicons name="time" size={16} color="#f59e0b" />
                <Text style={styles.timeText}>{shop.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* JOURNEY */}
        <View style={styles.journeySection}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="book" size={24} color="#d97706" />
            <Text style={styles.sectionTitle}> Our Sweet Journey</Text>
          </View>

          <Text style={styles.journeyText}>
            Founded in 2020 with a dream to bring artisanal baking to our
            community, Sandy's Sweet Nest has become the heart of countless
            celebrations. We don't just bake cakes —{" "}
            <Text style={styles.highlight}>we create memories that last a lifetime.</Text>
          </Text>
        </View>

        {/* FOOTER */}
        <Animated.View style={[styles.footer, { opacity: footerFade }]}>
          <Text style={styles.footerText}>© 2026 Sandy's Sweet Nest. Made with 💝</Text>

          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() =>
              openLink("https://www.instagram.com/_jith__sandy_?igsh=ZzVteXU1N2Jjemdi", instaScale)
            }>
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: instaScale }] }]}>
                <Ionicons name="logo-instagram" size={28} color="#d97706" />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() =>
              openLink("https://www.facebook.com/profile.php?id=100088894746265", fbScale)
            }>
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: fbScale }] }]}>
                <Ionicons name="logo-facebook" size={28} color="#1877f2" />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() =>
              openLink("https://wa.me/916374122294", waScale)
            }>
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: waScale }] }]}>
                <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbeb" },

  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },

  hero: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, alignItems: "center" },
  heroTitle: { fontSize: 28, fontWeight: "800", color: "#d97706", textAlign: "center", marginBottom: 12 },
  heroSubtitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  heroSubtitle: { fontSize: 16, fontWeight: "700", color: "#f59e0b" },
  heroDescription: { fontSize: 15, color: "#4b5563", textAlign: "center", lineHeight: 24 },
  highlight: { color: "#d97706", fontWeight: "700" },

  section: { paddingVertical: 40, paddingHorizontal: 24 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#d97706" },

  sliderContainer: { alignSelf: "center", width: "100%", maxWidth: 380 },
  sliderImage: { width: "100%", height: 280, borderRadius: 28 },
  navButton: { position: "absolute", left: 10, top: "50%", marginTop: -22, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center", elevation: 5 },
  navButtonRight: { left: undefined, right: 10 },

  shopCard: { backgroundColor: "#ffffff", borderRadius: 28, padding: 20, marginBottom: 20, elevation: 5 },
  shopImage: { width: "100%", height: 200, borderRadius: 18, marginBottom: 16 },
  shopTitle: { fontSize: 20, fontWeight: "800", color: "#d97706", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  locationText: { fontSize: 14, fontWeight: "600", marginLeft: 6 },
  landmarkText: { fontSize: 12, color: "#9ca3af", marginLeft: 22, marginBottom: 6 },
  timeText: { fontSize: 14, fontWeight: "600", marginLeft: 6 },

  journeySection: { padding: 24, backgroundColor: "#ffffff", margin: 20, borderRadius: 28 },
  journeyText: { fontSize: 15, textAlign: "center", lineHeight: 24, color: "#4b5563" },

  footer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  footerText: { fontSize: 13, color: "#6b7280", marginBottom: 20 },
  socialIcons: { flexDirection: "row", gap: 24 },

  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
});