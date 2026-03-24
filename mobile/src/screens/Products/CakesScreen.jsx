import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";

import cake1 from "../../assets/cakes/cake1.jpg";
import cake2 from "../../assets/cakes/cake2.jpg";
import cake3 from "../../assets/cakes/cake3.avif";
import cake4 from "../../assets/cakes/cake4.jpg";
import cake5 from "../../assets/cakes/cake5.avif";
import cake6 from "../../assets/cakes/cake6.webp";
import cake7 from "../../assets/cakes/cake7.webp";
import cake8 from "../../assets/cakes/cale7.webp";
import cake9 from "../../assets/cakes/cake9.webp";
import cake10 from "../../assets/cakes/cake10.webp";
import cake11 from "../../assets/cakes/cake11.jpg";
import cake12 from "../../assets/cakes/cake12.jpg";
import cake13 from "../../assets/cakes/cake13.webp";
import cake14 from "../../assets/cakes/cake14.jpg";
import cake15 from "../../assets/cakes/cake15.avif";
import cake16 from "../../assets/cakes/cake16.webp";
import cake17 from "../../assets/cakes/cake17.webp";
import cake18 from "../../assets/cakes/cake18.avif";
import cake19 from "../../assets/cakes/cake19.jpg";
import cake20 from "../../assets/cakes/cake20.jpg";
import cake21 from "../../assets/cakes/cake21.webp";
import cake22 from "../../assets/cakes/cake22.jpg";
import cake23 from "../../assets/cakes/cake23.jpg";
import cake24 from "../../assets/cakes/cake24.jpg";
import cake25 from "../../assets/cakes/cake25.webp";
import cake26 from "../../assets/cakes/cake26.jpg";
import cake27 from "../../assets/cakes/cake27.jpeg";
import cake28 from "../../assets/cakes/cake28.png";
import cake29 from "../../assets/cakes/cake29.webp";
import cake30 from "../../assets/cakes/cake30.webp";
import cake31 from "../../assets/cakes/cake31.webp";
import cake32 from "../../assets/cakes/cake32.webp";
import cake33 from "../../assets/cakes/cake33.jpg";
import cake34 from "../../assets/cakes/cake34.webp";
import cake35 from "../../assets/cakes/cake35.webp";
import cake36 from "../../assets/cakes/cake36.jpg";
import cake37 from "../../assets/cakes/cake37.jpg";
import cake38 from "../../assets/cakes/cake38.jpeg";
import cake39 from "../../assets/cakes/cake39.jpg";
import cake40 from "../../assets/cakes/cake40.webp";

const { width } = Dimensions.get("window");

