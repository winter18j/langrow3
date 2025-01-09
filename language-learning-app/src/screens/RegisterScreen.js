import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { LanguageSelector } from '../components/LanguageSelector.js';
import { Language } from '../enums/language.enum.js';
import * as Location from 'expo-location';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    nickname: '',
    mainLanguage: Language.FRENCH, // Default value
    learnedLanguage: Language.ENGLISH, // Default value
    location: {
      type: 'Point',
      coordinates: [0, 0] // Will be updated with actual location
    }
  });
  


  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearError());
    // Here you would typically get the user's location
    // You'll need to implement location permissions and retrieval
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        location: `${location.coords.latitude},${location.coords.longitude}`
      }));
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
    }
  }, [error]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    // Basic validation
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'nickname'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      console.log('Registering user:', formData);
      const resultAction = await dispatch(registerUser(formData)).unwrap();
      if (resultAction.access_token) {
        navigation.navigate('Map');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Erreur lors de l\'inscription, veuillez réssayer plus tard.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#000"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#000"
        value={formData.firstName}
        onChangeText={(value) => handleChange('firstName', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#000"
        value={formData.lastName}
        onChangeText={(value) => handleChange('lastName', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor="#000"
        value={formData.nickname}
        onChangeText={(value) => handleChange('nickname', value)}
      />
      
      <LanguageSelector
        value={formData.mainLanguage}
        onValueChange={(value) => handleChange('mainLanguage', value)}
        label="Langue maternelle"
      />

      <LanguageSelector
        value={formData.learnedLanguage}
        onValueChange={(value) => handleChange('learnedLanguage', value)}
        label="Langue apprise"
      />

      <TouchableOpacity 
        style={[styles.buttonreg, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Chargement..." : "S'inscrire"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    borderRadius: 5,
  },
  buttonreg: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    borderRadius: 0,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#fff',
  },
  registerLink: {
    color: '#99f21c',
    textDecorationLine: 'underline',
  },
  simulateLink: {
    color: '#99f21c',
    textDecorationLine: 'underline',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});