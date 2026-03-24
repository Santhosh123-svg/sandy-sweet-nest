import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useOrder } from "../../context/OrderContext";

/* 🔥 FIX: NEW NOTIFICATION HANDLER */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // ✅ replaces shouldShowAlert
    shouldShowList: true,     // ✅ required
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const OrderSuccessScreen = ({ navigation }) => {
  const { order } = useOrder();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    sendNotification();

    // 🔥 ENTRY ANIMATION
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 🔥 NOTIFICATION CLICK LISTENER
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        navigation.navigate("OrderHistory", {
          orderId: data?.orderId,
        });
      });

    return () => subscription.remove();
  }, []);

  const sendNotification = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Confirmed 🎉",
          body: `Order ${order?.orderId} placed successfully`,
          data: { orderId: order?.orderId },
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* ICON */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons name="checkmark-circle" size={110} color="#f97316" />
          </Animated.View>

          {/* TITLE */}
          <Text style={styles.title}>Order Confirmed 🎂</Text>

          {/* MESSAGE */}
          <Text style={styles.message}>
            Your sweet order is successfully placed 💖{"\n"}
            Get ready for happiness 🎉
          </Text>

          {/* ORDER DETAILS */}
          <View style={styles.detailsBox}>
            <Text style={styles.detail}>🧾 ID: {order?.orderId}</Text>
            <Text style={styles.detail}>🍰 {order?.productName}</Text>
            <Text style={styles.detail}>
              📅 {order?.cakeInfo?.deliveryDate}
            </Text>
            <Text style={styles.detail}>
              ⏰ {order?.cakeInfo?.preferredTime}
            </Text>
          </View>

          {/* BUTTONS */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Welcome")}
          >
            <Text style={styles.primaryText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Text style={styles.secondaryText}>View My Orders</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ea580c",
    marginTop: 20,
  },

  message: {
    textAlign: "center",
    color: "#6b7280",
    marginVertical: 15,
    lineHeight: 22,
  },

  detailsBox: {
    backgroundColor: "#fff7ed",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },

  detail: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#f97316",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  secondaryText: {
    color: "#f97316",
    fontWeight: "800",
  },
});