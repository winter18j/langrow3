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
import { fetchWordPairs } from '../redux/slices/wordPairsSlice';
import { updateUserData } from '../redux/slices/authSlice';
import axios from 'axios';
import CustomAlert from '../components/CustomAlert';
import { BASE_URL } from '../utils/ipaddress';

const { width, height } = Dimensions.get('window');

const API_URL = BASE_URL;

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
  const [winAnimation] = useState(new Animated.Value(0));
  const [loseAnimation] = useState(new Animated.Value(0));
  const [xpGaugeAnimation] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const { pairs, status, error } = useSelector(state => state.wordPairs);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  useEffect(() => {
    console.log('User:', user);
    console.log('Learned Language:', user?.learnedLanguage);
    console.log('Main Language:', user?.mainLanguage);
    // Fetch word pairs when component mounts
    if (user?.learnedLanguage && user?.mainLanguage) {
      console.log('Fetching word pairs for languages:', user.mainLanguage, user.learnedLanguage);
      dispatch(fetchWordPairs({
        sourceLanguage: user.mainLanguage,
        targetLanguage: user.learnedLanguage
      }));
    } else {
      console.log('Languages not set');
      setAlertConfig({
        visible: true,
        title: 'Languages Not Set',
        message: 'Please set both your main and learning languages in your profile first.',
        buttons: [
          {
            text: 'Go to Profile',
            icon: 'person',
            onPress: () => navigation.navigate('Profile')
          }
        ]
      });
    }
  }, [dispatch, user?.learnedLanguage, user?.mainLanguage]);

  useEffect(() => {
    console.log('Status:', status);
    console.log('Pairs:', pairs);
    console.log('Error:', error);
    
    if (status === 'succeeded' && pairs.length > 0) {
      startNewRound();
    } else if (status === 'succeeded' && pairs.length === 0) {
      console.log('No word pairs available');
      Alert.alert(
        'No Words Available',
        'No word pairs are available for your languages. Please try generating some first.',
        [
          {
            text: 'Generate Words',
            onPress: async () => {
              try {
                setLoading(true);
                await axios.post(
                  `${API_URL}/word-pairs/seed`,
                  {},
                  {
                    params: {
                      sourceLanguage: user.mainLanguage,
                      targetLanguage: user.learnedLanguage
                    }
                  }
                );
                dispatch(fetchWordPairs({
                  sourceLanguage: user.mainLanguage,
                  targetLanguage: user.learnedLanguage
                }));
              } catch (error) {
                console.error('Error generating words:', error);
                Alert.alert('Error', 'Failed to generate word pairs');
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
    } else if (status === 'failed') {
      Alert.alert('Error', error || 'Failed to fetch word pairs');
    }
  }, [status, pairs, error]);

  const startNewRound = () => {
    if (pairs.length === 0) return;

    // Randomly select a word pair
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const newPair = pairs[randomIndex];

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

  const animateGameWin = () => {
    winAnimation.setValue(0);
    xpGaugeAnimation.setValue(0);
    
    Animated.sequence([
      Animated.timing(winAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(winAnimation, {
        toValue: 0,
        duration: 300,
        delay: 700,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateGameLose = () => {
    loseAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(loseAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(loseAnimation, {
        toValue: 0,
        duration: 300,
        delay: 700,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleGameCompletion = async () => {
    try {
      await axios.patch(
        `${API_URL}/users/${user._id}/game-stats`,
        {
          xpGained: score + 10,
          timeSpent: 5,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      animateGameWin();
      dispatch(updateUserData(user._id));
      
      setTimeout(() => {
        setAlertConfig({
          visible: true,
          title: '🎉 Félicitations!',
          message: `Vous avez terminé le jeu avec ${score + 10} points!`,
          buttons: [
            {
              text: 'Retour aux jeux',
              icon: 'game-controller',
              onPress: () => navigation.goBack()
            }
          ]
        });
      }, 1500);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleGameOver = () => {
    animateGameLose();
    setTimeout(() => {
      setAlertConfig({
        visible: true,
        title: '💔 Game Over',
        message: `Votre score final: ${score} points`,
        buttons: [
          {
            text: 'Retour aux jeux',
            icon: 'game-controller',
            style: 'cancel',
            onPress: () => navigation.goBack()
          },
          {
            text: 'Réessayer',
            icon: 'refresh',
            onPress: () => {
              setLives(3);
              setScore(0);
              setProgress(0);
              startNewRound();
            }
          }
        ]
      });
    }, 1000);
  };

  const handleAnswer = async (isCorrect) => {
    if (isCorrect === currentPair.correct) {
      animateCorrectAnswer();
      setScore(score + 10);
      setProgress(progress + 1);
      
      if (progress + 1 >= 10) {
        await handleGameCompletion();
      } else {
        setTimeout(startNewRound, 500);
      }
    } else {
      animateWrongAnswer();
      setLives(lives - 1);
      if (lives <= 1) {
        handleGameOver();
      } else {
        setTimeout(startNewRound, 500);
      }
    }
  };

  const renderWinOverlay = () => (
    <Animated.View 
      style={[
        styles.overlay,
        { 
          backgroundColor: '#99f21c88',
          opacity: winAnimation,
          zIndex: 10,
        }
      ]} 
      pointerEvents="none"
    >
      <Animated.View style={{
        transform: [
          {
            scale: winAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }
        ]
      }}>
        <Text style={[styles.winText, { textAlign: 'center' }]}>VICTOIRE!</Text>
      </Animated.View>
    </Animated.View>
  );

  const renderLoseOverlay = () => (
    <Animated.View 
      style={[
        styles.overlay,
        { 
          backgroundColor: '#FF444488',
          opacity: loseAnimation,
          zIndex: 10,
        }
      ]} 
      pointerEvents="none"
    >
      <Animated.View style={{
        transform: [
          {
            scale: loseAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }
        ]
      }}>
        <Text style={[styles.loseText, { textAlign: 'center' }]}>GAME OVER</Text>
      </Animated.View>
    </Animated.View>
  );

  if (loading || !currentPair) {
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
      {renderWinOverlay()}
      {renderLoseOverlay()}
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
          <Text style={styles.word}>{currentPair.sourceWord}</Text>
          <Ionicons name="arrow-down" size={32} color="#666666" />
          <Text style={styles.translation}>{currentPair.targetWord}</Text>
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
  winText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  loseText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
