import React, { useState, useRef } from 'react';
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../context/OrderContext';

import cupcake1 from '../../assets/more/cupcake1.jpeg';
import cupcake2 from '../../assets/more/cupcake2.webp';
import cupcake3 from '../../assets/more/cupcake3.webp';
import cupcake4 from '../../assets/more/cupcake4.webp';
import cupcake5 from '../../assets/more/cupcake5.jpeg';
import cupcake6 from '../../assets/more/cupcake6.webp';

import pastry1 from '../../assets/more/pastry1.webp';
import pastry2 from '../../assets/more/pastry2.jpeg';
import pastry3 from '../../assets/more/pastry3.webp';
import pastry4 from '../../assets/more/pastry4.webp';
import pastry5 from '../../assets/more/pastry5.png';
import pastry6 from '../../assets/more/pastry6.jpg';

import shake1 from '../../assets/more/shake1.webp';
import shake2 from '../../assets/more/shake2.webp';
import shake3 from '../../assets/more/shake3.webp';
import shake4 from '../../assets/more/shake4.jpeg';
import shake5 from '../../assets/more/shake5.webp';
import shake6 from '../../assets/more/shake6.avif';

const { width } = Dimensions.get("window");

const MoreItemsScreen = ({ navigation }) => {

  const { placeOrder } = useOrder();

  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const scaleAnim = useRef({});
  const headerAnim = useRef(new Animated.Value(1)).current;
  const backAnim = useRef(new Animated.Value(1)).current;

  const items = {
    cupcake: [
      { id: 'CU1', name: 'Red Velvet Cupcake', price: 120, image: cupcake1 },
      { id: 'CU2', name: 'Chocolate Cupcake', price: 110, image: cupcake2 },
      { id: 'CU3', name: 'Vanilla Cupcake', price: 100, image: cupcake3 },
      { id: 'CU4', name: 'Strawberry Cupcake', price: 130, image: cupcake4 },
      { id: 'CU5', name: 'Oreo Cupcake', price: 140, image: cupcake5 },
      { id: 'CU6', name: 'Butterscotch Cupcake', price: 125, image: cupcake6 }
    ],
    pastries: [
      { id: 'PA1', name: 'Chocolate Pastry', price: 150, image: pastry1 },
      { id: 'PA2', name: 'Pineapple Pastry', price: 140, image: pastry2 },
      { id: 'PA3', name: 'Black Forest Pastry', price: 160, image: pastry3 },
      { id: 'PA4', name: 'Blueberry Pastry', price: 155, image: pastry4 },
      { id: 'PA5', name: 'Mango Pastry', price: 150, image: pastry5 },
      { id: 'PA6', name: 'Cream Pastry', price: 145, image: pastry6 }
    ],
    beverages: [
      { id: 'BE1', name: 'Chocolate Shake', price: 120, image: shake1 },
      { id: 'BE2', name: 'Vanilla Shake', price: 110, image: shake2 },
      { id: 'BE3', name: 'Strawberry Shake', price: 130, image: shake3 },
      { id: 'BE4', name: 'Cold Coffee', price: 140, image: shake4 },
      { id: 'BE5', name: 'Mango Shake', price: 135, image: shake5 },
      { id: 'BE6', name: 'Oreo Shake', price: 150, image: shake6 }
    ]
  };

  const handleOrder = (item) => {
    setLoadingId(item.id);

    placeOrder({
      productName: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: category
    });

    navigation.push("OrderFlow");
    setTimeout(() => setLoadingId(null), 500);
  };

  const renderItemCard = ({ item }) => {
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

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#f59e0b" />
        </TouchableOpacity>

        <Text style={styles.title}>🧁 More Items</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="grid-outline" size={26} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* 🔥 PERFECT CATEGORY ALIGNMENT */}
      <View style={styles.categoryWrapper}>
        {["cupcake", "pastries", "beverages"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.categoryActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              category === cat && { color: "#fff" }
            ]}>
              {cat === "cupcake" ? "🧁 Cupcakes" :
               cat === "pastries" ? "🥐 Pastries" : "🥤 Beverages"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      {category && (
        <FlatList
          data={items[category]}
          renderItem={renderItemCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      )}

      {/* 🔥 BETTER MENU UI */}
      <Modal visible={menuOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Menu</Text>

            {["Cakes", "Chocolates", "Cookies"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate(item);
                }}
              >
                <Text style={styles.menuItemText}>
                  {item === "Cakes" ? "🎂 Cakes" :
                   item === "Chocolates" ? "🍫 Chocolates" : "🍪 Cookies"}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setMenuOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbeb' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f59e0b',
  },

  iconBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },

  /* 🔥 CATEGORY FIX */
  categoryWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 3,
  },

  categoryActive: {
    backgroundColor: '#f59e0b',
  },

  categoryText: {
    fontWeight: '700',
    color: '#b45309',
  },

  card: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 8,
  },

  image: { width: '100%', height: 220 },

  details: { padding: 16 },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#b45309',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#d97706',
  },

  orderButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },

  orderButtonDisabled: {
    backgroundColor: '#fcd34d',
  },

  orderButtonText: {
    color: '#fff',
    fontWeight: '800',
  },

  /* 🔥 MENU IMPROVED */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 15,
    color: '#d97706',
  },

  menuItem: {
    padding: 14,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    marginBottom: 10,
  },

  menuItemText: {
    fontWeight: '700',
    fontSize: 16,
  },

  closeText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#ef4444',
    fontWeight: '700',
  },
});

export default MoreItemsScreen;