import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CakeOptions = ({ 
  flavor, 
  setFlavor, 
  size, 
  setSize, 
  quantity, 
  setQuantity 
}) => {
  return (
    <View style={styles.container}>
      {/* FLAVOR SELECTOR */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Select Flavour</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={flavor}
            onValueChange={setFlavor}
            style={styles.picker}
          >
            <Picker.Item label="Select Flavour" value="" />
            <Picker.Item label="Chocolate" value="Chocolate" />
            <Picker.Item label="Vanilla" value="Vanilla" />
            <Picker.Item label="Red Velvet" value="Red Velvet" />
          </Picker>
        </View>
      </View>

      {/* SIZE SELECTOR */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Size & Weight</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={size}
            onValueChange={setSize}
            style={styles.picker}
          >
            <Picker.Item label="Size & Weight" value="" />
            <Picker.Item label="0.5 Kg" value="0.5 Kg" />
            <Picker.Item label="1 Kg" value="1 Kg" />
            <Picker.Item label="2 Kg" value="2 Kg" />
          </Picker>
        </View>
      </View>

      {/* QUANTITY INPUT */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(parseInt(text) || 0)}
        />
      </View>
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
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  },
});

export default CakeOptions;
