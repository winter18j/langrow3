import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MapScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carte Interactive</Text>
      <Text style={styles.text}>Explorez les langues les plus étudiées dans le monde !</Text>
      {/* Placeholder for map */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapText}>Carte à venir...</Text>
      </View>
      <Button title="Voir Profil" onPress={() => navigation.navigate('ProfileScreen')} />
      <Button title="Mini-Jeux" onPress={() => navigation.navigate('GamesScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  mapContainer: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  mapText: { fontSize: 18, color: '#777' },
});
