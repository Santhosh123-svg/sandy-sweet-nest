import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductHero = ({ image, name }) => {
  return (
    <View style={styles.container}>
      <Image source={image} alt={name} style={styles.image} resizeMode="cover" />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ProductHero;
