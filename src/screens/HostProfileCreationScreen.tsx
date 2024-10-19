import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '../components/ui/Button';
import {RootStackParamList} from '../types/navigation';
import {RootState, AppDispatch} from '../store';
import {createHostProfile} from '../services/hostService';
type HostProfileCreationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
};

const HostProfileCreationScreen: React.FC<HostProfileCreationScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleProfileCreation = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    try {
      await dispatch(
        createHostProfile({
          userId: user.id,
          cuisine,
          location,
          description,
          price: parseFloat(price),
          phoneNumber: ''
        }),
      );
      navigation.replace('HostTabs');
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert(
        'Profile Creation Error',
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Host Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Cuisine Type"
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description of your dining experience"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Price per guest"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button onPress={handleProfileCreation} style={styles.button}>
        Create Profile
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
  },
});

export default HostProfileCreationScreen;
