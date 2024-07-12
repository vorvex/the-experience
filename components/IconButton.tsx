import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  StyleProp,
} from 'react-native';
import { Icon, IconNode } from 'lucide-react-native'; // Importing the Icon component from lucide-react-native
import { ViewStyle } from 'tamagui';

const IconButton: React.FC<{
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ icon, onPress, style, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        ...(Array.isArray(style) ? (style as any) : [style as any]),
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },
});

export default IconButton;
