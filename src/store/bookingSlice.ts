

// bookingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../types/bookingTypes';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      } else {
        state.bookings.push(action.payload);
      }
      state.isLoading = false;
      state.error = null;
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setBookingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBookingError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setBooking, setBookings, setBookingLoading, setBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
