import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Language } from '../enums/language.enum';

const LANGUAGE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  sp: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷'
};

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    nickname: '',
    mainLanguage: 'fr',
    learnedLanguage: 'en',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
    }
  }, [error]);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (Object.values(formData).some(value => !value)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const userData = {
        ...formData,
        location: '48.8566,2.3522' // Default to Paris for now
      };
      delete userData.confirmPassword;
      
      const resultAction = await dispatch(registerUser(userData)).unwrap();
      if (resultAction.access_token) {
        navigation.navigate('Map');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const renderInputIcon = (iconName, isFocused) => (
    <View style={styles.inputIcon}>
      <Ionicons 
        name={iconName} 
        size={20} 
        color={isFocused ? '#99f21c' : '#666666'} 
      />
    </View>
  );

  const renderInput = (field, placeholder, icon, keyboardType = 'default', secureTextEntry = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <View style={[
        styles.inputContainer,
        focusedInput === field && styles.inputContainerFocused
      ]}>
        {renderInputIcon(icon, focusedInput === field)}
        <TextInput
          style={styles.input}
          placeholder={`Votre ${placeholder.toLowerCase()}`}
          placeholderTextColor="#666666"
          value={formData[field]}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          onFocus={() => setFocusedInput(field)}
          onBlur={() => setFocusedInput(null)}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#666666" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderLanguagePicker = (field, label) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData[field]}
          onValueChange={(value) => setFormData({ ...formData, [field]: value })}
          style={styles.picker}
          dropdownIconColor="#666666"
        >
          {Object.entries(Language).map(([key, value]) => (
            <Picker.Item 
              key={value} 
              label={`${LANGUAGE_FLAGS[value]} ${key}`} 
              value={value} 
              color="#FFFFFF"
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté LangRow</Text>
        </View>

        <View style={styles.formContainer}>
          {renderInput('firstName', 'Prénom', 'person-outline')}
          {renderInput('lastName', 'Nom', 'people-outline')}
          {renderInput('nickname', 'Pseudo', 'at-outline')}
          {renderInput('email', 'Email', 'mail-outline', 'email-address')}
          {renderInput('password', 'Mot de passe', 'lock-closed-outline', 'default', true)}
          {renderInput('confirmPassword', 'Confirmer le mot de passe', 'lock-closed-outline', 'default', true)}
          
          {renderLanguagePicker('mainLanguage', 'Langue maternelle')}
          {renderLanguagePicker('learnedLanguage', 'Langue à apprendre')}

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="sync" size={24} color="#000000" style={styles.loadingIcon} />
                <Text style={styles.buttonText}>Chargement...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="person-add-outline" size={24} color="#000000" />
                <Text style={styles.buttonText}>S'inscrire</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Déjà un compte ?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              Connectez-vous ici
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'monospace',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: '#99f21c',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  showPasswordButton: {
    padding: 8,
  },
  pickerContainer: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    height: 56,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99f21c',
    borderRadius: 12,
    height: 56,
    marginTop: 20,
    gap: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  loginLink: {
    color: '#99f21c',
    textDecorationLine: 'underline',
  },
});