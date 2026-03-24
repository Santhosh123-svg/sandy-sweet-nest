import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated
} from "react-native";
import axiosInstance from "../../utils/axiosInstance";
import { Ionicons } from "@expo/vector-icons";

const DashboardScreen = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/admin/dashboard");
      setStats(res.data);

      Animated.timing(fadeAnim,{
        toValue:1,
        duration:800,
        useNativeDriver:true
      }).start();

    } catch (err) {
      Alert.alert("Error", "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard 🍰</Text>

      <Animated.View style={[styles.card,{opacity:fadeAnim}]}>
        <Ionicons name="people" size={40} color="#f97316" />
        <Text style={styles.label}>Total Users</Text>
        <Text style={styles.value}>{stats?.users}</Text>
      </Animated.View>

      <Animated.View style={[styles.card,{opacity:fadeAnim}]}>
        <Ionicons name="shield-checkmark" size={40} color="#16a34a" />
        <Text style={styles.label}>Total Admins</Text>
        <Text style={styles.value}>{stats?.admins}</Text>
      </Animated.View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff7ed",
    padding:20
  },

  header:{
    fontSize:26,
    fontWeight:"900",
    color:"#ea580c",
    marginBottom:20
  },

  loadingContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  card:{
    backgroundColor:"#fff",
    padding:25,
    borderRadius:20,
    alignItems:"center",
    marginBottom:20,
    elevation:6
  },

  label:{
    marginTop:10,
    color:"#6b7280"
  },

  value:{
    fontSize:40,
    fontWeight:"900",
    marginTop:5
  }
});