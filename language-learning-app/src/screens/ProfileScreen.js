import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Détection automatique de l'URL du backend
const DEV_BACKEND_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: `http://${Constants.expoConfig.hostUri.split(':').shift()}:3000`,
});

const BACKEND_URL = __DEV__ ? DEV_BACKEND_URL : 'https://votre-url-production.com';

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const handleCheat = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/users/${user._id}/cheat-level`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      Alert.alert(
        'Niveau augmenté !',
        `Niveau : ${response.data.level}\nLigue : ${response.data.league}`
      );
    } catch (error) {
      console.error('Erreur cheat:', error);
      Alert.alert('Erreur', 'Impossible d\'augmenter le niveau');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/users/${user._id}/reset-level`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      Alert.alert(
        'Niveau réinitialisé !',
        `Niveau : ${response.data.level}\nLigue : ${response.data.league}`
      );
    } catch (error) {
      console.error('Erreur reset:', error);
      Alert.alert('Erreur', 'Impossible de réinitialiser le niveau');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Niveau: {user?.level || 1}</Text>
        <Text style={styles.infoText}>Ligue: {user?.league || 'BRONZE'}</Text>
        <Text style={styles.infoText}>Email: {user?.email}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cheatButton} onPress={handleCheat}>
          <Text style={styles.buttonText}>Augmenter le niveau (+20)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Réinitialiser le niveau</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff20',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cheatButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  resetButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});