import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOrder } from '../../context/OrderContext';

const OrderSummary = () => {
  const { order } = useOrder();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price</Text>
      <Text style={styles.price}>₹ {order.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#d97706',
  },
});

export default OrderSummary;
