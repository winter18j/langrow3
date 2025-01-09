import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Language } from '../enums/language.enum';
import { League } from '../enums/league.enum';

const getLanguageLabel = (code) => {
  return Object.keys(Language).find(key => Language[key] === code) || code;
};

const getLeagueLabel = (code) => {
  return Object.keys(League).find(key => League[key] === code) || code;
};

const PROFILE_FIELDS = {
  name: {
    label: 'Nom et prénom',
    getValue: (user) => `${user?.firstName} ${user?.lastName}`,
  },
  nickname: {
    label: 'Pseudo',
    getValue: (user) => user?.nickname,
  },
  email: {
    label: 'Email',
    getValue: (user) => user?.email,
  },
  level: {
    label: 'Niveau',
    getValue: (user) => user?.level,
  },
  league: {
    label: 'League',
    getValue: (user) => getLeagueLabel(user?.league),
  },
  rank: {
    label: 'Rang',
    getValue: (user) => `#${user?.ladderRank}`,
  },
  mainLanguage: {
    label: 'Langue Maternelle',
    getValue: (user) => getLanguageLabel(user?.mainLanguage),
  },
  learnedLanguage: {
    label: 'Langue Apprise',
    getValue: (user) => getLanguageLabel(user?.learnedLanguage),
  },
  timeSpent: {
    label: 'Time Spent',
    getValue: (user) => {
      const minutes = user?.timeSpentLearning || 0;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    },
  },
  xpToNext: {
    label: 'XP to Next',
    getValue: (user) => user?.xpToNextLevel,
  },
};

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.table}>
        {Object.entries(PROFILE_FIELDS).map(([key, { label, getValue }]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>{getValue(user)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  table: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#888',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});