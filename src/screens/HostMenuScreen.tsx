import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types/navigation';
import { AppDispatch, RootState } from '../store';
import { fetchHostProfile } from '../services/hostService';
import { createBooking } from '../services/bookingService';
import { HostProfile, MenuItem } from '../types/hostTypes';
import { Button } from '../components/ui/Button';

type HostMenuScreenRouteProp = RouteProp<RootStackParamList, 'HostMenu'>;
type HostMenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HostMenu'>;

type Props = {
  route: HostMenuScreenRouteProp;
  navigation: HostMenuScreenNavigationProp;
};

const HostMenuScreen: React.FC<Props> = ({ route, navigation }) => {
  const { hostId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [host, setHost] = useState<HostProfile | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    dispatch(fetchHostProfile(hostId))
      .then((profile) => setHost(profile))
      .catch((error) => {
        console.error('Error fetching host profile:', error);
        Alert.alert('Error', 'Unable to load host menu. Please try again.');
      });
  }, [dispatch, hostId]);

  const handleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleItemDeselection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newCount = (prev[itemId] || 0) - 1;
      if (newCount <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newCount };
    });
  };

  const calculateTotal = () => {
    return host?.menu.reduce((total, item) => {
      return total + (item.price * (selectedItems[item.id] || 0));
    }, 0) || 0;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleReservation = async () => {
    if (!currentUser || !host) return;

    const selectedMenuItems = host.menu.filter(item => selectedItems[item.id]);
    if (selectedMenuItems.length === 0) {
      Alert.alert('Error', 'Please select at least one menu item.');
      return;
    }

    const bookingData = {
      hostId: host.id,
      dinerId: currentUser.id,
      date: date.toISOString(),
      menuItems: selectedMenuItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: selectedItems[item.id],
        price: item.price,
      })),
      totalPrice: calculateTotal(),
      status: 'pending' as const,
      guestCount,
    };

    Alert.alert(
      'Confirm Reservation',
      `Date: ${date.toDateString()}\nGuests: ${guestCount}\nTotal: $${calculateTotal().toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await dispatch(createBooking(bookingData));
              Alert.alert('Success', 'Your reservation has been sent to the host.');
              navigation.navigate('DinerDashboard' as never);
            } catch (error) {
              console.error('Error creating reservation:', error);
              Alert.alert('Error', 'Unable to create reservation. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => handleItemDeselection(item.id)} style={styles.quantityButton}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{selectedItems[item.id] || 0}</Text>
        <TouchableOpacity onPress={() => handleItemSelection(item.id)} style={styles.quantityButton}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!host) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{host.name}'s Menu</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.guestCountContainer}>
        <Text>Number of Guests:</Text>
        <TouchableOpacity onPress={() => setGuestCount(Math.max(1, guestCount - 1))}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text>{guestCount}</Text>
        <TouchableOpacity onPress={() => setGuestCount(guestCount + 1)}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={host.menu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
      </View>

      <Button onPress={handleReservation} style={styles.reserveButton}>
        Make Reservation
      </Button>
    </View>
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
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  guestCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  quantityText: {
    marginHorizontal: 10,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reserveButton: {
    marginTop: 20,
  },
});

export default HostMenuScreen;