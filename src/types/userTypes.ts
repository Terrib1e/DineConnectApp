// src/types/userTypes.ts

export type UserType = 'diner' | 'host';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  userType: UserType;
}

export interface Diner extends BaseUser {
  userType: 'diner';
  // Add any diner-specific fields here
  dietaryPreferences?: string[];
  favoriteHosts?: string[]; // Array of host IDs
}

export interface Host extends BaseUser {
  userType: 'host';
  // Add any host-specific fields here
  cuisine: string;
  description: string;
  location: string;
  price: number;
  rating?: number;
  availableDates?: string[]; // Array of ISO date strings
}

export type User = Diner | Host;

export interface UserProfile {
  name: string;
  phoneNumber?: string;
  // Add any other common profile fields here
}

export interface HostProfile extends UserProfile {
  cuisine: string;
  description: string;
  location: string;
  price: number;
  rating?: number;
  availableDates?: string[]; // Array of ISO date strings
}

// You might also want to define types for updating profiles
export type UpdateUserProfileData = Partial<UserProfile>;
export type UpdateHostProfileData = Partial<HostProfile>;
