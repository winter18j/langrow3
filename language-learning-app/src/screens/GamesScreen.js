import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const GAMES = [
  {
    id: 2,
    title: 'Mot à Mot',
    description: 'Trouvez la traduction correcte parmi plusieurs choix pour renforcer vos compétences linguistiques.',
    icon: 'text-outline',
    route: 'WordToWordGame',
    color: '#4ECDC4',
    requiredLevel: 1,
  },
  {
    id: 3,
    title: 'Phrases à Trous',
    description: 'Complétez les phrases avec les mots manquants pour maîtriser la grammaire et le contexte.',
    icon: 'create-outline',
    route: 'FillInBlanks',
    color: '#FFE66D',
    requiredLevel: 1,
  },
  {
    id: 4,
    title: 'Mots Mêlés',
    description: 'Démêlez les lettres pour former le bon mot. Utilisez des power-ups pour vous aider!',
    icon: 'shuffle-outline',
    route: 'WordScramble',
    color: '#99f21c',
    requiredLevel: 10,
  },
  {
    id: 1,
    title: 'Mot à Image',
    description: 'Associez les mots aux images correspondantes pour améliorer votre vocabulaire visuel.',
    icon: 'image-outline',
    route: 'WordToImageGame',
    color: '#FF6B6B',
    requiredLevel: 20,
    comingSoon: true,
  },
  {
    id: 5,
    title: 'Quiz Avancé',
    description: 'Testez vos connaissances avec des questions complexes sur la grammaire et le vocabulaire.',
    icon: 'help-circle-outline',
    route: 'AdvancedQuiz',
    color: '#6C5CE7',
    requiredLevel: 20,
    comingSoon: true,
  },
  {
    id: 6,
    title: 'Chat IA',
    description: 'Pratiquez la conversation avec une IA intelligente qui s\'adapte à votre niveau.',
    icon: 'chatbubbles-outline',
    route: 'AIChat',
    color: '#A8E6CF',
    requiredLevel: 20,
    comingSoon: true,
  },
];

export default function GamesScreen({ navigation }) {
  const userLevel = useSelector(state => state.auth.user?.level) || 1;

  const renderGameCard = ({ id, title, description, icon, color, route, requiredLevel, comingSoon }) => {
    const isLocked = userLevel < requiredLevel;
    const cardOpacity = isLocked ? 0.5 : 1;
    
    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.card,
          { borderLeftColor: color, opacity: cardOpacity }
        ]}
        onPress={() => {
          if (!isLocked && !comingSoon) {
            navigation.navigate(route);
          }
        }}
        disabled={isLocked || comingSoon}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon} size={32} color="#000000" />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>{title}</Text>
              {comingSoon && (
                <Text style={styles.comingSoonBadge}>Bientôt disponible</Text>
              )}
            </View>
            <Text style={styles.cardDescription}>{description}</Text>
            {isLocked && !comingSoon && (
              <Text style={styles.levelRequirement}>
                Débloque au niveau {requiredLevel}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.arrowContainer}>
          {!comingSoon && (
            <Ionicons 
              name={isLocked ? "lock-closed" : "chevron-forward"} 
              size={24} 
              color="#666666" 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini-Jeux</Text>
      <Text style={styles.subtitle}>Choisissez un jeu pour commencer</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {GAMES.map(renderGameCard)}
        </View>
      </ScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#99f21c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  cardDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  arrowContainer: {
    marginLeft: 12,
  },
  levelRequirement: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  comingSoonBadge: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
