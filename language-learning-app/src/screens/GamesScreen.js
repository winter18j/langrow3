import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { NotificationService } from '../services/NotificationService';
import { League } from '../enums/league.enum';
import * as Notifications from 'expo-notifications';

const games = [
  {
    id: 1,
    title: 'Mot à Image',
    description: 'Associez les mots aux images correspondantes',
    requiredLeague: League.Bronze,
    route: 'WordToImageGameScreen'
  },
  {
    id: 2,
    title: 'Mot à Mot',
    description: 'Traduisez les mots dans la langue cible',
    requiredLeague: League.Argent,
    route: 'WordToWordGameScreen'
  },
  {
    id: 3,
    title: 'Phrases à Trous',
    description: 'Complétez les phrases avec les mots manquants',
    requiredLeague: League.Or,
    route: 'FillInBlanksScreen'
  },
  {
    id: 4,
    title: 'Quiz Avancé',
    description: 'Testez vos connaissances avec des questions avancées',
    requiredLeague: League.Paltine,
    route: 'AdvancedQuizScreen'
  },
  {
    id: 5,
    title: 'Conversation AI',
    description: 'Pratiquez avec une conversation AI quasi réelle',
    requiredLeague: League.Diamond,
    route: 'AIChatScreen'
  }
];

export default function GamesScreen({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initNotifications = async () => {
      try {
        if (user?._id) {
          console.log('Initialisation des notifications pour l\'utilisateur:', user._id);
          const pushToken = await NotificationService.registerForPushNotifications();
          
          if (pushToken) {
            console.log('Token obtenu:', pushToken);
            await NotificationService.updateUserToken(user._id, pushToken);
            
            await testLocalNotification();
          } else {
            console.log('Impossible d\'obtenir le token de notification');
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des notifications:', error);
      }
    };

    initNotifications();
  }, [user?._id]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
      // Ajouter ici la logique pour afficher la notification dans l'application
    });

    return () => subscription.remove();
  }, []);

  const testLocalNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎮 Test de Notification",
          body: "Félicitations ! Vous avez débloqué un nouveau jeu !",
          data: {
            type: 'GAME_UNLOCK',
            league: 'SILVER',
            unlockedGames: JSON.stringify(['Mot à Mot'])
          },
        },
        trigger: null,
      });
      console.log('Notification de test envoyée');
      Alert.alert('Succès', 'Notification de test envoyée !');
    } catch (error) {
      console.error('Erreur notification:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer la notification de test');
    }
  };

  const isGameUnlocked = (requiredLeague) => {
    const leagueValues = {
      [League.Bronze]: 1,
      [League.Argent]: 2,
      [League.Or]: 3,
      [League.Paltine]: 4,
      [League.Diamond]: 5,
      [League.Maître]: 6
    };
    return leagueValues[user?.league] >= leagueValues[requiredLeague];
  };

  const getLeagueName = (league) => {
    switch (league) {
      case 'BRONZE': return 'BRONZE';
      case 'SILVER': return 'ARGENT';
      case 'GOLD': return 'OR';
      case 'PLATINUM': return 'PLATINE';
      case 'DIAMOND': return 'DIAMANT';
      case 'MASTER': return 'MAÎTRE';
      default: return league;
    }
  };

  const renderGame = ({ item }) => {
    const isUnlocked = isGameUnlocked(item.requiredLeague);
    
    return (
      <TouchableOpacity
        style={[
          styles.gameCard,
          { opacity: isUnlocked ? 1 : 0.6 }
        ]}
        onPress={() => handleGamePress(item, isUnlocked)}
      >
        <Image source={item.image} style={styles.gameImage} />
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{item.title}</Text>
          {!isUnlocked && (
            <Text style={styles.lockText}>
              Débloqué en ligue {getLeagueName(item.requiredLeague)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini-Jeux</Text>
      <Text style={styles.subtitle}>
        Votre ligue actuelle : {user?.league || 'Non classé'}
      </Text>
      
      <TouchableOpacity
        style={styles.testButton}
        onPress={testLocalNotification}
      >
        <Text style={styles.testButtonText}>Tester les notifications</Text>
      </TouchableOpacity>

      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gamesList}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  gamesList: {
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedGame: {
    opacity: 0.7,
    backgroundColor: '#cccccc',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  lockText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignSelf: 'center',
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
