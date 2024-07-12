import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, createTamagui } from 'tamagui';

import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';
import { config } from '@tamagui/config/v3';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// make TypeScript type everything based on your config
// type Conf = typeof tamaguiConfig;
// declare module '@tamagui/core' {
//   // or 'tamagui'
//   interface TamaguiCustomConfig extends Conf {}
// }

const App = () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <RootNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </TamaguiProvider>
  );
};

export default App;
