// src/types/bookingTypes.ts

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

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
  menuItems: MenuItem[];
  totalPrice: number;
  status: BookingStatus;
  guestCount: number;
  specialRequests?: string; // Changed to optional string
}

export interface Booking extends BookingData {
  id: string;
}