import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventCard({ event, onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.eventType}>
          <Ionicons name="calendar" size={20} color="#99f21c" />
          <Text style={styles.eventTypeText}>{event.type}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.location}>{event.location}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#666666" />
            <Text style={styles.detailText}>{event.date} at {event.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={16} color="#666666" />
            <Text style={styles.detailText}>{event.attendees} attending</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="language" size={16} color="#666666" />
            <Text style={styles.detailText}>{event.languages.join(' • ')}</Text>
          </View>
        </View>

        <Text style={styles.description}>{event.description}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true}>
          <Ionicons name="checkmark-circle" size={20} color="#666666" />
          <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
            Join Event
          </Text>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Share</Text>
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
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventTypeText: {
    color: '#99f21c',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  location: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
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