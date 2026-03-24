import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../utils/axiosInstance';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const CompleteProfileScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = route?.params?.edit === true;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadPhone = async () => {
      const storedPhone = await AsyncStorage.getItem('phone');
      if (storedPhone) setFormData((prev) => ({ ...prev, phone: storedPhone }));
    };
    loadPhone();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const validateData = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('⚠️ All fields are mandatory.\n\nPlease fill in every field.');
      return false;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('📱 Invalid Phone Number!');
      return false;
    }
    const pincodeRegex = /\b\d{6}\b/;
    const streetCityRegex = /[a-zA-Z0-9]+\s[a-zA-Z]+/;
    if (!pincodeRegex.test(formData.address) || !streetCityRegex.test(formData.address)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setError('📝 Incomplete Address! Include street, city & 6-digit pincode.');
      return false;
    }
    return true;
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateData()) return;

    animateButton();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      '✨ Confirm Your Details ✨',
      `🧑 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n🏠 Address: ${formData.address}\n\nPlease review!`,
      [{ text: 'Edit', style: 'cancel' }, { text: 'Confirm', onPress: async () => submitProfile() }]
    );
  };

  const submitProfile = async () => {
    try {
      setLoading(true);

      // ✅ GET TOKEN
      const token = await AsyncStorage.getItem('token');

      // ✅ API CALL WITH AUTH HEADER (MAIN FIX 🔥)
      const res = await axiosInstance.put(
        '/api/auth/complete-profile',
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        await AsyncStorage.setItem('profileCompleted', 'true');
        if (res.data.user) await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.token) await AsyncStorage.setItem('token', res.data.token);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
          '🎉 Success!',
          `Your profile has been updated successfully!\n\nWelcome ${formData.name} 🎊`,
          [{ text: 'OK', onPress: () => navigation.replace('Welcome') }]
        );
      }
    } catch (err) {
      console.error('Complete profile error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('❌ Failed to update profile. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.headerIcon}>
            <Ionicons name="person-circle" size={72} color="#f59e0b" />
          </View>

          <Text style={styles.title}>{isEditMode ? 'Edit Profile' : 'Complete Profile'}</Text>
          <Text style={styles.subtitle}>{isEditMode ? 'Update your information' : 'Just a few more details!'}</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Enter your full name" value={formData.name} onChangeText={(v) => handleChange('name', v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" value={formData.phone} onChangeText={(v) => handleChange('phone', v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Include street, city, and 6-digit pincode" multiline numberOfLines={4} value={formData.address} onChangeText={(v) => handleChange('address', v)} />
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Updating...' : isEditMode ? 'Update Profile' : 'Finish Setup'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7ed' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 28, padding: 32, width: '90%', maxWidth: 400, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12 },
  headerIcon: { alignSelf: 'center', marginBottom: 20, shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 10 },
  title: { fontSize: 30, fontWeight: '900', textAlign: 'center', color: '#1f2937', marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  errorBox: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 14, padding: 14, marginBottom: 18 },
  errorText: { color: '#dc2626', fontSize: 14, fontWeight: '600' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 4, marginBottom: 6 },
  input: { width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 16, backgroundColor: '#f9fafb', fontSize: 16 },
  textArea: { height: 110, textAlignVertical: 'top' },
  button: { width: '100%', backgroundColor: '#f59e0b', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { backgroundColor: '#fcd34d' },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 17 },
});

export default CompleteProfileScreen;