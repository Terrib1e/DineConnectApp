import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../store';
import {
  RootStackParamList,
  HostTabParamList,
  DinerTabParamList,
  DinerStackParamList,
} from '../types/navigation';

// Import all screens
import WelcomeScreen from '../screens/WelcomeScreen';
import UserTypeSelectionScreen from '../screens/UserTypeSelectionScreen';
import HostSignupScreen from '../screens/HostSignupScreen';
import DinerSignupScreen from '../screens/DinerSignupScreen';
import HostDashboardScreen from '../screens/HostDashboardScreen';
import DinerDashboardScreen from '../screens/DinerDashboardScreen';
import SearchHostsScreen from '../screens/SearchHostsScreen';
import HostProfileScreen from '../screens/HostProfileScreen';
import DinerProfileScreen from '../screens/DinerProfileScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import HostProfileCreationScreen from '../screens/HostProfileCreationScreen';
import EditMenuScreen from '../screens/EditMenuScreen';
import HostMenuScreen from '../screens/HostMenuScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const HostTab = createBottomTabNavigator<HostTabParamList>();
const DinerTab = createBottomTabNavigator<DinerTabParamList>();
const DinerStack = createStackNavigator<DinerStackParamList>();

const HostTabs = () => (
  <HostTab.Navigator>
    <HostTab.Screen
      name="HostDashboard"
      component={HostDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, size }) => (
          <Icon name="dashboard" color={color} size={size} />
        ),
      }}
    />
    <HostTab.Screen
      name="HostProfile"
      component={HostProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }}
    />
    <HostTab.Screen
      name="EditMenu"
      component={EditMenuScreen}
      options={{
        title: 'Edit Menu',
        tabBarIcon: ({ color, size }) => (
          <Icon name="restaurant-menu" color={color} size={size} />
        ),
      }}
    />
  </HostTab.Navigator>
);

const DinerTabs = () => (
  <DinerTab.Navigator>
    <DinerTab.Screen
      name="DinerDashboard"
      component={DinerDashboardScreen}
      options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}
    />
    <DinerTab.Screen
      name="SearchHosts"
      component={SearchHostsScreen}
      options={{
        title: 'Search',
        tabBarIcon: ({ color, size }) => (
          <Icon name="search" color={color} size={size} />
        ),
      }}
    />
    <DinerTab.Screen
      name="Bookings"
      component={DinerDashboardScreen}
      options={{
        title: 'My Bookings',
        tabBarIcon: ({ color, size }) => (
          <Icon name="event" color={color} size={size} />
        ),
      }}
    />
    <DinerTab.Screen
      name="DinerProfile"
      component={DinerProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }}
    />
  </DinerTab.Navigator>
);

const DinerStackScreen = () => (
  <DinerStack.Navigator>
    <DinerStack.Screen
      name="DinerTabs"
      component={DinerTabs}
      options={{ headerShown: false }}
    />
    <DinerStack.Screen
      name="HostMenu"
      component={HostMenuScreen}
      options={{ headerShown: true, title: 'Host Menu' }}
    />
    <DinerStack.Screen
      name="BookingForm"
      component={BookingFormScreen}
      options={{ headerShown: true, title: 'Make a Booking' }}
    />
    <DinerStack.Screen
      name="BookingDetails"
      component={BookingDetailsScreen}
      options={{ headerShown: true, title: 'Booking Details' }}
    />
    <DinerStack.Screen
      name="HostProfile"
      component={HostProfileScreen}
      options={{ headerShown: true, title: 'Host Profile' }}
    />
  </DinerStack.Navigator>
);

const RootNavigator: React.FC = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated routes
          <>
            {user.userType === 'host' ? (
              <>
                <Stack.Screen name="HostTabs" component={HostTabs} />
                <Stack.Screen
                  name="HostProfileCreation"
                  component={HostProfileCreationScreen}
                  options={{ headerShown: true, title: 'Create Host Profile' }}
                />
              </>
            ) : (
              <Stack.Screen name="DinerStack" component={DinerStackScreen} />
            )}
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="UserTypeSelection"
              component={UserTypeSelectionScreen}
              options={{ title: 'Select User Type' }}
            />
            <Stack.Screen
              name="HostSignup"
              component={HostSignupScreen}
              options={{ headerShown: true, title: 'Host Sign Up' }}
            />
            <Stack.Screen
              name="DinerSignup"
              component={DinerSignupScreen}
              options={{ headerShown: true, title: 'Diner Sign Up' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;