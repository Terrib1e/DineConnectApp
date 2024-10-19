import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '../components/ui/Button'; // Update this line
import {RootStackParamList} from '../types/navigation';
import {setUser} from '../store/authSlice';
import {useDispatch} from 'react-redux';
import {auth} from '../services/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

type DinerSignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'DinerSignup'>;
};

const DinerSignupScreen: React.FC<DinerSignupScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({name: '', email: '', password: ''});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {name: '', email: '', password: ''};

    if (name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const dispatch = useDispatch();
 const handleSignup = async () => {
    if (validateForm()) {
      try {
        if (!auth().app) {
          throw new Error('Firebase app is not initialized');
        }

        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;

        // Update the user profile with the name
        await user.updateProfile({displayName: name});

        // Update the Redux store with the new user
        dispatch(
          setUser({
            id: user.uid,
            name: name,
            email: user.email || '',
            userType: 'diner' as const,
          }),
        );

        // The navigation will be handled by the RootNavigator based on the updated auth state
      } catch (error) {
        console.error('Signup failed:', error);
        let errorMessage = 'Signup failed. Please try again.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'code' in error) {
          const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
          switch (firebaseError.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'This email is already in use.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is invalid.';
              break;
            case 'auth/operation-not-allowed':
              errorMessage = 'Email/password accounts are not enabled.';
              break;
            case 'auth/weak-password':
              errorMessage = 'The password is too weak.';
              break;
            default:
              errorMessage = firebaseError.message;
          }
        }
        Alert.alert('Error', errorMessage);
      }
    } else {
      Alert.alert('Error', 'Please correct the errors in the form');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diner Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Name input"
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email input"
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password input"
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}
      <Button
        onPress={handleSignup}
        style={styles.button}
        accessibilityLabel="Sign up button">
        Sign Up as Diner
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default DinerSignupScreen;
