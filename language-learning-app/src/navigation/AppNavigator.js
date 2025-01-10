import React, { lazy, Suspense } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Screens
const WelcomeScreen = lazy(() => import('../screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('../screens/LoginScreen'));
const RegisterScreen = lazy(() => import('../screens/RegisterScreen'));
const MapScreen = lazy(() => import('../screens/MapScreen'));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen'));
const GamesScreen = lazy(() => import('../screens/GamesScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#000" />
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000',
        borderTopColor: '#333',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarActiveTintColor: '#99f21c',
      tabBarInactiveTintColor: '#666',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Carte') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Jeux') {
          iconName = focused ? 'game-controller' : 'game-controller-outline';
        } else if (route.name === 'Profil') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen name="Carte" component={MapScreen} />
    <Tab.Screen name="Jeux" component={GamesScreen} />
    <Tab.Screen name="Profil" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
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

const AppNavigator = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);

  if (user) {
    global.userId = user._id;
    global.token = state.auth.token;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator; 