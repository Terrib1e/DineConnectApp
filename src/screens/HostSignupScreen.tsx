import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '../components/ui/Button';
import {signUp} from '../services/authService';
import {AppDispatch} from '../store';
import {RootStackParamList} from '../types/navigation';

type HostSignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'HostSignup'>;
};

const HostSignupScreen: React.FC<HostSignupScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignup = async () => {
    try {
      await dispatch(signUp(email, password, name, phoneNumber, 'host'));
      navigation.replace('HostProfileCreation');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Error',
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Host Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button onPress={handleSignup} style={styles.button}>
        Sign Up as Host
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default HostSignupScreen;
