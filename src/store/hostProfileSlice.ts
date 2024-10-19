import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {HostProfile} from '../types/hostTypes';

interface HostProfilesState {
  profiles: HostProfile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HostProfilesState = {
  profiles: [],
  isLoading: false,
  error: null,
};

const hostProfilesSlice = createSlice({
  name: 'hostProfiles',
  initialState,
  reducers: {
    setHostProfiles: (state, action: PayloadAction<HostProfile[]>) => {
      state.profiles = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setHostProfilesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHostProfilesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {setHostProfiles, setHostProfilesLoading, setHostProfilesError} =
  hostProfilesSlice.actions;
export default hostProfilesSlice.reducer;
