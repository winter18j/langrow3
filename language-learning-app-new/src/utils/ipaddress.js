import Constants from 'expo-constants';

// Get the development machine's IP address from Expo's hostUri
const LOCAL_IP = Constants.expoConfig?.hostUri?.split(':')[0] || '127.0.0.1';

export const BASE_URL = `http://${LOCAL_IP}:3000`;
export const SOCKET_URL = `http://${LOCAL_IP}:3001`;

export default {
    BASE_URL,
    SOCKET_URL
}; 