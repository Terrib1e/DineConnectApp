import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch, RootState } from '../store';
import { fetchUserBookings } from '../services/bookingService';
import { Booking } from '../types/bookingTypes';
import { DinerTabParamList } from '../types/navigation';
import HostMapView from '../components/HostMapView';

type DinerDashboardScreenProps = {
  navigation: BottomTabNavigationProp<DinerTabParamList, 'DinerDashboard'>;
};

const DinerDashboardScreen: React.FC<DinerDashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);

  const loadBookings = useCallback(() => {
    if (currentUser) {
      dispatch(fetchUserBookings(currentUser.id));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
    style={styles.bookingItem}
    onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
  >
      <Text style={styles.bookingDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.bookingHost}>Host: {item.hostId}</Text>
      <Text style={styles.bookingGuests}>Guests: {item.guestCount}</Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBookings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
          <HostMapView
      hosts={[]} // Replace with actual profiles data
      onHostSelect={(hostId) => navigation.navigate('HostMenu', { hostId })}
    />
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.noBookings}>You have no bookings yet.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadBookings} />
        }
      />
      <TouchableOpacity
        style={styles.findHostButton}
        onPress={() => navigation.navigate('SearchHosts')}
      >
        <MaterialIcons name="search" size={24} color="#FFF" />
        <Text style={styles.findHostButtonText}>Find a Host</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  bookingItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bookingDate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  bookingHost: {
    fontSize: 14,
  },
  bookingGuests: {
    fontSize: 14,
  },
  bookingStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  noBookings: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  findHostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  findHostButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default DinerDashboardScreen;