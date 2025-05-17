import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      type: 'Point',
      coordinates: [location.coords.longitude, location.coords.latitude]
    };
  } catch (error) {
    console.error('Error getting location:', error);
    // Return a default location (you might want to handle this differently)
    return {
      type: 'Point',
      coordinates: [2.3522, 48.8566] // Default to Paris coordinates
    };
  }
};