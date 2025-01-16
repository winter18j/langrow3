import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const renderFeatureItem = (icon, title, description) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color="#99f21c" />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <LinearGradient
          colors={['rgba(153, 242, 28, 0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.accentGradient}
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.appName}>LangRow</Text>
            <Text style={styles.tagline}>Apprenez une langue en explorant le monde</Text>
          </View>

          <View style={styles.features}>
            {renderFeatureItem(
              'map-outline',
              'Explorez',
              'Découvrez des apprenants près de chez vous'
            )}
            {renderFeatureItem(
              'game-controller-outline',
              'Jouez',
              'Progressez avec des mini-jeux amusants'
            )}
            {renderFeatureItem(
              'trophy-outline',
              'Progressez',
              'Gagnez des points et montez en ligue'
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Ionicons name="log-in-outline" size={24} color="#000000" />
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('RegisterScreen')}
            >
              <Ionicons name="person-add-outline" size={24} color="#FFFFFF" />
              <Text style={styles.registerButtonText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En continuant, vous acceptez nos{' '}
              <Text style={styles.footerLink}>conditions d'utilisation</Text>
              {' '}et notre{' '}
              <Text style={styles.footerLink}>politique de confidentialité</Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  accentGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    fontFamily: 'monospace',
    maxWidth: '80%',
  },
  features: {
    marginBottom: 48,
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(153, 242, 28, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(153, 242, 28, 0.2)',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  featureDescription: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'monospace',
  },
  buttons: {
    gap: 16,
    marginBottom: 24,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99f21c',
    borderRadius: 12,
    height: 56,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'monospace',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    gap: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  footerLink: {
    color: '#99f21c',
    textDecorationLine: 'underline',
  },
});
