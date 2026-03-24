import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboardScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const animations = useRef([]).current;

  useEffect(() => {
    checkAdmin();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const checkAdmin = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || user.role !== "admin") {
      Alert.alert("Access Denied ❌");
      navigation.replace("Welcome");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get('/api/admin/orders');

      const data = res.data.orders || [];
      setOrders(data);

      animations.length = 0;
      data.forEach((_, i) => {
        animations[i] = new Animated.Value(0);
      });

      Animated.stagger(
        120,
        animations.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
          })
        )
      ).start();

    } catch (err) {
      console.log(err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    Alert.alert('Delete Order', 'Delete this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const res = await axiosInstance.delete(`/api/admin/orders/${id}`);

            if (res.status === 200) {
              setOrders(prev => prev.filter(o => o._id !== id));
              Alert.alert("Deleted Successfully ✅");
            }

          } catch (err) {
            console.log("DELETE ERROR 👉", err?.response?.data || err.message);
            Alert.alert('Error ❌', 'Delete failed');
          }
        },
      },
    ]);
  };

  const renderOrder = ({ item, index }) => {
    const anim = animations[index] || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>{item.productName}</Text>
        <Text style={styles.orderId}>🧾 {item.orderId}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text>👤 {item.customer?.name}</Text>
          <Text>📞 {item.customer?.phone}</Text>
          <Text>📍 {item.customer?.address || "No address"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Info</Text>
          <Text>💰 ₹ {item.totalAmount}</Text>
          <Text>📅 {item.deliveryDate}</Text>
          <Text>⏰ {item.deliveryTime}</Text>
        </View>

        {item.cakeInfo?.cakeText && (
          <Text style={styles.cakeText}>
            🎂 Message: {item.cakeInfo.cakeText}
          </Text>
        )}

        <Text style={styles.status}>{item.status}</Text>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteOrder(item._id)}
        >
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.deleteText}>Delete Order</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      
      {/* 🔥 HEADER WITH BACK BUTTON */}
      <View style={styles.header}>
        
        {/* 👈 BACK ICON */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Ionicons name="arrow-back" size={26} color="#ea580c" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Admin Dashboard 🍰</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text>No orders 😢</Text>}
      />
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  header:{
    paddingTop:50,
    paddingBottom:10,
    alignItems:"center",
    justifyContent:"center"
  },

  backBtn:{
    position:"absolute",
    left:20,
    top:50
  },

  headerText:{
    fontSize:26,
    fontWeight:"900",
    color:"#ea580c"
  },

  card:{
    backgroundColor:"#fff",
    padding:20,
    borderRadius:20,
    marginBottom:18,
    shadowColor:"#000",
    shadowOpacity:0.1,
    shadowRadius:10,
    elevation:6
  },

  title:{
    fontSize:18,
    fontWeight:"800",
    color:"#ea580c"
  },

  orderId:{
    fontSize:12,
    color:"#888",
    marginBottom:10
  },

  section:{
    marginTop:10
  },

  sectionTitle:{
    fontWeight:"700",
    marginBottom:4,
    color:"#6b7280"
  },

  cakeText:{
    marginTop:8,
    fontStyle:"italic"
  },

  status:{
    marginTop:10,
    fontWeight:"700",
    color:"#2563eb"
  },

  deleteBtn:{
    marginTop:15,
    backgroundColor:"#ef4444",
    padding:12,
    borderRadius:12,
    flexDirection:"row",
    justifyContent:"center",
    gap:6
  },

  deleteText:{
    color:"#fff",
    fontWeight:"700"
  }
});