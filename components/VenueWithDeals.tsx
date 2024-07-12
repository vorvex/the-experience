import React from 'react';
import { AvailabilityDoc } from '../types/deal';
import { Image, ScrollView, Text, View } from 'tamagui';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions, StyleSheet } from 'react-native';
import DealCard from './DealCard';
import useNavigation from '../hooks/useNavigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6 - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.7;
const SPACING = 10;

type VenueWithDealsProps = {
  venue: AvailabilityDoc['venue'] & { deals: AvailabilityDoc['deal'][] };
};

const VenueWithDeals: React.FC<VenueWithDealsProps> = ({ venue }) => {
  const { deals, id, title, subtitle } = venue;

  const { navigate } = useNavigation();

  const onVenuePress = () => {
    navigate({
      route: 'Venue',
      params: {
        venue,
        deals,
      },
    });
  };

  const onDealPress = (index: number) => {
    navigate({
      route: 'Deal',
      params: { deal: deals[index], venue },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.venue} onPress={onVenuePress}>
        <Image
          source={{ uri: venue.media.thumb, width: 32, height: 32 }}
          width="32px"
          height="32px"
          style={{ borderRadius: 16 }}
        />
        <View style={styles.venueText}>
          <Text color="#fff" fontWeight="bold">
            {title}
          </Text>
          <Text color="rgba(237, 237, 237, 1)">{subtitle}</Text>
        </View>
      </View>
      <FlatList
        data={deals}
        renderItem={({ item, index }) => (
          <DealCard
            key={index}
            deal={item}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            onPress={() => onDealPress(index)}
          />
        )}
        contentContainerStyle={styles.deals}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
        initialScrollIndex={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  venue: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  venueText: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 0,
  },
  deals: {
    gap: SPACING,
  },
  deal: {},
});

export default VenueWithDeals;
