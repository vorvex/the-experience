import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EmptyScreen, ListAndMapScreen } from '../screens';
import { Film, Map, User } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { UserStack } from './UserStack';

const Tab = createBottomTabNavigator();

export function BottomTabStack() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }: any) => ({
        tabBarStyle: { position: 'absolute' },
        tabBarIcon: ({ focused, size }: any) => {
          if (route.name === 'Map') {
            return (
              <Map
                size={36}
                strokeWidth={focused ? 1.5 : 1}
                color={focused ? 'white' : '#777777'}
              />
            );
          } else if (route.name === 'Feed') {
            return (
              <Film
                size={36}
                strokeWidth={focused ? 1.5 : 1}
                color={focused ? 'white' : '#777777'}
              />
            );
          } else if (route.name === 'User') {
            return (
              <User
                size={36}
                strokeWidth={focused ? 1.5 : 1}
                color={focused ? 'white' : '#777777'}
              />
            );
          }
        },
        tabBarBackground: () => (
          <>
            <View
              // tint="dark"
              // intensity={100}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -20,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 1)',
              }}
            />
          </>
        ),
        tabBarLabel: ({ children }) => (
          <Text style={{ color: 'white' }}>{children}</Text>
        ),
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={ListAndMapScreen} />
      {/* <Tab.Screen name="Feed" component={EmptyScreen} /> */}
      <Tab.Screen name="User" component={UserStack} />
    </Tab.Navigator>
  );
}
