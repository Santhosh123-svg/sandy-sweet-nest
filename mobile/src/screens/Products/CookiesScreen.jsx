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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../context/OrderContext';

import cookie1 from '../../assets/cookies/cookie1.jpg';
import cookie2 from '../../assets/cookies/cookie2.webp';
import cookie3 from '../../assets/cookies/cookie3.webp';
import cookie4 from '../../assets/cookies/cookie4.webp';
import cookie5 from '../../assets/cookies/cookie5.jpg';
import cookie6 from '../../assets/cookies/cookie6.webp';
import cookie7 from '../../assets/cookies/cookie7.jpg';
import cookie8 from '../../assets/cookies/cookie8.webp';
import cookie9 from '../../assets/cookies/cookie9.jpg';
import cookie10 from '../../assets/cookies/cookie10.jpeg';

const { width } = Dimensions.get("window");

const CookiesScreen = ({ navigation }) => {
  const { placeOrder } = useOrder();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const scaleAnim = useRef({});
  const headerAnim = useRef(new Animated.Value(1)).current;
  const backAnim = useRef(new Animated.Value(1)).current;

  const cookiesData = [
    { id: 'CO1', name: 'Choco Chip Cookie', price: 80, image: cookie1 },
    { id: 'CO2', name: 'Oats Raisin Cookie', price: 90, image: cookie2 },
    { id: 'CO3', name: 'Butter Cookie', price: 70, image: cookie3 },
    { id: 'CO4', name: 'Almond Cookie', price: 100, image: cookie4 },
    { id: 'CO5', name: 'Peanut Butter Cookie', price: 95, image: cookie5 },
    { id: 'CO6', name: 'Cinnamon Cookie', price: 85, image: cookie6 },
    { id: 'CO7', name: 'Double Chocolate Cookie', price: 110, image: cookie7 },
    { id: 'CO8', name: 'Honey Oats Cookie', price: 95, image: cookie8 },
    { id: 'CO9', name: 'Coconut Cookie', price: 90, image: cookie9 },
    { id: 'CO10', name: 'Cranberry Cookie', price: 100, image: cookie10 },
  ];

  const handleOrder = (cookie) => {
    setLoadingId(cookie.id);

    placeOrder({
      productName: cookie.name,
      price: cookie.price,
      image: cookie.image,
      quantity: 1,
      category: 'Cookies',
    });

    navigation.push('OrderFlow');

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

  const renderCookieCard = ({ item }) => {
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
                {loadingId === item.id ? 'Processing...' : 'Order Now'}
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

        <Animated.Text
          style={[styles.title, { transform: [{ scale: headerAnim }] }]}
          onPress={animateHeader}
        >
          🍪 Cookies Collection
        </Animated.Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="grid-outline" size={26} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={cookiesData}
        renderItem={renderCookieCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 70 }}
      />

      {/* 🔥 UPDATED MENU */}
      <Modal visible={menuOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* 🔥 CLOSE BUTTON */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>

              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={24} color="#b45309" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('Cakes');
              }}
            >
              <Text style={styles.menuItemText}>🎂 Cakes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('Chocolates');
              }}
            >
              <Text style={styles.menuItemText}>🍫 Chocolates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('MoreItems');
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
  container: { flex: 1, backgroundColor: '#fffbeb' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginHorizontal: 16,
    position: 'relative',
  },

  title: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
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

  card: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 8,
  },

  image: {
    width: '100%',
    height: 220,
  },

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

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#d97706',
  },

  menuItem: {
    padding: 14,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    marginBottom: 10,
  },

  menuItemText: {
    fontWeight: '700',
  },
});

export default CookiesScreen;