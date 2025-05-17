import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchWords,
  startGame,
  endGame,
  setCurrentWord,
  updateTimeLeft,
  incrementScore,
  resetCombo,
  activatePowerUp,
  deactivatePowerUp,
} from '../redux/slices/wordScrambleSlice';
import { updateUserData } from '../redux/slices/authSlice';
import axios from 'axios';
import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://192.168.1.28:3000';

export default function WordScrambleScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const {
    words,
    currentWord,
    status,
    error,
    gameState,
    score,
    combo,
    powerUps,
    activePowerUps,
    selectedPowerUps,
    scrambledLetters,
    revealedLetters,
    showTranslation,
  } = useSelector(state => state.wordScramble);

  // Animations
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [overlayFade] = useState(new Animated.Value(0));
  const [scorePop] = useState(new Animated.Value(0));
  const [scoreOpacity] = useState(new Animated.Value(0));
  const [comboScale] = useState(new Animated.Value(1));
  const [letterScales, setLetterScales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  // Game state
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [gameTimer, setGameTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (user?.learnedLanguage) {
      dispatch(startGame());
      dispatch(fetchWords({ 
        language: user.learnedLanguage,
        level: user.level
      }));
    } else {
      setAlertConfig({
        visible: true,
        title: 'Language Not Set',
        message: 'Please set your learning language in your profile first.',
        buttons: [
          {
            text: 'Go to Profile',
            icon: 'person',
            onPress: () => navigation.navigate('Profile')
          }
        ]
      });
    }

    return () => {
      if (gameTimer) clearInterval(gameTimer);
    };
  }, [dispatch, user?.learnedLanguage]);

  useEffect(() => {
    if (status === 'succeeded' && words.length > 0) {
      startNewRound();
    } else if (status === 'succeeded' && words.length === 0) {
      Alert.alert(
        'No Words Available',
        'No words are available for your language. Please try generating some first.',
        [
          {
            text: 'Generate Words',
            onPress: async () => {
              try {
                setLoading(true);
                await axios.post(
                  `${API_URL}/word-scramble/seed`,
                  {
                    language: user.learnedLanguage,
                    words: [
                      {
                        word: 'bonjour',
                        translation: 'hello',
                        difficulty: 1,
                        minLevel: 1,
                        timeAllowed: 20
                      },
                      {
                        word: 'maison',
                        translation: 'house',
                        difficulty: 2,
                        minLevel: 1,
                        timeAllowed: 25
                      },
                      {
                        word: 'ordinateur',
                        translation: 'computer',
                        difficulty: 3,
                        minLevel: 3,
                        timeAllowed: 30
                      }
                    ]
                  }
                );
                dispatch(fetchWords({ 
                  language: user.learnedLanguage,
                  level: user.level
                }));
              } catch (error) {
                console.error('Error generating words:', error);
                Alert.alert('Error', 'Failed to generate words');
              } finally {
                setLoading(false);
              }
            }
          },
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel'
          }
        ]
      );
    }
  }, [status, words, gameState]);

  useEffect(() => {
    if (scrambledLetters && scrambledLetters.length > 0) {
      const newScales = scrambledLetters.map(() => new Animated.Value(1));
      setLetterScales(newScales);
      setIsAnimationReady(true);
    } else {
      setIsAnimationReady(false);
    }
  }, [scrambledLetters]);

  const startNewRound = useCallback(() => {
    if (words.length === 0) return;

    // Randomly select a word
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];

    // Clear existing timer
    if (gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }

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
      dispatch(setCurrentWord(newWord));
      setTimeLeft(newWord.timeAllowed);
      setSelectedLetters([]);
      
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

      // Start new timer after animations
      const timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 0) {
            clearInterval(timer);
            handleGameOver();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
      setGameTimer(timer);
    });
  }, [words, fadeAnim, slideAnim, dispatch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, [gameTimer]);

  const handleLetterPress = (letter, index) => {
    if (!letterScales[index]) return;

    // Animate letter press
    Animated.sequence([
      Animated.timing(letterScales[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(letterScales[index], {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedLetters([...selectedLetters, { letter, index }]);

    // Check if word is complete
    const newWord = [...selectedLetters, { letter, index }]
      .map(l => l.letter)
      .join('');

    if (newWord.length === currentWord.word.length) {
      if (newWord === currentWord.word) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    }
  };

  const handleCorrectAnswer = () => {
    // Calculate score based on time left and combo
    const timeBonus = Math.floor(timeLeft * 0.5);
    const comboBonus = Math.floor(combo * 0.2);
    const wordScore = 10 + timeBonus + comboBonus;

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
      Animated.sequence([
        Animated.timing(comboScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(comboScale, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    dispatch(incrementScore(wordScore));
    startNewRound();
  };

  const handleWrongAnswer = () => {
    // Shake animation for wrong answer
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(resetCombo());
    setSelectedLetters([]);
  };

  const handleGameOver = async () => {
    if (gameTimer) clearInterval(gameTimer);
    dispatch(endGame());

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
      
      dispatch(updateUserData(user._id));
      
      setAlertConfig({
        visible: true,
        title: '🎮 Game Over!',
        message: `Final Score: ${score} points\nBest Combo: ${combo}x`,
        buttons: [
          {
            text: 'Back to Games',
            icon: 'game-controller',
            onPress: () => navigation.goBack()
          },
          {
            text: 'Play Again',
            icon: 'refresh',
            onPress: () => {
              dispatch(startGame());
              startNewRound();
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handlePowerUpPress = (powerUp) => {
    if (user.coins >= powerUp.cost) {
      dispatch(activatePowerUp(powerUp));
      // Update user's coins in the backend
      axios.patch(
        `${API_URL}/users/${user._id}/coins`,
        {
          amount: -powerUp.cost,
          source: 'power-up'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } else {
      Alert.alert(
        'Not Enough Coins',
        'Watch an ad or purchase coins to use power-ups!',
        [
          {
            text: 'Watch Ad',
            onPress: () => {
              // TODO: Implement ad watching
              Alert.alert('Coming Soon', 'Ad system coming soon!');
            }
          },
          {
            text: 'Buy Coins',
            onPress: () => {
              // TODO: Implement in-app purchase
              Alert.alert('Coming Soon', 'In-app purchases coming soon!');
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const handleLetterRemove = (index) => {
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
  };

  // Render letter with animation
  const renderLetter = (letter, index) => {
    if (!isAnimationReady || !letterScales[index]) {
      return (
        <View key={index} style={styles.letterWrapper}>
          <TouchableOpacity
            style={[
              styles.letter,
              selectedLetters.some(l => l.index === index) && styles.letterSelected,
              revealedLetters[index] && styles.letterRevealed,
            ]}
            onPress={() => handleLetterPress(letter, index)}
            disabled={selectedLetters.some(l => l.index === index)}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        key={index}
        style={[
          styles.letterWrapper,
          {
            transform: [{ scale: letterScales[index] }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.letter,
            selectedLetters.some(l => l.index === index) && styles.letterSelected,
            revealedLetters[index] && styles.letterRevealed,
          ]}
          onPress={() => handleLetterPress(letter, index)}
          disabled={selectedLetters.some(l => l.index === index)}
        >
          <Text style={styles.letterText}>{letter}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading || status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#99f21c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="timer" size={20} color="#FFFFFF" />
            <Text style={styles.statText}>{timeLeft}s</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.statText}>{score}</Text>
          </View>
          <Animated.View 
            style={[
              styles.stat,
              { transform: [{ scale: comboScale }] }
            ]}
          >
            <Text style={[styles.statText, styles.comboText]}>
              {combo}x
            </Text>
          </Animated.View>
        </View>
      </View>

      <View style={styles.gameContainer}>
        {currentWord && (
          <>
            <Animated.View
              style={[
                styles.wordContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {showTranslation && (
                <Text style={styles.translation}>
                  {currentWord.translation}
                </Text>
              )}
              
              <View style={styles.lettersContainer}>
                {scrambledLetters.map((letter, index) => renderLetter(letter, index))}
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedContainer}
              >
                {selectedLetters.map((letterObj, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectedLetter}
                    onPress={() => handleLetterRemove(index)}
                  >
                    <Text style={styles.selectedLetterText}>
                      {letterObj.letter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            <View style={styles.powerUpsContainer}>
              {powerUps.map(powerUp => (
                <TouchableOpacity
                  key={powerUp.id}
                  style={[
                    styles.powerUpButton,
                    activePowerUps.some(p => p.id === powerUp.id) && styles.powerUpActive,
                  ]}
                  onPress={() => handlePowerUpPress(powerUp)}
                  disabled={activePowerUps.some(p => p.id === powerUp.id)}
                >
                  <Ionicons 
                    name={powerUp.icon} 
                    size={24} 
                    color={activePowerUps.some(p => p.id === powerUp.id) ? '#99f21c' : '#FFFFFF'} 
                  />
                  <Text style={styles.powerUpCost}>{powerUp.cost} 🪙</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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
  comboText: {
    color: '#99f21c',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wordContainer: {
    alignItems: 'center',
    width: '100%',
  },
  translation: {
    color: '#99f21c',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxWidth: '100%',
  },
  letterWrapper: {
    margin: 5,
  },
  letter: {
    width: 50,
    height: 50,
    backgroundColor: '#222222',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  letterSelected: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  letterRevealed: {
    borderColor: '#99f21c',
    borderWidth: 2,
  },
  letterText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minHeight: 60,
  },
  selectedLetter: {
    width: 40,
    height: 40,
    backgroundColor: '#99f21c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selectedLetterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  powerUpsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  powerUpButton: {
    width: 60,
    height: 60,
    backgroundColor: '#222222',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  powerUpActive: {
    backgroundColor: '#333333',
    borderColor: '#99f21c',
  },
  powerUpCost: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
}); 