const CakesScreen = ({ navigation }) => {
  const { placeOrder } = useOrder();

  const [eggType, setEggType] = useState(null);
  const [cakeType, setCakeType] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef({}).current;

  // ✅ FIX 3: Order navigation (ALWAYS next page)
  const handleOrder = (cake) => {
    setLoadingId(cake.id);

    placeOrder({
      productName: cake.name,
      price: cake.price,
      image: cake.image,
      quantity: 1,
      category: "cake",
    });

    navigation.push("OrderFlow"); // ✅ FIXED

    setTimeout(() => setLoadingId(null), 500);
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [cakeType]);

const cakesData = [
    { id: "1", eggType: "with", cakeType: "ice", name: "Chocolate Ice Fantasy", price: 899, image: cake1 },
    { id: "2", eggType: "with", cakeType: "ice", name: "Black Forest Ice Bliss", price: 949, image: cake2 },
    { id: "3", eggType: "with", cakeType: "ice", name: "Oreo Ice Cream Cake", price: 999, image: cake3 },
    { id: "4", eggType: "with", cakeType: "ice", name: "KitKat Ice Cake", price: 1049, image: cake4 },
    { id: "5", eggType: "with", cakeType: "ice", name: "Choco Lava Ice Cake", price: 1099, image: cake5 },
    { id: "6", eggType: "with", cakeType: "ice", name: "Belgian Chocolate Ice Cake", price: 1199, image: cake6 },
    { id: "7", eggType: "with", cakeType: "ice", name: "Red Velvet Ice Cake", price: 1149, image: cake7 },
    { id: "8", eggType: "with", cakeType: "ice", name: "Ferrero Rocher Ice Cake", price: 1299, image: cake8 },
    { id: "9", eggType: "with", cakeType: "ice", name: "Coffee Crunch Ice Cake", price: 1099, image: cake9 },
    { id: "10", eggType: "with", cakeType: "ice", name: "Triple Chocolate Ice Cake", price: 1249, image: cake10 },
    { id: "11", eggType: "with", cakeType: "normal", name: "Classic Chocolate Truffle", price: 699, image: cake11 },
    { id: "12", eggType: "with", cakeType: "normal", name: "Black Forest Cake", price: 749, image: cake12 },
    { id: "13", eggType: "with", cakeType: "normal", name: "Pineapple Delight Cake", price: 699, image: cake13 },
    { id: "14", eggType: "with", cakeType: "normal", name: "Chocolate Fudge Cake", price: 799, image: cake14 },
    { id: "15", eggType: "with", cakeType: "normal", name: "Red Velvet Cream Cake", price: 849, image: cake15 },
    { id: "16", eggType: "with", cakeType: "normal", name: "Butterscotch Crunch Cake", price: 749, image: cake16 },
    { id: "17", eggType: "with", cakeType: "normal", name: "Coffee Mocha Cake", price: 799, image: cake17 },
    { id: "18", eggType: "with", cakeType: "normal", name: "Dark Chocolate Layer Cake", price: 899, image: cake18 },
    { id: "19", eggType: "with", cakeType: "normal", name: "Vanilla Almond Cake", price: 699, image: cake19 },
    { id: "20", eggType: "with", cakeType: "normal", name: "Chocolate Caramel Cake", price: 849, image: cake20 },
    { id: "21", eggType: "without", cakeType: "ice", name: "Veg Chocolate Ice Cake", price: 949, image: cake21 },
    { id: "22", eggType: "without", cakeType: "ice", name: "Veg Oreo Ice Cake", price: 999, image: cake22 },
    { id: "23", eggType: "without", cakeType: "ice", name: "Veg Mango Ice Cake", price: 1049, image: cake23 },
    { id: "24", eggType: "without", cakeType: "ice", name: "Veg Strawberry Ice Cake", price: 1049, image: cake24 },
    { id: "25", eggType: "without", cakeType: "ice", name: "Veg Vanilla Ice Cream Cake", price: 899, image: cake25 },
    { id: "26", eggType: "without", cakeType: "ice", name: "Veg Belgian Ice Cake", price: 1199, image: cake26 },
    { id: "27", eggType: "without", cakeType: "ice", name: "Veg Blueberry Ice Cake", price: 1099, image: cake27 },
    { id: "28", eggType: "without", cakeType: "ice", name: "Veg Chocolate Chips Ice Cake", price: 1049, image: cake28 },
    { id: "29", eggType: "without", cakeType: "ice", name: "Veg Pista Ice Cake", price: 1099, image: cake29 },
    { id: "30", eggType: "without", cakeType: "ice", name: "Veg Rainbow Ice Cake", price: 1049, image: cake30 },
    { id: "31", eggType: "without", cakeType: "normal", name: "Eggless Chocolate Cake", price: 649, image: cake31 },
    { id: "32", eggType: "without", cakeType: "normal", name: "Eggless Vanilla Cake", price: 599, image: cake32 },
    { id: "33", eggType: "without", cakeType: "normal", name: "Eggless Black Forest Cake", price: 699, image: cake33 },
    { id: "34", eggType: "without", cakeType: "normal", name: "Eggless Pineapple Cake", price: 649, image: cake34 },
    { id: "35", eggType: "without", cakeType: "normal", name: "Eggless Red Velvet Cake", price: 799, image: cake35 },
    { id: "36", eggType: "without", cakeType: "normal", name: "Eggless Butterscotch Cake", price: 699, image: cake36 },
    { id: "37", eggType: "without", cakeType: "normal", name: "Eggless Chocolate Truffle", price: 799, image: cake37 },
    { id: "38", eggType: "without", cakeType: "normal", name: "Eggless Almond Cake", price: 749, image: cake38 },
    { id: "39", eggType: "without", cakeType: "normal", name: "Eggless Strawberry Cake", price: 699, image: cake39 },
    { id: "40", eggType: "without", cakeType: "normal", name: "Eggless Fruit Overload Cake", price: 749, image: cake40 },
  ];

  const filteredCakes = cakesData.filter(
    (c) => c.eggType === eggType && c.cakeType === cakeType
  );

  // ✅ FIX 4: Proper card press animation
  const renderCakeCard = ({ item }) => {
    if (!scaleAnim[item.id]) {
      scaleAnim[item.id] = new Animated.Value(1);
    }

    const onPressIn = () => {
      Animated.spring(scaleAnim[item.id], {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim[item.id], {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cakeCard,
          { transform: [{ scale: scaleAnim[item.id] }], opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Image source={item.image} style={styles.cakeImage} />
        </TouchableOpacity>

        <View style={styles.cakeDetails}>
          <Text style={styles.cakeName}>{item.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>

            <TouchableOpacity
              style={[
                styles.orderButton,
                loadingId === item.id && styles.orderButtonDisabled,
              ]}
              onPress={() => handleOrder(item)}
              disabled={loadingId === item.id}
            >
              <Text style={styles.orderButtonText}>
                {loadingId === item.id ? "Processing..." : "Order Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fffbeb" barStyle="dark-content" />

      {/* ✅ FIX 1 + 2: HEADER */}
      <View style={styles.header}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#f59e0b" />
        </TouchableOpacity>

        {/* TITLE (slightly down center) */}
        <Text style={styles.headerTitle}>🎂 Cakes Collection</Text>

        {/* MENU */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="grid-outline" size={26} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* FILTERS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              eggType === "with" && styles.filterActive,
            ]}
            onPress={() => {
              setEggType("with");
              setCakeType(null);
            }}
          >
            <Text
              style={[
                styles.filterText,
                eggType === "with" && styles.filterTextActive,
              ]}
            >
              With Egg 🥚
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              eggType === "without" && styles.filterActive,
            ]}
            onPress={() => {
              setEggType("without");
              setCakeType(null);
            }}
          >
            <Text
              style={[
                styles.filterText,
                eggType === "without" && styles.filterTextActive,
              ]}
            >
              Without Egg 🚫🥚
            </Text>
          </TouchableOpacity>
        </View>

        {eggType && (
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterBtn,
                cakeType === "ice" && styles.filterActive,
              ]}
              onPress={() => setCakeType("ice")}
            >
              <Text
                style={[
                  styles.filterText,
                  cakeType === "ice" && styles.filterTextActive,
                ]}
              >
                Ice Cake ❄️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                cakeType === "normal" && styles.filterActive,
              ]}
              onPress={() => setCakeType("normal")}
            >
              <Text
                style={[
                  styles.filterText,
                  cakeType === "normal" && styles.filterTextActive,
                ]}
              >
                Normal Cake 🍰
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {cakeType && (
          <FlatList
            data={filteredCakes}
            renderItem={renderCakeCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* ✅ FIX 1: MENU (same like chocolate page) */}
      <Modal visible={menuOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={22} color="#b45309" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Chocolates");
              }}
            >
              <Text style={styles.menuItemText}>🍫 Chocolates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Cookies");
              }}
            >
              <Text style={styles.menuItemText}>🍪 Cookies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("MoreItems");
              }}
            >
              <Text style={styles.menuItemText}>🧁 More Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbeb" },

  // ✅ FIX 2 (title position)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 16,
    marginBottom: 20,
    position: "relative",
  },

  headerTitle: {
    position: "absolute",
    top: 30, // 👈 slightly down
    left: "50%",
    transform: [{ translateX: -90 }],
    fontSize: 22,
    fontWeight: "900",
    color: "#f59e0b",
  },

  iconBtn: { padding: 8 },

  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
    gap: 12,
  },

  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#f59e0b",
    backgroundColor: "#fff",
  },

  filterActive: { backgroundColor: "#f59e0b" },

  filterText: { fontWeight: "700", color: "#f59e0b" },
  filterTextActive: { color: "#fff" },

  cakeCard: {
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: "center",
    overflow: "hidden",
  },

  cakeImage: { width: "100%", height: 220 },

  cakeDetails: { padding: 16 },

  cakeName: { fontSize: 18, fontWeight: "800", color: "#b45309" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  price: { fontWeight: "900", color: "#d97706" },

  orderButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },

  orderButtonDisabled: { backgroundColor: "#fcd34d" },

  orderButtonText: { color: "#fff", fontWeight: "800" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: { fontSize: 20, fontWeight: "800" },

  menuItem: {
    padding: 14,
    backgroundColor: "#fef3c7",
    borderRadius: 10,
    marginBottom: 10,
  },

  menuItemText: { fontWeight: "700" },
});

export default CakesScreen;