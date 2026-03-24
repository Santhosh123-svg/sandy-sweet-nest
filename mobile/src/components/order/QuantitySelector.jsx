import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuantitySelector = ({ quantity, setQuantity }) => {
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, quantity === 1 && styles.buttonDisabled]}
        onPress={decrementQuantity}
        disabled={quantity === 1}
      >
        <Ionicons 
          name="remove-circle" 
          size={24} 
          color={quantity === 1 ? '#9ca3af' : '#ef4444'} 
        />
      </TouchableOpacity>

      <Text style={styles.quantityText}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.button, quantity === 10 && styles.buttonDisabled]}
        onPress={incrementQuantity}
        disabled={quantity === 10}
      >
        <Ionicons 
          name="add-circle" 
          size={24} 
          color={quantity === 10 ? '#9ca3af' : '#16a34a'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  button: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    minWidth: 40,
    textAlign: 'center',
  },
});

export default QuantitySelector;
