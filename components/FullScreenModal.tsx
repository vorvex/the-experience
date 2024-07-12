import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { H4, ScrollView, View } from 'tamagui';
import IconButton from './IconButton';

const FullScreenModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode | React.ReactNode[];
  subHeader?: React.ReactNode;
  noScrollView?: boolean;
}> = ({ open, onClose, title, children, subHeader, noScrollView }) => {
  const { top } = useSafeAreaInsets();

  if (!open) return null;

  return (
    <BlurView intensity={60} style={styles.background}>
      <View style={styles.header}>
        <StatusBar />
        <View style={{ height: top - 10 }} />
        <View style={styles.headerInner}>
          <H4 color="#ffffff" fontWeight="bold">
            {title}
          </H4>
          <IconButton
            icon={<X size="24px" color="#ffffff" />}
            onPress={onClose}
          />
        </View>
        {subHeader}
      </View>
      {!noScrollView ? <ScrollView>{children}</ScrollView> : children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  header: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // zIndex: 100,
  },
  headerInner: {
    // height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'black',
    padding: 10,
  },
});

export default FullScreenModal;
