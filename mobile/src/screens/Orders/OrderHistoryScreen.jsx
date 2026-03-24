import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../utils/axiosInstance";

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchOrders();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/orders/my-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isPastDelivery = (deliveryDate, deliveryTime) => {
    if (!deliveryDate || !deliveryTime) return false;

    try {
      const [year, month, day] = deliveryDate.split("-").map(Number);
      const [hours, minutes] = deliveryTime.split(":").map(Number);

      const deliveryDateTime = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();

      return now > deliveryDateTime;
    } catch (e) {
      return false;
    }
  };

  const sendCancellationNotification = async (order) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Order Cancelled 🚨",
        body: `Order ${order.orderId} cancelled`,
      },
      trigger: null,
    });
  };

  const handleCancel = async (order) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure? 😢",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const res = await axiosInstance.put(`/api/orders/cancel/${order._id}`);
              if (res.data.success) {
                await sendCancellationNotification(order);
                Alert.alert("Cancelled ✅");
                fetchOrders();
              }
            } catch (err) {
              Alert.alert("Error");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
      ) : (
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="sad-outline" size={60} color="#f59e0b" />
              <Text style={styles.emptyText}>No Orders Yet 😢</Text>
            </View>
          ) : (
            orders.map((order, index) => {
              const past = isPastDelivery(order.deliveryDate, order.deliveryTime);
              const isCancelled =
                order.status === "Cancelled" ||
                order.status === "Cancelled by User";

              return (
                <Animated.View
                  key={order._id}
                  style={[
                    styles.card,
                    {
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {/* ORDER ID */}
                  <View style={styles.rowBetween}>
                    <Text style={styles.orderId}>#{order.orderId}</Text>
                    <Text style={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* PRODUCT */}
                  <View style={styles.infoRow}>
                    <Ionicons name="cube" size={20} color="#f97316" />
                    <View>
                      <Text style={styles.label}>Product</Text>
                      <Text style={styles.value}>{order.productName}</Text>
                    </View>
                  </View>

                  {/* DATE */}
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={20} color="#3b82f6" />
                    <Text style={styles.value}>{order.deliveryDate}</Text>
                  </View>

                  {/* TIME */}
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color="#a855f7" />
                    <Text style={styles.value}>{order.deliveryTime}</Text>
                  </View>

                  {/* STATUS */}
                  <View style={styles.footer}>
                    {isCancelled ? (
                      <Text style={[styles.status, { color: "red" }]}>
                        Cancelled ❌
                      </Text>
                    ) : past ? (
                      <Text style={[styles.status, { color: "green" }]}>
                        Delivered ✅
                      </Text>
                    ) : (
                      <Text style={[styles.status, { color: "#2563eb" }]}>
                        Processing ⏳
                      </Text>
                    )}

                    {/* 🔥 IMPORTANT LOGIC */}
                    {!isCancelled && !past && (
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancel(order)}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              );
            })
          )}
        </Animated.ScrollView>
      )}
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    elevation: 5,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  orderId: {
    fontWeight: "800",
    color: "#f97316",
  },

  date: {
    fontSize: 12,
    color: "#999",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontWeight: "700",
  },

  cancelBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  cancelText: {
    color: "#fff",
    fontWeight: "700",
  },
});