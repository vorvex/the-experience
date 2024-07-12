import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { MapContext } from '../providers';
import { MapContextType } from '../providers/MapContext';
import DealCard from './DealCard';
import useNavigation from '../hooks/useNavigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 0.7;
const SPACING = 0;

interface CardProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  item: MapContextType['deals'][0];
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ index, item, scrollX, onPress }) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING / 2),
    index * (CARD_WIDTH + SPACING / 2),
    (index + 1) * (CARD_WIDTH + SPACING / 2),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8]);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);

    if (index === 6) console.warn(scrollX.value, inputRange, CARD_WIDTH);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <DealCard
        key={item.deal.id}
        deal={item.deal}
        onPress={onPress}
        height={CARD_HEIGHT}
        width={CARD_WIDTH}
        animated
      />
    </Animated.View>
  );
};

const Carousel: React.FC = () => {
  // const [currentCard, setCurrentCard] = useState(0);

  const { navigate } = useNavigation();

  const { state, setState, deals, flatListRef } = useContext(MapContext);

  const currentCard =
    deals.findIndex((d) => d.deal.id === state.currentDeal) || 0;

  const scrollX = useSharedValue(currentCard * (CARD_WIDTH + SPACING));

  const [localCurrentCard, setLocalCurrentCard] = useState(currentCard);

  const setCurrentCard = useCallback((index: number) => {
    setLocalCurrentCard(index);
    setState((st) => ({
      ...st,
      currentDeal: deals[index].deal.id,
      region: {
        latitude:
          deals[index].venue.latitude +
          -(st?.region?.latitudeDelta || 0.0922) / 6,
        longitude: deals[index].venue.longitude,
        latitudeDelta: st?.region?.latitudeDelta || 0.0922,
        longitudeDelta: st?.region?.longitudeDelta || 0.0922,
      },
    }));
  }, []);

  const onCardPress = useCallback(
    (index: number) => {
      console.log('Card pressed:', index, localCurrentCard);
      if (index === localCurrentCard) {
        // Navigate to venue details
        navigate({
          route: 'Deal',
          params: deals[index],
        });
      } else {
        setCurrentCard(index);
        flatListRef.current?.scrollToIndex({ index, animated: false });
      }
    },
    [localCurrentCard]
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const newCardIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    );
    runOnJS(setCurrentCard)(newCardIndex);
  };

  useEffect(() => {
    console.log('Current card index:', currentCard);
  }, [currentCard]);

  return (
    <View style={styles.container}>
      <FlatList
        data={deals}
        ref={flatListRef}
        keyExtractor={(item) => item.deal.id}
        horizontal
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <Card
            index={index}
            item={item}
            scrollX={scrollX}
            onPress={() => onCardPress(index)}
          />
        )}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
        initialScrollIndex={currentCard}
        pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the carousel horizontally
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 165,
    zIndex: 220,
    // backgroundColor: 'red',
  },
  contentContainer: {
    paddingHorizontal: (width - CARD_WIDTH) / 2, // Center the cards
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Carousel;
