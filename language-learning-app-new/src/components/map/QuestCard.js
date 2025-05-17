import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuestCard({ quest, onClose, onComplete }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.questType}>
          <Ionicons name="flag" size={20} color="#99f21c" />
          <Text style={styles.questTypeText}>{quest.type} Quest</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.location}>{quest.location}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="trophy" size={16} color="#666666" />
            <Text style={styles.detailText}>{quest.xp} XP</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#666666" />
            <Text style={styles.detailText}>{quest.duration} minutes</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="language" size={16} color="#666666" />
            <Text style={styles.detailText}>{quest.language}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#666666" />
            <Text style={styles.detailText}>Level {quest.level}</Text>
          </View>
        </View>

        <Text style={styles.description}>{quest.description}</Text>

        <View style={styles.objectives}>
          <Text style={styles.objectivesTitle}>Objectives:</Text>
          {quest.objectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <Ionicons name="checkmark-circle" size={16} color="#99f21c" />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.button}
          onPress={onComplete}
        >
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>
            Complete Quest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 'auto',
    elevation: 5,
    shadowColor: '#99f21c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questTypeText: {
    color: '#99f21c',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  location: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  objectives: {
    gap: 8,
  },
  objectivesTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  objectiveText: {
    color: '#CCCCCC',
    fontSize: 14,
    flex: 1,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
}); 