import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function QuestMarker({ coordinate, onPress, type = 'default' }) {
  const getMarkerColor = () => {
    switch (type) {
      case 'restaurant':
        return '#FF6B6B';
      case 'library':
        return '#4ECDC4';
      case 'park':
        return '#45B7D1';
      case 'cafe':
        return '#96CEB4';
      default:
        return '#99f21c';
    }
  };

  const getMarkerIcon = () => {
    switch (type) {
      case 'restaurant':
        return 'restaurant';
      case 'library':
        return 'book';
      case 'park':
        return 'leaf';
      case 'cafe':
        return 'cafe';
      default:
        return 'trophy';
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { borderColor: getMarkerColor() }]}>
          <Ionicons name={getMarkerIcon()} size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.pointer, { backgroundColor: getMarkerColor() }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: '#222222',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#99f21c',
  },
  pointer: {
    width: 8,
    height: 8,
    backgroundColor: '#99f21c',
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
}); 