import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const QuantityOnly = ({ quantity, setQuantity }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity.toString()}
        onChangeText={(text) => setQuantity(parseInt(text) || 0)}
      />
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
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
});

export default QuantityOnly;
