import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const images = [
    require('../resources/slides/slide1.png'),
    require('../resources/slides/slide2.png'),
    require('../resources/slides/slide3.png'),
  ];

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../resources/langrowlogo.png')}
      />
      <Text style={styles.title}>Apprends une Langue de Façon Ludique!</Text>
      <Text style={styles.description}>
        Rejoignez-nous et découvrez une façon amusante d'apprendre des langues avec des leçons, des mini-jeux, et plus encore.
      </Text>

      {/* Slideshow */}
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.slideImage} />
        )}
        style={styles.slideshow}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  slideshow: {
    height: 150,
    marginBottom: 40, // Added space between slideshow and description
  },
  slideImage: {
    width: 300,
    height: 150,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
