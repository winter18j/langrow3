import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login log: ', resultAction);
      if (resultAction.access_token) {
        navigation.navigate('Map');
      }
    } catch (err) {
      // Error is handled by the redux slice
      console.error('Login failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Pas encore de compte?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          Inscrivez-vous ici
        </Text>
      </Text>

      <Text 
        style={styles.simulateLink} 
        onPress={() => navigation.navigate('Map')}
      >
        Simuler le jeu ici
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
