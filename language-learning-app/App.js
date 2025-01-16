import { StatusBar } from 'expo-status-bar';
import React, { lazy, Suspense } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from './src/redux/slices/authSlice';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';



const WelcomeScreen = lazy(() => import('./src/screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('./src/screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./src/screens/RegisterScreen'));
const MapScreen = lazy(() => import('./src/screens/MapScreen'));
const ProfileScreen = lazy(() => import('./src/screens/ProfileScreen'));
const GamesScreen = lazy(() => import('./src/screens/GamesScreen'));
const LeaderboardScreen = lazy(() => import('./src/screens/LeaderboardScreen'));
const WordToWordGameScreen = lazy(() => import('./src/screens/WordToWordGameScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
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


const MainNavigator = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#99f21c',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'monospace',
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: 'Carte'
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'game-controller' : 'game-controller-outline'}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: 'Jeux'
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'trophy' : 'trophy-outline'}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: 'Classement'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: 'Profil'
        }}
      />
    </Tab.Navigator>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="WordToWordGame">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <WordToWordGameScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};


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