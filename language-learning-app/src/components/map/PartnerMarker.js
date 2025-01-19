import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function PartnerMarker({ coordinate, onPress, isOnline }) {
  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, isOnline && styles.markerOnline]}>
          <Ionicons name="people" size={16} color="#FFFFFF" />
        </View>
        {isOnline && <View style={styles.onlineDot} />}
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
    borderColor: '#99f21c',
  },
  markerOnline: {
    borderColor: '#99f21c',
  },
  onlineDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#99f21c',
    borderWidth: 1,
    borderColor: '#000000',
  },
}); 