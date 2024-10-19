import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch, RootState } from '../store';
import { fetchHostBookings, updateBookingStatus } from '../services/bookingService';
import { Booking } from '../types/bookingTypes';
import { HostTabParamList } from '../types/navigation';

type HostDashboardScreenProps = {
  navigation: BottomTabNavigationProp<HostTabParamList, 'HostDashboard'>;
};

const HostDashboardScreen: React.FC<HostDashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchHostBookings(currentUser.id));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    setPendingBookings(bookings.filter(booking => booking.status === 'pending'));
    setConfirmedBookings(bookings.filter(booking => booking.status === 'confirmed'));
  }, [bookings]);

  const handleApproveBooking = (bookingId: string) => {
    Alert.alert(
      'Approve Booking',
      'Are you sure you want to approve this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            dispatch(updateBookingStatus(bookingId, 'confirmed'));
          },
        },
      ]
    );
  };

  const handleRejectBooking = (bookingId: string) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: () => {
            dispatch(updateBookingStatus(bookingId, 'cancelled'));
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.bookingDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.bookingGuest}>Guest: {item.dinerId}</Text>
      <Text style={styles.bookingGuests}>Guests: {item.guestCount}</Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.approveButton} onPress={() => handleApproveBooking(item.id)}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectBooking(item.id)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return <Text>Loading bookings...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>
      <FlatList
        data={pendingBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No pending booking requests.</Text>}
      />
      <Text style={styles.title}>Confirmed Bookings</Text>
      <FlatList
        data={confirmedBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No confirmed bookings.</Text>}
      />
      <TouchableOpacity
        style={styles.editMenuButton}
        onPress={() => navigation.navigate('EditMenu')}
      >
        <Icon name="restaurant-menu" size={24} color="#FFF" />
        <Text style={styles.editMenuButtonText}>Edit Menu</Text>
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
  bookingGuest: {
    fontSize: 14,
  },
  bookingGuests: {
    fontSize: 14,
  },
  bookingStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  editMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  editMenuButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HostDashboardScreen;
