import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';

import { auth } from '../config';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'tamagui';

export const EmptyScreen: React.FC<any> = (props) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  const { goBack, canGoBack } = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleLogout} />
      {!!canGoBack() && <Button title="Go Back" onPress={() => goBack()} />}
      <Text>{JSON.stringify(props)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
