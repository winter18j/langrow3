import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, RefreshControl, Modal, Animated, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUserData } from '../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '../enums/language.enum';
import { League } from '../enums/league.enum';
import axios from 'axios';

const LANGUAGE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  sp: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷'
};

const LEAGUE_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#E5E4E2',
  DIAMOND: '#B9F2FF',
  MASTER: '#FF4D4D'
};

const LEAGUE_ICONS = {
  BRONZE: 'shield-outline',
  SILVER: 'shield-half-outline',
  GOLD: 'shield',
  PLATINUM: 'star-outline',
  DIAMOND: 'star-half-outline',
  MASTER: 'star'
};

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [refreshing, setRefreshing] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguageType, setSelectedLanguageType] = useState(null); // 'main' or 'learned'
  const API_URL = 'http://192.168.0.5:3000';
  const [xpAnimation] = useState(new Animated.Value(0));
  const [prevXp, setPrevXp] = useState(0);

  const fetchProfileData = async () => {
    try {
      if (user?._id) {
        await dispatch(updateUserData(user._id)).unwrap();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfileData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const updateLanguage = async (language, type) => {
    try {
      await axios.patch(
        `${API_URL}/users/${user._id}`,
        {
          [type === 'main' ? 'mainLanguage' : 'learnedLanguage']: language
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      dispatch(updateUserData(user._id));
      setLanguageModalVisible(false);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleDevLevelUp = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/${user._id}/game-stats`,
        {
          xpGained: 100 * user.level, // Enough XP to level up
          timeSpent: 60 // 1 minute of time
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        dispatch(updateUserData(user._id));
      }
    } catch (error) {
      console.error('Error leveling up:', error);
      Alert.alert('Error', 'Failed to level up');
    }
  };

  useEffect(() => {
    if (user?.xpToNextLevel !== prevXp) {
      xpAnimation.setValue(0);
      Animated.timing(xpAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      setPrevXp(user?.xpToNextLevel);
    }
  }, [user?.xpToNextLevel]);

  const renderXPGauge = () => {
    const xpPercentage = (user?.xpToNextLevel / (100 * user?.level)) * 100;
    const animatedWidth = xpAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [`${prevXp / (100 * user?.level) * 100}%`, `${xpPercentage}%`],
    });

    return (
      <View style={styles.xpGaugeContainer}>
        <View style={styles.xpInfo}>
          <Text style={styles.xpText}>XP jusqu'au niveau suivant</Text>
          <Text style={styles.xpNumbers}>{user?.xpToNextLevel} / {100 * user?.level}</Text>
        </View>
        <View style={styles.gaugeBackground}>
          <Animated.View style={[styles.gaugeFill, { width: animatedWidth }]} />
        </View>
      </View>
    );
  };

  const renderLeagueInfo = () => (
    <View style={[styles.leagueCard, { backgroundColor: LEAGUE_COLORS[user?.league] + '22' }]}>
      <View style={styles.leagueIconContainer}>
        <Ionicons 
          name={LEAGUE_ICONS[user?.league]} 
          size={48} 
          color={LEAGUE_COLORS[user?.league]} 
        />
      </View>
      <View style={styles.leagueInfo}>
        <Text style={styles.leagueName}>{user?.league}</Text>
        <Text style={styles.leagueRank}>Rang #{user?.ladderRank}</Text>
      </View>
    </View>
  );

  const renderLanguageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={languageModalVisible}
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedLanguageType === 'main' ? 'Choisir la langue maternelle' : 'Choisir la langue à apprendre'}
            </Text>
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.languageList}>
            {Object.entries(Language).map(([name, code]) => (
              <TouchableOpacity
                key={code}
                style={styles.languageOption}
                onPress={() => updateLanguage(code, selectedLanguageType)}
              >
                <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[code]}</Text>
                <Text style={styles.languageName}>{name}</Text>
                {(selectedLanguageType === 'main' ? user?.mainLanguage : user?.learnedLanguage) === code && (
                  <Ionicons name="checkmark" size={24} color="#99f21c" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderLanguages = () => (
    <View style={styles.languageCard}>
      <Text style={styles.sectionTitle}>Langues</Text>
      <View style={styles.languagesContainer}>
        <TouchableOpacity 
          style={styles.languageItem}
          onPress={() => {
            setSelectedLanguageType('main');
            setLanguageModalVisible(true);
          }}
        >
          <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[user?.mainLanguage]}</Text>
          <Text style={styles.languageLabel}>Langue maternelle</Text>
        </TouchableOpacity>
        <Ionicons name="arrow-forward" size={24} color="#666666" />
        <TouchableOpacity 
          style={styles.languageItem}
          onPress={() => {
            setSelectedLanguageType('learned');
            setLanguageModalVisible(true);
          }}
        >
          <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[user?.learnedLanguage]}</Text>
          <Text style={styles.languageLabel}>Langue apprise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="time-outline" size={24} color="#99f21c" />
        <Text style={styles.statValue}>
          {Math.floor(user?.timeSpentLearning / 60)}h {user?.timeSpentLearning % 60}m
        </Text>
        <Text style={styles.statLabel}>Temps total</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="trending-up-outline" size={24} color="#99f21c" />
        <Text style={styles.statValue}>{user?.level}</Text>
        <Text style={styles.statLabel}>Niveau</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="trophy-outline" size={24} color="#99f21c" />
        <Text style={styles.statValue}>#{user?.ladderRank}</Text>
        <Text style={styles.statLabel}>Classement</Text>
      </View>
    </View>
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user?._id) {
        dispatch(updateUserData(user._id));
      }
    });

    return unsubscribe;
  }, [navigation, user?._id]);

  return (
    <>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#99f21c"
            colors={["#99f21c"]}
            progressBackgroundColor="#222222"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
              <Text style={styles.nickname}>@{user?.nickname}</Text>
            </View>
          </View>
        </View>

        {renderXPGauge()}
        {renderLeagueInfo()}
        {renderStats()}

        {__DEV__ && (
          <TouchableOpacity 
            style={styles.devButton}
            onPress={handleDevLevelUp}
          >
            <Ionicons name="trending-up" size={24} color="#000000" />
            <Text style={styles.devButtonText}>DEV: Level Up</Text>
          </TouchableOpacity>
        )}

        {renderLanguages()}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
      {renderLanguageModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#99f21c',
  },
  avatarText: {
    color: '#99f21c',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  nameContainer: {
    marginLeft: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  nickname: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'monospace',
  },
  xpGaugeContainer: {
    padding: 20,
    backgroundColor: '#111111',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  xpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  xpNumbers: {
    color: '#99f21c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  gaugeBackground: {
    height: 8,
    backgroundColor: '#222222',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#99f21c',
    borderRadius: 4,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  leagueIconContainer: {
    marginRight: 16,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  leagueRank: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  languageCard: {
    padding: 20,
    backgroundColor: '#111111',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageItem: {
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    padding: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
    flex: 1,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99f21c',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  devButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});