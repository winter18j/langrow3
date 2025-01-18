import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Language } from '../enums/language.enum';

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

const LANGUAGE_NAMES = {
  fr: 'Français',
  en: 'English',
  sp: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
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

export default function LeaderboardScreen() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const API_URL = 'http://192.168.0.5:3000';

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedPlayers = response.data.sort((a, b) => b.level - a.level);
      setPlayers(sortedPlayers);
      setLoading(false);
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchLeaderboard();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderLanguages = (mainLang, learnedLang) => {
    return (
      <View style={styles.languagesContainer}>
        <View style={styles.languageItem}>
          <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[mainLang]}</Text>
          <Text style={styles.languageName}>{LANGUAGE_NAMES[mainLang]}</Text>
        </View>
        <Text style={styles.languageArrow}>→</Text>
        <View style={styles.languageItem}>
          <Text style={styles.languageFlag}>{LANGUAGE_FLAGS[learnedLang]}</Text>
          <Text style={styles.languageName}>{LANGUAGE_NAMES[learnedLang]}</Text>
        </View>
      </View>
    );
  };

  const renderPlayer = ({ item, index }) => (
    <View style={styles.playerCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>#{index + 1}</Text>
      </View>
      
      <View style={styles.playerInfo}>
        <View style={styles.nameAndLevel}>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Niveau {item.level}</Text>
          </View>
        </View>
        
        {renderLanguages(item.mainLanguage, item.learnedLanguage)}
      </View>

      <View style={[styles.leagueContainer, { backgroundColor: LEAGUE_COLORS[item.league] }]}>
        <Ionicons 
          name={LEAGUE_ICONS[item.league]} 
          size={24} 
          color="#000000" 
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#99f21c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classement</Text>
      <Text style={styles.subtitle}>Les meilleurs joueurs</Text>
      
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#99f21c"
            colors={["#99f21c"]}
            progressBackgroundColor="#222222"
          />
        }
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
  listContainer: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#99f21c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    color: '#99f21c',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameAndLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  levelContainer: {
    backgroundColor: '#222222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#99f21c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageName: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'monospace',
  },
  languageArrow: {
    color: '#666666',
    fontSize: 14,
    marginHorizontal: 4,
  },
  leagueContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
}); 