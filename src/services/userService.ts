import firestore from '@react-native-firebase/firestore';
import {AppDispatch} from '../store';
import {setUser} from '../store/authSlice';
import {User, Diner, Host} from '../types/userTypes';

export const updateUserProfile =
  (userId: string, userData: Partial<User>) =>
  async (dispatch: AppDispatch) => {
    try {
      await firestore().collection('users').doc(userId).update(userData);
      const userDoc = await firestore().collection('users').doc(userId).get();
      const completeUserData = userDoc.data() as User;

      if (completeUserData.userType === 'diner') {
        const dinerData: Diner = {
          ...completeUserData,
          dietaryPreferences: completeUserData.dietaryPreferences || [],
          favoriteHosts: completeUserData.favoriteHosts || [],
        };
        dispatch(setUser(dinerData));
      } else {
        const hostData: Host = {
          ...completeUserData,
          cuisine: completeUserData.cuisine || '',
          description: completeUserData.description || '',
          location: completeUserData.location || '',
          price: completeUserData.price || 0,
        };
        dispatch(setUser(hostData));
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };
