import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppDispatch, RootState} from '../store';
import {fetchHostProfiles} from '../services/hostService';
import {HostProfile} from '../types/hostTypes';
import {RootStackParamList} from '../types/navigation';
import HostMapView from '../components/HostMapView';


type SearchHostsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SearchHosts'>;
};

const SearchHostsScreen: React.FC<SearchHostsScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {profiles, isLoading, error} = useSelector(
    (state: RootState) => state.hostProfiles,
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchHostProfiles());
  }, [dispatch]);

  const filteredHosts = profiles.filter(
    host =>
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleHostSelection = (hostId: string) => {
    navigation.navigate('HostMenu', {hostId});
  };

  const renderHostItem = ({item}: {item: HostProfile}) => (
    <TouchableOpacity
      style={styles.hostItem}
      onPress={() => handleHostSelection(item.id)}>
      <View style={styles.hostItemHeader}>
        <Text style={styles.hostName}>{item.name}</Text>
        <Text style={styles.hostCuisine}>{item.cuisine}</Text>
      </View>
      <View style={styles.hostItemRating}>
        <Icon name="star" size={16} color="#FFD700" />
        <Text style={styles.hostRating}>
          {item.rating?.toFixed(1) || 'N/A'}
        </Text>
      </View>
      <Text style={styles.hostDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <Text>Loading hosts...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <HostMapView
      hosts={profiles} // or filteredHosts in SearchHostsScreen
      onHostSelect={(hostId) => navigation.navigate('HostMenu', { hostId })}
    />
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search hosts or cuisines"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredHosts}
        renderItem={renderHostItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.noResults}>No hosts found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  hostItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  hostItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hostCuisine: {
    fontSize: 14,
    color: '#666',
  },
  hostItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hostRating: {
    marginLeft: 5,
    fontSize: 14,
  },
  hostDescription: {
    fontSize: 14,
    color: '#333',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchHostsScreen;
