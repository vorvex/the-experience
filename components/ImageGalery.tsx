import React, { useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Image, View } from 'tamagui';
import { getMedia } from '../config/helper';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type ImageGaleryProps = {
  galery: (string | Record<string, string>)[];
  language: string;
};

const ImageGalery: React.FC<ImageGaleryProps> = (props) => {
  const [current, setCurrent] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrent(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <>
      <FlatList
        data={props.galery}
        keyExtractor={(item, i) => String(i)}
        horizontal
        // contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <Image
            key={index}
            source={{
              uri: getMedia(item, props.language) || '',
              height: width,
              width,
            }}
            height={width}
            width={width}
          />
        )}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={0}
        pagingEnabled
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'red',

          position: 'absolute',
          top: width - 40,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        {props.galery.map((_, i) => (
          <BlurView
            key={i}
            intensity={20}
            style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              overflow: 'hidden',
              backgroundColor:
                current === i ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          />
        ))}
      </View>
    </>
  );
};

export default ImageGalery;
