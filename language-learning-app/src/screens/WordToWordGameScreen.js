import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

// Sample word pairs for demonstration
// In production, these would come from an API
const WORD_PAIRS = [
  { id: 1, word: 'Bonjour', translation: 'Hello', correct: true },
  { id: 2, word: 'Maison', translation: 'House', correct: true },
  { id: 3, word: 'Chat', translation: 'Cat', correct: true },
  { id: 4, word: 'Chien', translation: 'Dog', correct: true },
  { id: 5, word: 'Livre', translation: 'Book', correct: true },
  // Incorrect pairs for challenge
  { id: 6, word: 'Pain', translation: 'Water', correct: false },
  { id: 7, word: 'Voiture', translation: 'Bicycle', correct: false },
  { id: 8, word: 'Pomme', translation: 'Orange', correct: false },
];

export default function WordToWordGameScreen({ navigation }) {
  const [currentPair, setCurrentPair] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  
  // New animated values for feedback
  const [overlayFade] = useState(new Animated.Value(0));
  const [scorePop] = useState(new Animated.Value(0));
  const [scoreOpacity] = useState(new Animated.Value(0));
  const [heartShake] = useState(new Animated.Value(0));
  
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const API_URL = 'http://192.168.0.5:3000';

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    // Randomly select a word pair
    const randomIndex = Math.floor(Math.random() * WORD_PAIRS.length);
    const newPair = WORD_PAIRS[randomIndex];

    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentPair(newPair);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateCorrectAnswer = () => {
    // Reset animations
    scorePop.setValue(0);
    scoreOpacity.setValue(0);
    overlayFade.setValue(0);

    // Animate overlay
    Animated.sequence([
      Animated.timing(overlayFade, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(overlayFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate score popup
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scoreOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scoreOpacity, {
          toValue: 0,
          duration: 300,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scorePop, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scorePop, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const animateWrongAnswer = () => {
    // Reset animations
    heartShake.setValue(0);
    overlayFade.setValue(0);

    // Animate overlay
    Animated.sequence([
      Animated.timing(overlayFade, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(overlayFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate heart shake
    Animated.sequence([
      Animated.timing(heartShake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartShake, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartShake, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = async (isCorrect) => {
    if (isCorrect === currentPair.correct) {
      // Correct answer
      animateCorrectAnswer();
      setScore(score + 10);
      setProgress(progress + 1);
      
      if (progress + 1 >= 10) {
        // Game completed successfully
        try {
          await axios.patch(
            `${API_URL}/users/${user._id}/game-stats`,
            {
              xpGained: score,
              timeSpent: 5,
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          Alert.alert(
            'Félicitations!',
            `Vous avez terminé le jeu avec ${score} points!`,
            [
              {
                text: 'Retour aux jeux',
                onPress: () => navigation.goBack(),
              }
            ]
          );
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      } else {
        setTimeout(startNewRound, 500);
      }
    } else {
      // Wrong answer
      animateWrongAnswer();
      setLives(lives - 1);
      if (lives <= 1) {
        Alert.alert(
          'Game Over',
          `Votre score final: ${score} points`,
          [
            {
              text: 'Réessayer',
              onPress: () => {
                setLives(3);
                setScore(0);
                setProgress(0);
                startNewRound();
              },
            },
            {
              text: 'Retour aux jeux',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        setTimeout(startNewRound, 500);
      }
    }
  };

  if (loading || !currentPair) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#99f21c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Feedback overlays */}
      <Animated.View 
        style={[
          styles.overlay,
          { 
            backgroundColor: '#99f21c',
            opacity: overlayFade 
          }
        ]} 
        pointerEvents="none"
      />
      <Animated.View 
        style={[
          styles.overlay,
          { 
            backgroundColor: '#FF4444',
            opacity: overlayFade 
          }
        ]} 
        pointerEvents="none"
      />

      {/* Score popup animation */}
      <Animated.View
        style={[
          styles.scorePopup,
          {
            transform: [{ translateY: scorePop }],
            opacity: scoreOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.scorePopupText}>+10</Text>
        <Ionicons name="trophy" size={24} color="#FFD700" />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Animated.View 
            style={[
              styles.stat,
              {
                transform: [{ translateX: heartShake }],
              },
            ]}
          >
            <Ionicons name="heart" size={20} color="#FF4444" />
            <Text style={styles.statText}>{lives}</Text>
          </Animated.View>
          <View style={styles.stat}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.statText}>{score}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progress}/10</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameContainer}>
        <Text style={styles.instruction}>Ces mots correspondent-ils ?</Text>
        
        <Animated.View
          style={[
            styles.wordContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Text style={styles.word}>{currentPair.word}</Text>
          <Ionicons name="arrow-down" size={32} color="#666666" />
          <Text style={styles.translation}>{currentPair.translation}</Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.answerButton, styles.wrongButton]}
            onPress={() => handleAnswer(false)}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.answerButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}
          >
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  progressContainer: {
    backgroundColor: '#222222',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: '#99f21c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    fontFamily: 'monospace',
  },
  wordContainer: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 60,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  translation: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#99f21c',
    fontFamily: 'monospace',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  answerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongButton: {
    backgroundColor: '#FF4444',
  },
  correctButton: {
    backgroundColor: '#99f21c',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scorePopup: {
    position: 'absolute',
    top: '50%',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  scorePopupText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
