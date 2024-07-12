import React from 'react';
import { AvailabilityDoc } from '../types/deal';
import { StyleSheet } from 'react-native';
import { Image, Text, View, ViewStyle } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

type DealCardProps = {
  deal: AvailabilityDoc['deal'];
  onPress: () => void;
  width: number;
  height: number;
  style?: ViewStyle;
  animated?: any;
};

const FlexibleView: React.FC<{
  children: any;
  animated?: any;
  onPress: () => void;
  width: number;
  height: number;
  style?: ViewStyle;
}> = ({ children, animated, height, width, onPress, style }) => {
  if (!!animated) {
    return (
      <View style={styles.containerInner} onPress={onPress}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { height, width },
        ...(Array.isArray(style) ? style : [style]),
      ]}
      onPress={onPress}
    >
      <View style={styles.containerInner}>{children}</View>
    </View>
  );
};

const DealCard: React.FC<DealCardProps> = ({
  deal,
  onPress,
  width,
  height,
  style = {},
  animated,
}) => {
  return (
    <FlexibleView
      animated={animated}
      height={height}
      width={width}
      style={[...(Array.isArray(style) ? style : [style])] as any}
      onPress={onPress}
    >
      <Text style={{ zIndex: 3 }} color="#fff">
        {deal.title}
      </Text>
      <Image
        source={{ uri: deal.media.card, width, height }}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, zIndex: 1 }}
      />
      <LinearGradient
        colors={['transparent', '#000']}
        style={{
          position: 'absolute',
          left: 0,
          top: height / 2,
          right: 0,
          height: height / 2,
          zIndex: 2,
        }}
      />
    </FlexibleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 10,
  },
  containerInner: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default DealCard;
