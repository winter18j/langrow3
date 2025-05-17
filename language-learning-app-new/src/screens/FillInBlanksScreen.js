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
import { fetchSentences } from '../redux/slices/fillInBlanksSlice';
import { updateUserData } from '../redux/slices/authSlice';
import axios from 'axios';
import CustomAlert from '../components/CustomAlert';
import { BASE_URL } from '../utils/ipaddress';

const { width, height } = Dimensions.get('window');

const API_URL = BASE_URL;

export default function FillInBlanksScreen({ navigation }) {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Animations for feedback
  const [overlayFade] = useState(new Animated.Value(0));
  const [scorePop] = useState(new Animated.Value(0));
  const [scoreOpacity] = useState(new Animated.Value(0));
  const [heartShake] = useState(new Animated.Value(0));
  const [winAnimation] = useState(new Animated.Value(0));
  const [loseAnimation] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const { sentences, status, error } = useSelector(state => state.fillInBlanks);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  useEffect(() => {
    if (user?.learnedLanguage) {
      dispatch(fetchSentences({ language: user.learnedLanguage }));
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
  }, [dispatch, user?.learnedLanguage]);

  useEffect(() => {
    if (status === 'succeeded' && sentences.length > 0) {
      startNewRound();
    } else if (status === 'succeeded' && sentences.length === 0) {
      Alert.alert(
        'No Sentences Available',
        'No sentences are available for your language. Please try generating some first.',
        [
          {
            text: 'Generate Sentences',
            onPress: async () => {
              try {
                setLoading(true);
                await axios.post(
                  `${API_URL}/fill-in-blanks/seed`,
                  {},
                  {
                    params: {
                      language: user.learnedLanguage
                    }
                  }
                );
                dispatch(fetchSentences({ language: user.learnedLanguage }));
              } catch (error) {
                console.error('Error generating sentences:', error);
                Alert.alert('Error', 'Failed to generate sentences');
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
      Alert.alert('Error', error || 'Failed to fetch sentences');
    }
  }, [status, sentences, error]);

  const startNewRound = () => {
    if (sentences.length === 0) return;

    // Randomly select a sentence
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const newSentence = sentences[randomIndex];

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
      setCurrentSentence(newSentence);
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

  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentSentence.missingWord) {
      animateCorrectAnswer();
      setScore(score + 10);
      setProgress(progress + 1);
      
      if (progress + 1 >= 10) {
        handleGameCompletion();
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

  if (loading || !currentSentence) {
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

      {/* Win/Lose Overlays */}
      <Animated.View 
        style={[styles.overlay, { backgroundColor: '#99f21c88', opacity: winAnimation }]} 
        pointerEvents="none"
      >
        <Animated.View style={{
          transform: [{
            scale: winAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }]
        }}>
          <Text style={styles.winText}>VICTOIRE!</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View 
        style={[styles.overlay, { backgroundColor: '#FF444488', opacity: loseAnimation }]} 
        pointerEvents="none"
      >
        <Animated.View style={{
          transform: [{
            scale: loseAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }]
        }}>
          <Text style={styles.loseText}>GAME OVER</Text>
        </Animated.View>
      </Animated.View>

      {/* Feedback overlays */}
      <Animated.View 
        style={[styles.overlay, { backgroundColor: '#99f21c', opacity: overlayFade }]} 
        pointerEvents="none"
      />
      <Animated.View 
        style={[styles.overlay, { backgroundColor: '#FF4444', opacity: overlayFade }]} 
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
            style={[styles.stat, { transform: [{ translateX: heartShake }] }]}
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
        <Text style={styles.instruction}>Complétez la phrase</Text>
        
        <Animated.View
          style={[
            styles.sentenceContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sentence}>
            {currentSentence.sentence.replace('___', '________')}
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {currentSentence.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
  sentenceContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#111111',
    borderRadius: 12,
    width: '100%',
  },
  sentence: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: 'monospace',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#222222',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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