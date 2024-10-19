import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  UserTypeSelection: undefined;
  HostSignup: undefined;
  DinerSignup: undefined;
  HostTabs: undefined;
  DinerStack: undefined;
  HostProfile: { hostId: string };
  HostProfileCreation: undefined;
  BookingDetails: { bookingId: string };
  BookingForm: { hostId: string };
  EditMenu: undefined;
  HostMenu: { hostId: string };
  SearchHosts: undefined;
};

export type HostTabParamList = {
  HostDashboard: undefined;
  HostProfile: undefined;
  EditMenu: undefined;
};

export type DinerStackParamList = {
  DinerTabs: undefined;
  HostMenu: { hostId: string };
  BookingForm: { hostId: string };
  BookingDetails: { bookingId: string };
  HostProfile: { hostId: string };
};

export type DinerTabParamList = {
  DinerDashboard: undefined;
  SearchHosts: undefined;
  Bookings: undefined;
  DinerProfile: undefined;
  BookingDetails: { bookingId: string };
  HostMenu: { hostId: string };
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type HostTabNavigationProp<T extends keyof HostTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<HostTabParamList, T>,
    StackNavigationProp<RootStackParamList>
  >;

export type DinerStackNavigationProp<T extends keyof DinerStackParamList> =
  StackNavigationProp<DinerStackParamList, T>;

export type DinerTabNavigationProp<T extends keyof DinerTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<DinerTabParamList, T>,
    StackNavigationProp<DinerStackParamList>
  >;

export type DinerScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DinerStackParamList>,
  BottomTabNavigationProp<DinerTabParamList>
>;