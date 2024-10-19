import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {setUser, setLoading, setError, logout} from '../store/authSlice';
import {AppDispatch} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserType = 'host' | 'diner';

interface UserData {
  name: string;
  email: string;
  userType: UserType;
}

const handleError = (error: unknown, dispatch: AppDispatch) => {
  console.error('Error:', error);
  if (error instanceof Error) {
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    dispatch(setError(error.message));
  } else {
    dispatch(setError('An unknown error occurred'));
  }
};

export const signUp =
  (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    userType: 'host' | 'diner',
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      if (user) {
        await firestore().collection('users').doc(user.uid).set({
          name,
          email,
          phoneNumber,
          userType,
        });

        const userToStore = {
          id: user.uid,
          email: user.email!,
          name,
          userType,
        };

        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
        dispatch(setUser(userToStore));
      } else {
        throw new Error('User creation failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      dispatch(
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signIn =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      console.log('1. Attempting to sign in user:', email);

      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      console.log('2. User authenticated successfully');

      const user = userCredential.user;
      console.log('3. User object:', user ? 'exists' : 'is null');

      if (user) {
        console.log('4. User UID:', user.uid);

        const userDocRef = firestore().collection('users').doc(user.uid);
        console.log('5. User document reference path:', userDocRef.path);

        try {
          console.log('6. Attempting to fetch user document');
          let userDoc = await userDocRef.get();

          if (!userDoc.exists) {
            console.log(
              '7. User document does not exist. Creating new document.',
            );
            await userDocRef.set({
              name: user.displayName || 'New User',
              email: user.email,
              userType: 'diner', // Default user type, adjust as needed
              createdAt: firestore.FieldValue.serverTimestamp(),
            });
            userDoc = await userDocRef.get(); // Fetch the newly created document
          }

          console.log('8. User document fetched successfully');
          const userData = userDoc.data();
          console.log(
            '9. User data:',
            userData ? JSON.stringify(userData, null, 2) : 'is null',
          );

          if (!userData) {
            console.error('10. User document is empty');
            throw new Error('User data is empty');
          }

          const userToStore = {
            id: user.uid,
            email: user.email!,
            name: userData.name,
            userType: userData.userType,
          };

          console.log(
            '11. User data to store:',
            JSON.stringify(userToStore, null, 2),
          );
          await AsyncStorage.setItem('user', JSON.stringify(userToStore));
          dispatch(setUser(userToStore));
        } catch (error) {
          console.error('Error fetching or creating user data:', error);
          throw error;
        }
      } else {
        console.error('12. User object is null after authentication');
        throw new Error('Sign in failed: User object is null');
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signOut = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    if (!auth()) {
      throw new Error('Firebase Auth is not initialized');
    }

    await auth().signOut();
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const checkPersistentLogin = () => async (dispatch: AppDispatch) => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getCurrentUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    if (!auth()) {
      throw new Error('Firebase Auth is not initialized');
    }

    const user = auth().currentUser;

    if (user) {
      if (!firestore()) {
        throw new Error('Firestore is not initialized');
      }

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data() as UserData | undefined;

      if (userData) {
        dispatch(
          setUser({
            id: user.uid,
            email: user.email!,
            name: userData.name,
            userType: userData.userType,
          }),
        );
      } else {
        throw new Error('User data not found');
      }
    } else {
      dispatch(setUser(null));
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};
