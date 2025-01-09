import { StatusBar } from 'expo-status-bar';
import React, { lazy, Suspense } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from './src/redux/slices/authSlice';



const WelcomeScreen = lazy(() => import('./src/screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('./src/screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./src/screens/RegisterScreen'));
const MapScreen = lazy(() => import('./src/screens/MapScreen'));
const ProfileScreen = lazy(() => import('./src/screens/ProfileScreen'));

const Stack = createStackNavigator();
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'monospace' };


const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#000" />
  </View>
);


const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="WelcomeScreen">
      {(props) => (
        <Suspense fallback={<LoadingScreen />}>
          <WelcomeScreen {...props} />
        </Suspense>
      )}
    </Stack.Screen>
    <Stack.Screen name="LoginScreen">
      {(props) => (
        <Suspense fallback={<LoadingScreen />}>
          <LoginScreen {...props} />
        </Suspense>
      )}
    </Stack.Screen>
    <Stack.Screen name="RegisterScreen">
      {(props) => (
        <Suspense fallback={<LoadingScreen />}>
          <RegisterScreen {...props} />
        </Suspense>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);


const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="Map">
      {(props) => (
        <Suspense fallback={<LoadingScreen />}>
          <MapScreen {...props} />
        </Suspense>
      )}
    </Stack.Screen>
    <Stack.Screen name="Profile">
      {(props) => (
        <Suspense fallback={<LoadingScreen />}>
          <ProfileScreen {...props} />
        </Suspense>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);


const RootNavigator = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  return isLoggedIn ? <MainNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style={styles.navbar} />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar: {
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});