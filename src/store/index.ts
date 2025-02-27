import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import hostProfilesReducer from './hostProfileSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hostProfiles: hostProfilesReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
