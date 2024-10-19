import firestore, {firebase} from '@react-native-firebase/firestore';
import {AppDispatch} from '../store';
import {
  setHostProfiles,
  setHostProfilesLoading,
  setHostProfilesError,
} from '../store/hostProfileSlice';
import {HostProfile, MenuItem} from '../types/hostTypes';

export const createHostProfile =
  (profileData: Omit<HostProfile, 'id'>) => async (dispatch: AppDispatch) => {
    dispatch(setHostProfilesLoading(true));
    try {
      const {currentUser} = firebase.auth();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const docRef = firestore()
        .collection('hostProfiles')
        .doc(currentUser.uid);
      await docRef.set(profileData);

      const createdProfile: HostProfile = {
        id: docRef.id,
        ...profileData,
      };

      dispatch(setHostProfiles([createdProfile]));
      return createdProfile;
    } catch (error) {
      console.error('Error creating host profile:', error);
      dispatch(
        setHostProfilesError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        ),
      );
      throw error;
    } finally {
      dispatch(setHostProfilesLoading(false));
    }
  };

export const fetchHostProfiles = () => async (dispatch: AppDispatch) => {
  dispatch(setHostProfilesLoading(true));
  try {
    const snapshot = await firestore().collection('hostProfiles').get();
    const profiles = snapshot.docs.map(
      doc => ({id: doc.id, ...doc.data()} as HostProfile),
    );
    console.log('Fetched profiles:', profiles); // Debugging log
    dispatch(setHostProfiles(profiles));
  } catch (error) {
    console.error('Error fetching host profiles:', error);
    dispatch(
      setHostProfilesError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      ),
    );
  } finally {
    dispatch(setHostProfilesLoading(false));
  }
};

export const fetchHostProfile = (hostId: string) => async (dispatch: AppDispatch) => {
  dispatch(setHostProfilesLoading(true));
  try {
    const doc = await firestore().collection('hostProfiles').doc(hostId).get();
    if (!doc.exists) {
      throw new Error('No host profile found');
    }

    const profile = {id: doc.id, ...doc.data()} as HostProfile;
    dispatch(setHostProfiles([profile]));
    return profile;
  } catch (error) {
    console.error('Error fetching host profile:', error);
    dispatch(
      setHostProfilesError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      ),
    );
    throw error;
  } finally {
    dispatch(setHostProfilesLoading(false));
  }
};

export const updateHostProfile =
  (profileId: string, profileData: Partial<HostProfile>) =>
  async (dispatch: AppDispatch) => {
    try {
      await firestore()
        .collection('hostProfiles')
        .doc(profileId)
        .update(profileData);
      const updatedDoc = await firestore()
        .collection('hostProfiles')
        .doc(profileId)
        .get();
      const updatedProfile = {
        id: profileId,
        ...updatedDoc.data(),
      } as HostProfile;
      dispatch(setHostProfiles([updatedProfile]));
    } catch (error) {
      console.error('Error updating host profile:', error);
      throw error;
    }
  };

  export const fetchHostMenu = (hostId: string) => async () => {
    try {
      const hostDoc = await firestore().collection('hostProfiles').doc(hostId).get();
      const hostData = hostDoc.data() as HostProfile;
      return hostData.menu || [];
    } catch (error) {
      console.error('Error fetching host menu:', error);
      throw error;
    }
  };

  export const updateHostMenu = (hostId: string, menu: MenuItem[]) => async (dispatch: AppDispatch) => {
    try {
      await firestore().collection('hostProfiles').doc(hostId).update({ menu });
      // Optionally, you can fetch and update the entire host profile in the Redux store
      const updatedHostDoc = await firestore().collection('hostProfiles').doc(hostId).get();
      const updatedHostProfile = { id: hostId, ...updatedHostDoc.data() } as HostProfile;
      dispatch(setHostProfiles([updatedHostProfile]));
    } catch (error) {
      console.error('Error updating host menu:', error);
      throw error;
    }
  };
