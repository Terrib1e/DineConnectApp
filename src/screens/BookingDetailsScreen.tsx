import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/ui/Button';
import { cancelBooking, fetchBookingDetails } from '../services/bookingService';
import { AppDispatch, RootState } from '../store';
import { Booking } from '../types/bookingTypes';
import { RootStackParamList } from '../types/navigation';

type BookingDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;
type BookingDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingDetails'>;

type Props = {
  route: BookingDetailsScreenRouteProp;
  navigation: BookingDetailsScreenNavigationProp;
};

const BookingDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const details = await dispatch(fetchBookingDetails(bookingId));
        setBooking(details);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert('Error', 'Unable to load booking details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingDetails();
  }, [dispatch, bookingId]);

  const handleCancelBooking = async () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await dispatch(cancelBooking(bookingId));
              Alert.alert('Success', 'Your booking has been cancelled.');
              navigation.goBack();
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Unable to cancel booking. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!booking) {
    return <Text>No booking details found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.detail}>Date: {new Date(booking.date).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Host: {booking.hostId}</Text>
      <Text style={styles.detail}>Guests: {booking.guestCount}</Text>
      <Text style={styles.detail}>Status: {booking.status}</Text>
      <Text style={styles.detail}>Total Price: ${booking.totalPrice}</Text>

      {booking.specialRequests && (
        <View>
          <Text style={styles.subtitle}>Special Requests:</Text>
          <Text style={styles.detail}>{booking.specialRequests}</Text>
        </View>
      )}

      {booking.menuItems && booking.menuItems.length > 0 && (
        <View>
          <Text style={styles.subtitle}>Menu Items:</Text>
          {booking.menuItems.map((item, index) => (
            <Text key={index} style={styles.detail}>
              {item.name} - Quantity: {item.quantity}, Price: ${item.price}
            </Text>
          ))}
        </View>
      )}

      {booking.status === 'pending' && (
        <Button onPress={handleCancelBooking} style={styles.cancelButton}>
          Cancel Booking
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginTop: 20,
  },
});

export default BookingDetailsScreen;