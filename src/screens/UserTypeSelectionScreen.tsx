import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type UserTypeSelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UserTypeSelection'>;
};

const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>I want to...</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HostSignup')}
      >
        <Text style={styles.buttonText}>Host a Dining Experience</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DinerSignup')}
      >
        <Text style={styles.buttonText}>Find a Dining Experience</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserTypeSelectionScreen;