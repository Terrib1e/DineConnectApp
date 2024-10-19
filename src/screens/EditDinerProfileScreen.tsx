import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState, AppDispatch} from '../store';
import {Button} from '../components/ui/Button';
import {updateUserProfile} from '../services/userService';
import {Diner, UpdateUserProfileData} from '../types/userTypes';

const EditDinerProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user as Diner);

  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  const handleUpdateProfile = async () => {
    if (!user) return;

    const updateData: UpdateUserProfileData = {
      name,
      phoneNumber,
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
      <Text style={styles.title}>Edit Diner Profile</Text>
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
  button: {
    marginTop: 20,
  },
});

export default EditDinerProfileScreen;
