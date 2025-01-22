import { StatusBar } from 'expo-status-bar';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { selectLoggedIn, clearLevelUpNotification } from './src/redux/slices/authSlice';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from './src/services/NotificationService';



const WelcomeScreen = lazy(() => import('./src/screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('./src/screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./src/screens/RegisterScreen'));
const MapScreen = lazy(() => import('./src/screens/MapScreen'));
const ProfileScreen = lazy(() => import('./src/screens/ProfileScreen'));
const GamesScreen = lazy(() => import('./src/screens/GamesScreen'));
const LeaderboardScreen = lazy(() => import('./src/screens/LeaderboardScreen'));
const WordToImageGameScreen = lazy(() => import('./src/screens/WordToImageGameScreen'));
const WordToWordGameScreen = lazy(() => import('./src/screens/WordToWordGameScreen'));
const FillInBlanksScreen = lazy(() => import('./src/screens/FillInBlanksScreen'));
const WordScrambleScreen = lazy(() => import('./src/screens/WordScrambleScreen'));

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
      <Stack.Screen name="WordToImageGame">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <WordToImageGameScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="WordToWordGame">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <WordToWordGameScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="FillInBlanks">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <FillInBlanksScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="WordScramble">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <WordScrambleScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const LevelUpNotification = ({ notification, onDismiss }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (notification) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  const isLevelUp = notification.type === 'LEVEL_UP';
  const icon = isLevelUp ? 'trending-up' : 'trophy';
  const color = isLevelUp ? '#99f21c' : '#FFD700';

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
          borderLeftColor: color,
        },
      ]}
    >
      <View style={styles.notificationContent}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>
            {isLevelUp ? '🎉 Niveau Supérieur!' : '🏆 Nouvelle Ligue!'}
          </Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const RootNavigator = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();
  const levelUpNotification = useSelector(state => state.auth.levelUpNotification);

  useEffect(() => {
    if (isLoggedIn) {
      NotificationService.init().catch(error => {
        console.error('Failed to initialize notifications:', error);
      });
    }
  }, [isLoggedIn]);

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      <LevelUpNotification
        notification={levelUpNotification}
        onDismiss={() => dispatch(clearLevelUpNotification())}
      />
    </View>
  );
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
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111111',
    margin: 16,
    marginTop: 60,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#99f21c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  notificationMessage: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});