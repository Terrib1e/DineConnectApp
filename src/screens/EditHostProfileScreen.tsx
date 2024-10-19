import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../store';
import { Button } from '../components/ui/Button';
import { updateUserProfile } from '../services/userService';
import { Host, UpdateHostProfileData } from '../types/userTypes';

const EditHostProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user as Host);

  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [cuisine, setCuisine] = useState(user?.cuisine || '');
  const [description, setDescription] = useState(user?.description || '');
  const [price, setPrice] = useState(user?.price?.toString() || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleUpdateProfile = async () => {
    if (!user) return;

    const updateData: UpdateHostProfileData = {
      name,
      phoneNumber,
      cuisine,
      description,
      price: parseFloat(price),
      location,
    };

    try {
      await dispatch(updateUserProfile(user.id, updateData));
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Host Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine Type"
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price per Guest"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button onPress={handleUpdateProfile} style={styles.button}>
        Update Profile
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  button: {
    marginTop: 20,
  },
});

export default EditHostProfileScreen;