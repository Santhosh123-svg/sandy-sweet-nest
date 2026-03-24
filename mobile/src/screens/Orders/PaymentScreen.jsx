import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Linking,
  ScrollView,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";
import axiosInstance from "../../utils/axiosInstance";

const PaymentScreen = ({ navigation }) => {
  const { order, placeOrder } = useOrder();

  const [mode, setMode] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (!order) navigation.navigate("Welcome");
    else setOrderId(order.orderId || "");
  }, [order]);

  if (!order) return null;

  const totalAmount = order.totalAmount;

  const UPI_ID = "srinivasanst29@oksbi";
  const SHOP_NAME = "Sandy Sweet Nest";
  const NOTE = "Cake Order Payment";

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    SHOP_NAME
  )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(NOTE)}&mode=02`;

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiLink
  )}`;

  const openUPI = () => {
    Linking.openURL(upiLink).catch(() =>
      Alert.alert("Error", "Could not open UPI app")
    );
  };

  const handlePaid = async () => {
    if (!orderId.trim()) {
      Alert.alert("Missing", "Please enter Order ID 💳");
      return;
    }

    try {
      setVerifying(true);

      const userString = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        navigation.replace("EnterNumber");
        return;
      }

      const user = userString ? JSON.parse(userString) : {};

      const generatedOrderId =
        orderId.trim() || `ORD-${Date.now()}`;

      const updatedOrder = {
        ...order,
        orderId: generatedOrderId,
        status: "Order Placed",
        deliveryDate: order.cakeInfo?.deliveryDate || "",
        deliveryTime: order.cakeInfo?.preferredTime || "",
        customer: {
          name: user.name || "Unknown",
          email: user.email || `${user.phone}@mobile.com`,
          phone: user.phone || "",
          address: user.address || "",
        },
      };

      placeOrder(updatedOrder);

      await axiosInstance.post("/api/orders", updatedOrder);

      Alert.alert("Success 🎉", "Order placed successfully!");

      navigation.replace("OrderSuccess");

    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message ||
          "Something went wrong while saving order"
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Secure Payment</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ORDER SUMMARY */}
        {!mode && (
          <View style={styles.summaryCard}>
            <Text style={styles.product}>{order.productName}</Text>
            <Text style={styles.qty}>Quantity: {order.quantity}</Text>

            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amount}>₹{totalAmount}</Text>
            </View>

            <Text style={styles.locked}>
              Amount locked • cannot be edited
            </Text>
          </View>
        )}

        {/* PAYMENT OPTIONS */}
        {!mode && (
          <View style={styles.optionGrid}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setMode("scan")}
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code-outline" size={30} color="#f97316" />
              <Text style={styles.optionTitle}>Scan & Pay</Text>
              <Text style={styles.optionSub}>Use QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setMode("upi")}
              activeOpacity={0.8}
            >
              <Ionicons name="phone-portrait-outline" size={30} color="#f97316" />
              <Text style={styles.optionTitle}>UPI Apps</Text>
              <Text style={styles.optionSub}>GPay / PhonePe</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* QR MODE */}
        {mode === "scan" && (
          <View style={styles.qrCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMode(null)}
            >
              <Ionicons name="close" size={22} />
            </TouchableOpacity>

            <Image source={{ uri: qrImage }} style={styles.qr} />

            <Text style={styles.scanText}>
              Scan using Google Pay / PhonePe
            </Text>
          </View>
        )}

        {/* UPI MODE */}
        {mode === "upi" && (
          <View style={styles.upiCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setMode(null)}
            >
              <Ionicons name="close" size={22} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.gpayBtn} onPress={openUPI}>
              <Text style={styles.payText}>Pay with Google Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.phonepeBtn} onPress={openUPI}>
              <Text style={styles.payText}>Pay with PhonePe</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ORDER ID */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Enter Order ID</Text>
          <TextInput
            value={orderId}
            onChangeText={setOrderId}
            style={styles.input}
            placeholder="ORD1234"
          />
        </View>

        {/* PAY BUTTON */}
        {(mode || verifying) && (
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePaid}
            disabled={verifying}
          >
            <Text style={styles.payBtnText}>
              {verifying ? "Processing..." : "I HAVE PAID"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 60
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20
  },

  backBtn: {
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 12
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#c2410c"
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4
  },

  product: {
    fontSize: 16,
    fontWeight: "800"
  },

  qty: {
    marginTop: 5,
    color: "#555"
  },

  amountBox: {
    marginTop: 15,
    backgroundColor: "#fff7ed",
    padding: 15,
    borderRadius: 14,
    alignItems: "center"
  },

  amountLabel: {
    fontSize: 12,
    color: "#777"
  },

  amount: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ea580c"
  },

  locked: {
    marginTop: 8,
    fontSize: 12,
    color: "#ef4444"
  },

  optionGrid: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25
  },

  optionCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    elevation: 3
  },

  optionTitle: {
    marginTop: 10,
    fontWeight: "800"
  },

  optionSub: {
    fontSize: 12,
    color: "#888"
  },

  qrCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25
  },

  qr: {
    width: 260,
    height: 260,
    marginVertical: 15
  },

  scanText: {
    fontWeight: "600"
  },

  upiCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    gap: 15
  },

  gpayBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },

  phonepeBtn: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },

  payText: {
    color: "#fff",
    fontWeight: "700"
  },

  closeBtn: {
    alignSelf: "flex-end"
  },

  inputCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18
  },

  label: {
    fontWeight: "700",
    marginBottom: 6
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff7ed"
  },

  payBtn: {
    marginTop: 25,
    backgroundColor: "#f97316",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    elevation: 5
  },

  payBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16
  }
});