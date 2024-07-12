import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EmptyScreen } from '../screens/EmptyScreen';
import { BottomTabStack } from './BottomTabStack';
import DealScreen from '../screens/DealScreen';
import VenueScreen from '../screens/VenueScreen';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={BottomTabStack} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Venue" component={VenueScreen as any} />
        <Stack.Screen name="VenueReviews" component={VenueScreen as any} />
        <Stack.Screen name="VenueDeals" component={VenueScreen as any} />
        <Stack.Screen name="Deal" component={DealScreen as any} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
