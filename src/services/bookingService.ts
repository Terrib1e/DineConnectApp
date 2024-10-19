import firestore from '@react-native-firebase/firestore';
import { AppDispatch } from '../store';
import {
  setBooking,
  setBookings,
  setBookingLoading,
  setBookingError,
} from '../store/bookingSlice';
import { BookingStatus } from '../types/bookingTypes';

export interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BookingData {
  hostId: string;
  dinerId: string;
  date: string;
  guestCount: number;
  menuItems: MenuItem[];
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
}

export interface Booking extends BookingData {
  id: string;
}

export const createBooking = (bookingData: BookingData) => async (dispatch: AppDispatch) => {
  dispatch(setBookingLoading(true));
  try {
    const docRef = await firestore().collection('bookings').add(bookingData);
    const newBooking: Booking = { id: docRef.id, ...bookingData };
    dispatch(setBooking(newBooking));
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    dispatch(setBookingError(error instanceof Error ? error.message : 'An unknown error occurred'));
    throw error;
  } finally {
    dispatch(setBookingLoading(false));
  }
};

export const fetchUserBookings = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setBookingLoading(true));
  try {
    const snapshot = await firestore()
      .collection('bookings')
      .where('dinerId', '==', userId)
      .get();

    const bookings: Booking[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Booking, 'id'>),
    }));

    dispatch(setBookings(bookings));
    return bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    handleBookingError(error, dispatch);
    throw error;
  } finally {
    dispatch(setBookingLoading(false));
  }
};

export const fetchHostBookings = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setBookingLoading(true));
  try {
    const snapshot = await firestore()
      .collection('bookings')
      .where('hostId', '==', userId)
      .get();

    const bookings: Booking[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Booking, 'id'>),
    }));

    dispatch(setBookings(bookings));
    return bookings;
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    handleBookingError(error, dispatch);
    throw error;
  } finally {
    dispatch(setBookingLoading(false));
  }
};

export const updateBookingStatus = (bookingId: string, status: BookingStatus) => async (dispatch: AppDispatch) => {
  dispatch(setBookingLoading(true));
  try {
    await firestore().collection('bookings').doc(bookingId).update({ status });
    const updatedBooking = await firestore().collection('bookings').doc(bookingId).get();
    dispatch(setBooking({
      id: bookingId,
      ...(updatedBooking.data() as Omit<Booking, 'id'>),
    }));
  } catch (error) {
    console.error('Error updating booking status:', error);
    handleBookingError(error, dispatch);
    throw error;
  } finally {
    dispatch(setBookingLoading(false));
  }
};

export const cancelBooking = (bookingId: string) => updateBookingStatus(bookingId, 'cancelled');

export const fetchBookingDetails = (bookingId: string) => async (dispatch: AppDispatch) => {
  dispatch(setBookingLoading(true));
  try {
    const doc = await firestore().collection('bookings').doc(bookingId).get();
    if (!doc.exists) {
      throw new Error('No booking found');
    }
    const booking: Booking = { id: doc.id, ...(doc.data() as Omit<Booking, 'id'>) };
    dispatch(setBooking(booking));
    return booking;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    handleBookingError(error, dispatch);
    throw error;
  } finally {
    dispatch(setBookingLoading(false));
  }
};

const handleBookingError = (error: unknown, dispatch: AppDispatch) => {
  if (error instanceof Error) {
    if ((error as any).code === 'permission-denied') {
      dispatch(setBookingError('You do not have permission to access these bookings. Please check your account type.'));
    } else {
      dispatch(setBookingError(`Firestore error: ${error.message}`));
    }
  } else {
    dispatch(setBookingError('An unknown error occurred while fetching bookings'));
  }
};

export default {
  createBooking,
  fetchUserBookings,
  fetchHostBookings,
  updateBookingStatus,
  cancelBooking,
  fetchBookingDetails,
};