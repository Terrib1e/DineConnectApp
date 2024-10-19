// src/types/hostTypes.ts

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string; // Optional field for item description
}

export interface HostProfile {
  latitude: number;
  longitude: number;
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  cuisine: string;
  description: string;
  location: string;
  price: number;
  rating?: number;
  profileImage?: string;
  menu: MenuItem[];
  availableDates?: string[]; // Array of ISO date strings
}

export type CreateHostProfileData = Omit<HostProfile, 'id' | 'rating' | 'menu'>;

export type UpdateHostProfileData = Partial<CreateHostProfileData>;

export interface HostAvailability {
  id: string;
  hostId: string;
  date: string; // ISO date string
  timeSlots: string[]; // Array of time slots, e.g., ["18:00", "19:00", "20:00"]
}

export interface HostReview {
  id: string;
  hostId: string;
  dinerId: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
}
