import React from 'react';
import { View, StyleSheet, Button, Text, StatusBar } from 'react-native';

import { auth } from '../config';
import { signInAnonymously } from 'firebase/auth';

export const WelcomeScreen = () => {
  const onSkip = () =>
    signInAnonymously(auth).catch((error) =>
      console.log('Error signing in anonymously: ', error.message)
    );

  return (
    <View style={styles.container}>
      <StatusBar />
      <Text>Welcome</Text>
      <Button title="Skip" onPress={onSkip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
