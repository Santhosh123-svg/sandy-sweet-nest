import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";

import choco1 from '../../assets/chocolates/choco1.jpg';
import choco2 from '../../assets/chocolates/choco2.avif';
import choco3 from '../../assets/chocolates/choco3.jpg';
import choco4 from '../../assets/chocolates/choco4.jpg';
import choco5 from '../../assets/chocolates/choco5.avif';
import choco6 from '../../assets/chocolates/choco6.webp';
import choco7 from '../../assets/chocolates/choco7.webp';
import choco8 from '../../assets/chocolates/choco8.webp';
import choco9 from '../../assets/chocolates/choco9.webp';
import choco10 from '../../assets/chocolates/choco10.webp';
import choco11 from '../../assets/chocolates/choco11.jpg';
import choco12 from '../../assets/chocolates/choco12.webp';

const { width } = Dimensions.get("window");

const ChocolatesScreen = ({ navigation }) => {
  const { placeOrder } = useOrder();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const scaleAnim = useRef({});
  const headerAnim = useRef(new Animated.Value(1)).current;
  const backAnim = useRef(new Animated.Value(1)).current;

  const chocolatesData = [
    { id: 'C1', name: 'Dark Chocolate Truffle', price: 250, image: choco1 },
    { id: 'C2', name: 'Milk Chocolate Bar', price: 180, image: choco2 },
    { id: 'C3', name: 'White Chocolate Delight', price: 220, image: choco3 },
    { id: 'C4', name: 'Hazelnut Chocolate', price: 300, image: choco4 },
    { id: 'C5', name: 'Almond Crunch', price: 280, image: choco5 },
    { id: 'C6', name: 'Caramel Filled Chocolate', price: 260, image: choco6 },
    { id: 'C7', name: 'Fruit & Nut Chocolate', price: 320, image: choco7 },
    { id: 'C8', name: 'Belgian Dark Chocolate', price: 350, image: choco8 },
    { id: 'C9', name: 'Chocolate Fudge Square', price: 200, image: choco9 },
    { id: 'C10', name: 'Coffee Infused Chocolate', price: 290, image: choco10 },
    { id: 'C11', name: 'Orange Zest Chocolate', price: 270, image: choco11 },
    { id: 'C12', name: 'Premium Assorted Box', price: 550, image: choco12 },
  ];

  const handleOrder = (choco) => {
    setLoadingId(choco.id);

    placeOrder({
      productName: choco.name,
      price: choco.price,
      image: choco.image,
      quantity: 1,
      category: "Chocolates",
    });

    navigation.push("OrderFlow");

    setTimeout(() => setLoadingId(null), 500);
  };

  const animateHeader = () => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(headerAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const handleBackPressIn = () => {
    Animated.spring(backAnim, { toValue: 1.2, useNativeDriver: true }).start();
  };

  const handleBackPressOut = () => {
    Animated.spring(backAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const renderChocolateCard = ({ item }) => {
    if (!scaleAnim.current[item.id]) {
      scaleAnim.current[item.id] = new Animated.Value(1);
    }

    return (
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim.current[item.id] }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => {
            Animated.spring(scaleAnim.current[item.id], {
              toValue: 0.92,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(scaleAnim.current[item.id], {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Animated.Image
            source={item.image}
            style={[
              styles.image,
              { transform: [{ scale: scaleAnim.current[item.id] }] },
            ]}
          />
        </TouchableOpacity>

        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>

            <TouchableOpacity
              style={[
                styles.orderButton,
                loadingId === item.id && styles.orderButtonDisabled,
              ]}
              onPress={() => handleOrder(item)}
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

      <View style={styles.header}>

        <Animated.View style={{ transform: [{ scale: backAnim }] }}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
          >
            <Ionicons name="arrow-back" size={26} color="#f59e0b" />
          </TouchableOpacity>
        </Animated.View>

        {/* ✅ FIXED TITLE */}
        <Animated.Text
          style={[
            styles.title,
            { transform: [{ scale: headerAnim }] },
          ]}
          onPress={animateHeader}
        >
          🍫 Chocolates Collection
        </Animated.Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="grid-outline" size={26} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* ✅ IMPORTANT FIX: spacing to avoid overlap */}
      <FlatList
        data={chocolatesData}
        renderItem={renderChocolateCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 70 }} // 🔥 KEY FIX
      />

      {/* MENU MODAL unchanged */}
      <Modal visible={menuOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>

              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={22} color="#b45309" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuOpen(false);
              navigation.navigate("Cakes");
            }}>
              <Text style={styles.menuItemText}>🎂 Cakes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuOpen(false);
              navigation.navigate("Cookies");
            }}>
              <Text style={styles.menuItemText}>🍪 Cookies</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuOpen(false);
              navigation.navigate("MoreItems");
            }}>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 16,
    marginBottom: 20,
    position: "relative",
  },

  // ✅ PERFECT CENTER FIX
  title: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: "#f59e0b",
  },

  iconBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
  },

  card: {
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: "center",
    overflow: "hidden",
    elevation: 8,
  },

  image: {
    width: "100%",
    height: 220,
  },

  details: { padding: 16 },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#b45309",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
    color: "#d97706",
  },

  orderButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },

  orderButtonDisabled: {
    backgroundColor: "#fcd34d",
  },

  orderButtonText: {
    color: "#fff",
    fontWeight: "800",
  },

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

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  menuItem: {
    padding: 14,
    backgroundColor: "#fef3c7",
    borderRadius: 10,
    marginBottom: 10,
  },

  menuItemText: {
    fontWeight: "700",
  },
});

export default ChocolatesScreen;