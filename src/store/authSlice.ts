import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { HostProfile } from 'types/hostTypes';

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'host' | 'diner';
  phoneNumber?: string; // Make phoneNumber optional
}

interface AuthState {
  user: User | null;
  hosts: {
    profiles: HostProfile[];
    isLoading: boolean;
    error: string | null;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  hosts: {
    profiles: [],
    isLoading: false,
    error: null,
  },
  isLoading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
        setHostProfiles: (state, action: PayloadAction<HostProfile[]>) => {
      state.hosts.profiles = action.payload;
      state.hosts.isLoading = false;
      state.hosts.error = null;
    },
    setHostProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.hosts.isLoading = action.payload;
    },
    setHostProfileError: (state, action: PayloadAction<string>) => {
      state.hosts.error = action.payload;
      state.hosts.isLoading = false;
    }
  }
});

export const {setUser, setLoading, setError, logout} = authSlice.actions;
export default authSlice.reducer;
