import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EmptyScreen } from '../screens/EmptyScreen';
import DealScreen from '../screens/DealScreen';
import VenueScreen from '../screens/VenueScreen';
import UserScreen from '../screens/UserScreen';

const Stack = createStackNavigator();

export const UserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="User"
    >
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Venue" component={VenueScreen as any} />
        <Stack.Screen name="VenueReviews" component={VenueScreen as any} />
        <Stack.Screen name="VenueDeals" component={VenueScreen as any} />
        <Stack.Screen name="Deal" component={DealScreen as any} />
        <Stack.Screen name="Favorites" component={EmptyScreen} />
        <Stack.Screen name="Subscription" component={EmptyScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
