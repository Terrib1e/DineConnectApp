import React from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RootState, AppDispatch} from '../store';
import {Button} from '../components/ui/Button';
import {signOut} from '../services/authService';

const DinerProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await dispatch(signOut());
            navigation.reset({
              index: 0,
              routes: [{name: 'Welcome' as never}],
            });
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Diner Profile</Text>
      <View style={styles.infoContainer}>
        <Icon name="person" size={20} color="#007AFF" />
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.info}>{user.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="email" size={20} color="#007AFF" />
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>
      {/* Add more user information as needed */}
      <Button style={styles.button}>
        <Icon name="edit" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Button>
      <Button style={styles.button}>
        <Icon name="lock" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Change Password</Text>
      </Button>
      <Button
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}>
        <Icon name="exit-to-app" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Sign Out</Text>
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
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
    marginLeft: 10,
  },
  info: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DinerProfileScreen;
