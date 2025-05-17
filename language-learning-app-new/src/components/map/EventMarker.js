import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function EventMarker({ coordinate, onPress, attendees = 0 }) {
  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={styles.marker}>
          <Ionicons name="calendar" size={16} color="#FFFFFF" />
        </View>
        {attendees > 0 && (
          <View style={styles.attendeesBadge}>
            <View style={styles.attendeesDot} />
          </View>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: '#222222',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  attendeesBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#222222',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  attendeesDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
}); 