/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { AppDispatch, RootState } from '../store';
import { fetchHostProfile, updateHostProfile } from '../services/hostService';
import { signOut } from '../services/authService';
import { HostProfile } from '../types/hostTypes';
import { Button } from '../components/ui/Button';

type HostProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HostProfile'>;

const HostProfileScreen: React.FC = () => {
  const navigation = useNavigation<HostProfileScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editedProfile, setEditedProfile] = useState<Partial<HostProfile>>({});

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      dispatch(fetchHostProfile(user.id))
        .then((fetchedProfile) => {
          setProfile(fetchedProfile);
          setEditedProfile(fetchedProfile);
        })
        .catch((error) => console.error('Error fetching profile:', error))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (user && profile) {
      setIsLoading(true);
      try {
        await dispatch(updateHostProfile(profile.id, editedProfile));
        setProfile({ ...profile, ...editedProfile });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: () => {
            dispatch(signOut())
              .then(() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }))
              .catch((error) => console.error('Error signing out:', error));
          }
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!profile) {
    return <Text>No profile found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{profile.name}'s Profile</Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editedProfile.cuisine}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, cuisine: text })}
            placeholder="Cuisine"
          />
          <TextInput
            style={styles.input}
            value={editedProfile.location}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, location: text })}
            placeholder="Location"
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={editedProfile.description}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, description: text })}
            placeholder="Description"
            multiline
          />
          <TextInput
            style={styles.input}
            value={editedProfile.price?.toString()}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, price: parseFloat(text) || 0 })}
            placeholder="Price per Guest"
            keyboardType="numeric"
          />
          <Button onPress={handleSave} style={styles.button}>
            Save Changes
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{profile.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.info}>{profile.phoneNumber}</Text>

          <Text style={styles.label}>Cuisine:</Text>
          <Text style={styles.info}>{profile.cuisine}</Text>

          <Text style={styles.label}>Location:</Text>
          <Text style={styles.info}>{profile.location}</Text>

          <Text style={styles.label}>Price per Guest:</Text>
          <Text style={styles.info}>${profile.price}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.info}>{profile.description}</Text>

          <Button onPress={handleEdit} style={styles.button}>
            Edit Profile
          </Button>
        </>
      )}

      <Button onPress={() => navigation.navigate('EditMenu')} style={styles.button}>
        Edit Menu
      </Button>

      <Button onPress={handleSignOut} style={[styles.button, styles.signOutButton]}>
        Sign Out
      </Button>
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
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
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
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
});

export default HostProfileScreen;