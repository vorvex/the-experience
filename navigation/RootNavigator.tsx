import React, { useState, useContext, useEffect } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AuthenticatedUserContext, MapProvider } from '../providers';
// import { LoadingIndicator } from "../components";
import { auth } from '../config';
import { Text } from 'react-native';

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // primary: 'rgb(255, 45, 85)',
  },
};

export const RootNavigator = () => {
  const { firebaseUser, setFirebaseUser } = useContext(
    AuthenticatedUserContext
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser
          ? setFirebaseUser(authenticatedUser)
          : setFirebaseUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [firebaseUser]);

  if (isLoading) {
    return <Text children="Loading..." />;
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {firebaseUser ? (
        <MapProvider>
          <AppStack />
        </MapProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
