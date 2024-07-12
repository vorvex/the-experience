import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Image, View } from 'tamagui';
import { getMedia } from '../config/helper';
import { BlurView } from 'expo-blur';
import { useSharedValue } from 'react-native-reanimated';
import { ImageGaleryProps } from './ImageGalery';

export const ImageGalery: React.FC<ImageGaleryProps> = (props) => {
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
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
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
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
            intensity={60}
            style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            }}
          />
        ))}
      </View>
    </>
  );
};
