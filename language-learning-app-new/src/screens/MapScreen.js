import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setVisibleOnMap } from '../redux/slices/mapSlice';
import PartnerMarker from '../components/map/PartnerMarker';
import EventMarker from '../components/map/EventMarker';
import QuestMarker from '../components/map/QuestMarker';
import PartnerCard from '../components/map/PartnerCard';
import EventCard from '../components/map/EventCard';
import QuestCard from '../components/map/QuestCard';

const { width, height } = Dimensions.get('window');

// Dark map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

// Generate random coordinate offset (±0.01 degrees = roughly 1km)
const getRandomOffset = () => (Math.random() - 0.5) * 0.02;

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [completedQuests, setCompletedQuests] = useState(new Set());
  const [eventAttendance, setEventAttendance] = useState({});
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const user = useSelector(state => state.auth.user);
  const isVisibleOnMap = useSelector(state => state.map.isVisibleOnMap);
  const dispatch = useDispatch();

  // Fake data states
  const [partners, setPartners] = useState([]);
  const [events, setEvents] = useState([]);
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Generate fake data once we have the location
      if (location) {
        generateFakeData(location.coords);
      }
    })();
  }, []);

  const generateFakeData = (coords) => {
    // Generate 2 fake partners
    const fakePartners = [
      {
        id: 'p1',
        firstName: 'Alex',
        lastName: 'Smith',
        isOnline: true,
        nativeLanguage: 'en',
        learningLanguage: 'fr',
        distance: '0.8',
        bio: 'Learning French for my upcoming trip to Paris! Looking for practice partners.',
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
      {
        id: 'p2',
        firstName: 'Maria',
        lastName: 'Garcia',
        isOnline: false,
        nativeLanguage: 'sp',
        learningLanguage: 'fr',
        distance: '1.2',
        bio: 'Passionate about French culture and cinema. Would love to practice conversation!',
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
    ];

    // Generate 2 fake events
    const fakeEvents = [
      {
        id: 'e1',
        type: 'Language Exchange',
        title: 'French Movie Night',
        location: 'Cultural Center',
        date: '2024-03-25',
        time: '18:00',
        attendees: 12,
        languages: ['French', 'English'],
        description: 'Join us for a screening of a classic French film with discussion in both French and English.',
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
      {
        id: 'e2',
        type: 'Workshop',
        title: 'French Cooking Class',
        location: 'Community Kitchen',
        date: '2024-03-27',
        time: '19:30',
        attendees: 8,
        languages: ['French', 'English'],
        description: 'Learn to cook authentic French cuisine while practicing your language skills.',
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
    ];

    // Generate 2 fake quests
    const fakeQuests = [
      {
        id: 'q1',
        type: 'cafe',
        title: 'Café Challenge',
        location: 'Local Café',
        xp: 100,
        duration: 15,
        language: 'French',
        level: 2,
        description: 'Order a coffee and pastry in French!',
        objectives: [
          'Greet the barista in French',
          'Order a coffee using proper terms',
          'Ask about pastry recommendations',
          'Thank them and say goodbye',
        ],
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
      {
        id: 'q2',
        type: 'park',
        title: 'Park Explorer',
        location: 'City Park',
        xp: 150,
        duration: 20,
        language: 'French',
        level: 1,
        description: 'Learn nature vocabulary while exploring the park!',
        objectives: [
          'Identify 5 trees in French',
          'Describe the weather',
          'Count the number of benches',
          'Name 3 activities people are doing',
        ],
        coordinate: {
          latitude: coords.latitude + getRandomOffset(),
          longitude: coords.longitude + getRandomOffset(),
        },
      },
    ];

    setPartners(fakePartners);
    setEvents(fakeEvents);
    setQuests(fakeQuests);
  };

  const handleMarkerPress = (type, item) => {
    setSelectedItem({ type, item });
  };

  const handleQuestComplete = (questId) => {
    setCompletedQuests(prev => {
      const newSet = new Set(prev);
      newSet.add(questId);
      return newSet;
    });
    setSelectedItem(null);
  };

  const handleEventAttendance = (eventId, attending) => {
    setEventAttendance(prev => ({
      ...prev,
      [eventId]: attending
    }));
  };

  const handleAddNewEvent = () => {
    if (!location) return;
    
    const newEvent = {
      id: `e${events.length + 1}`,
      type: 'Language Exchange',
      title: 'New Language Meetup',
      location: 'My Location',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      attendees: 1,
      languages: ['French', 'English'],
      description: 'Join me for a language exchange session!',
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };

    setEvents(prev => [...prev, newEvent]);
    setShowNewEventModal(false);
  };

  const renderSelectedCard = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'partner':
        return (
          <PartnerCard
            partner={selectedItem.item}
            onClose={() => setSelectedItem(null)}
          />
        );
      case 'event':
        return (
          <EventCard
            event={selectedItem.item}
            onClose={() => setSelectedItem(null)}
            isAttending={eventAttendance[selectedItem.item.id]}
            onToggleAttendance={(attending) => handleEventAttendance(selectedItem.item.id, attending)}
          />
        );
      case 'quest':
        return (
          <QuestCard
            quest={selectedItem.item}
            onClose={() => setSelectedItem(null)}
            onComplete={() => handleQuestComplete(selectedItem.item.id)}
          />
        );
      default:
        return null;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.title}>🎯 Explore</Text>
        <TouchableOpacity 
          onPress={() => setShowNewEventModal(true)}
          style={[styles.filterButton, { backgroundColor: '#99f21c' }]}
        >
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.visibilityContainer}>
        <Text style={styles.visibilityText}>Show me on map</Text>
        <Switch
          value={isVisibleOnMap}
          onValueChange={(value) => dispatch(setVisibleOnMap(value))}
          trackColor={{ false: '#222222', true: '#99f21c' }}
          thumbColor={isVisibleOnMap ? '#FFFFFF' : '#666666'}
        />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'partners' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('partners')}
        >
          <Ionicons name="people" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'quests' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('quests')}
        >
          <Ionicons name="trophy" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'events' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('events')}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {isVisibleOnMap && location && (
          <PartnerMarker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            isOnline={true}
            onPress={() => handleMarkerPress('partner', {
              id: user.id,
              firstName: user.firstName || 'You',
              lastName: user.lastName || '',
              isOnline: true,
              nativeLanguage: user.nativeLanguage || 'en',
              learningLanguage: user.learningLanguage || 'fr',
              distance: '0',
              bio: 'This is you!',
              coordinate: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            })}
          />
        )}

        {(selectedFilter === 'all' || selectedFilter === 'partners') &&
          partners.map(partner => (
            <PartnerMarker
              key={partner.id}
              coordinate={partner.coordinate}
              isOnline={partner.isOnline}
              onPress={() => handleMarkerPress('partner', partner)}
            />
          ))}

        {(selectedFilter === 'all' || selectedFilter === 'events') &&
          events.map(event => (
            <EventMarker
              key={event.id}
              coordinate={event.coordinate}
              attendees={event.attendees}
              onPress={() => handleMarkerPress('event', event)}
            />
          ))}

        {(selectedFilter === 'all' || selectedFilter === 'quests') &&
          quests.filter(quest => !completedQuests.has(quest.id)).map(quest => (
            <QuestMarker
              key={quest.id}
              coordinate={quest.coordinate}
              type={quest.type}
              onPress={() => handleMarkerPress('quest', quest)}
            />
          ))}
      </MapView>
      {renderSelectedCard()}
      {showNewEventModal && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowNewEventModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: '#99f21c', marginTop: 20 }]}
              onPress={handleAddNewEvent}
            >
              <Text style={[styles.filterText, { color: '#000000' }]}>Create at My Location</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  visibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 20,
  },
  visibilityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#99f21c',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'monospace',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222222',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
