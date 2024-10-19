import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppDispatch, RootState } from '../store';
import { fetchHostProfile } from '../services/hostService';
import { createBooking } from '../services/bookingService';
import { RootStackParamList } from '../types/navigation';
import { Button } from '../components/ui/Button';
import { HostProfile } from '../types/hostTypes';

type BookingFormScreenRouteProp = RouteProp<RootStackParamList, 'BookingForm'> & {
  params: {
    hostId: string;
  };
};
type BookingFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingForm'>;

type Props = {
  route: BookingFormScreenRouteProp;
  navigation: BookingFormScreenNavigationProp;
};

const BookingFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { hostId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [host, setHost] = useState<HostProfile | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guestCount, setGuestCount] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHostProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await dispatch(fetchHostProfile(hostId));
        setHost(profile);
      } catch (error) {
        console.error('Error fetching host profile:', error);
        Alert.alert('Error', 'Unable to load host profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadHostProfile();
  }, [dispatch, hostId]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to make a booking.');
      return;
    }

    if (!host) {
      Alert.alert('Error', 'Host information is not available. Please try again.');
      return;
    }

    const guestCountNum = parseInt(guestCount, 10);
    if (isNaN(guestCountNum) || guestCountNum < 1) {
      Alert.alert('Error', 'Please enter a valid number of guests.');
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        hostId,
        dinerId: currentUser.id,
        date: date.toISOString(),
        guestCount: guestCountNum,
        totalPrice: guestCountNum * (host.price || 0),
        menuItems: [],
        specialRequests,
        status: 'pending' as const,
      };
      await dispatch(createBooking(bookingData));
      Alert.alert('Success', 'Your booking request has been sent to the host.');
      navigation.navigate('DinerTabs' as never);
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Unable to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!host) {
    return <Text style={styles.errorText}>Unable to load host information. Please try again.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book with {host.name}</Text>
      <Text style={styles.subtitle}>Cuisine: {host.cuisine}</Text>

      <Text style={styles.label}>Date</Text>
      <Button onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        {date.toLocaleDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Number of Guests</Text>
      <TextInput
        style={styles.input}
        value={guestCount}
        onChangeText={setGuestCount}
        keyboardType="numeric"
        placeholder="Enter number of guests"
      />

      <Text style={styles.label}>Special Requests</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={specialRequests}
        onChangeText={setSpecialRequests}
        multiline
        placeholder="Enter any special requests or dietary requirements"
      />

      <Text style={styles.priceText}>Price per guest: ${host.price}</Text>
      <Text style={styles.totalText}>
        Total: ${parseInt(guestCount, 10) * (host.price || 0)}
      </Text>

      <Button onPress={handleBooking} style={styles.button} disabled={isLoading}>
        {isLoading ? 'Sending Request...' : 'Request Booking'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priceText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BookingFormScreen;