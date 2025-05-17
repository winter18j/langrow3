import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export default function PartnerCard({ partner, onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {partner.isOnline && (
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {partner.firstName[0]}{partner.lastName[0]}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{partner.firstName} {partner.lastName[0]}.</Text>
          <View style={styles.languages}>
            <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[partner.nativeLanguage]}</Text>
            <Ionicons name="arrow-forward" size={16} color="#666666" />
            <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[partner.learningLanguage]}</Text>
          </View>
          <Text style={styles.distance}>{partner.distance} km away</Text>
          <Text style={styles.bio}>{partner.bio}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonDisabled]}
          disabled={true}
        >
          <Ionicons name="chatbubbles" size={20} color="#666666" />
          <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
            Message
          </Text>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="person" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 'auto',
    elevation: 5,
    shadowColor: '#99f21c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#99f21c',
  },
  onlineText: {
    color: '#99f21c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#99f21c',
  },
  avatarText: {
    color: '#99f21c',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  languages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  languageFlag: {
    fontSize: 20,
  },
  distance: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  bio: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  buttonTextDisabled: {
    color: '#666666',
  },
  comingSoon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#666666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
}); 