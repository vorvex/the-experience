import { View, StyleSheet, Dimensions, StyleProp } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Image, Text, Button, ScrollView } from 'tamagui';
import { AvailabilityDoc } from '../types/deal';
import { LinearGradient } from 'expo-linear-gradient';
import IconButton from '../components/IconButton';
import { showLocation } from 'react-native-map-link';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Globe2,
  Heart,
  Instagram,
  Map,
  Phone,
  Star,
  Table2,
} from 'lucide-react-native';
import useDeal from '../hooks/useDeal';
import useVenue from '../hooks/useVenue';
import { getMedia, getNextXDays, getWeekdayString } from '../config/helper';
import { FlatList } from 'react-native-gesture-handler';
import DealCard from '../components/DealCard';
import useNavigation from '../hooks/useNavigation';
import useTranslation from '../hooks/useTranslation';
import LineItemWithIcon from '../components/LineItemWithIcon';
import ImageGalery from '../components/ImageGalery';

/**
 * [x] Image Array in Venue
 * [x] Carousel for Images
 * [ ] 2 Reviews in Venue ???
 * [x] Make Review Guest Friendly
 * [ ] Show FAQs
 * [x] Show Opening Hours
 * [ ] Like / Unlike
 * [ ] Deals Page
 * [ ] Reviews Page
 */

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.6 - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.7;
const SPACING = 10;

const VenueScreen: React.FC<{
  route: {
    params: {
      deals?: AvailabilityDoc['deal'][];
      venue: AvailabilityDoc['venue'];
    };
  };
}> = ({ route: props }) => {
  const { goBack, canGoBack, navigate } = useNavigation();

  const { t } = useTranslation();

  const {
    venue,
    deals,
    texts,
    language,
    reviews,
    next7Days,
    avgRating,
    today,
  } = useVenue(props.params.venue, props.params.deals || []);

  if (!props?.params?.venue?.id) {
    return null;
  }

  const onDealPress = (index: number) => {
    navigate({
      route: 'Deal',
      params: { deal: deals[index], venue: props.params.venue },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        style={styles.header}
      >
        <IconButton
          onPress={() => {
            if (canGoBack()) {
              goBack();
            }
          }}
          disabled={!canGoBack()}
          icon={<ArrowLeft size="24px" color="#ffffff" />}
        />
        <Text color="#ffffff" fontSize="$5" fontWeight="bold">
          {texts.title}
        </Text>
        <IconButton
          onPress={() => {}}
          icon={<Heart size="24px" color="#ffffff" />}
        />
      </LinearGradient>
      <ScrollView>
        {venue.galery.length < 2 ? (
          <Image
            source={{
              uri: getMedia(venue.media.banner, language) || '',
              width: width,
              height: width,
            }}
            width={width}
            height={width}
          />
        ) : (
          <ImageGalery galery={venue.galery} language={language} />
        )}

        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          style={{ height: 30, width: '100%', marginTop: -30 }}
        ></LinearGradient>
        <View style={styles.content}>
          <Text
            color="#fff"
            fontWeight="bold"
            fontSize="$8"
            style={{ marginBottom: 10 }}
          >
            {texts.title}
          </Text>
          <Text color="$color10">
            {texts.body ||
              `Lorem ipsum dolor sit amet consectetur. Sollicitudin non ipsum non congue nibh nulla. Ut commodo turpis quis molestie. Et scelerisque enim vitae ipsum. Fermentum quis nisl ipsum eget id massa adipiscing eu. Augue ultrices vulputate nec sit faucibus sit ac integer. Ultricies orci nascetur auctor eu. Aliquam penatibus dui cursus at bibendum sit.`}
          </Text>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 5,
              paddingHorizontal: 20,
            }}
          >
            <Text color="#fff" fontWeight="bold" fontSize="$4">
              Deals & Experiences
            </Text>
            <IconButton
              onPress={() => {}}
              icon={<ChevronRight size="24px" color="rgba(62, 62, 62, 1)" />}
            />
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
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
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

        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 5,
              paddingHorizontal: 20,
            }}
          >
            <Text color="#fff" fontWeight="bold" fontSize="$4">
              {t('Reviews')}
            </Text>
            <IconButton
              onPress={() => {}}
              icon={<ChevronRight size="24px" color="rgba(62, 62, 62, 1)" />}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 10,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
          >
            <Text color="#fff" fontWeight="bold" fontSize="$9">
              {avgRating.toFixed(1).replace('.', ',')}
            </Text>
            <Stars rating={avgRating} size={24} style={{ flex: 1 }} />
            <Text color="rgba(126, 126, 126, 1)">1000 {t('Ratings')}</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            {reviews.map((review, index) => (
              <View style={{ paddingHorizontal: 20, gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 5,
                  }}
                >
                  <Text
                    color="#fff"
                    fontWeight="bold"
                    fontSize="$4"
                    style={{ flex: 1 }}
                  >
                    {review.name}
                  </Text>
                  <Stars rating={4} />
                </View>
                <Text color="rgba(126, 126, 126, 1)">{review.comment}</Text>
                <Text color="rgba(126, 126, 126, 1)" textAlign="right">
                  1 Week ago
                </Text>
              </View>
            ))}
          </View>
        </View>
        <LineItemWithIcon
          icon={Globe2}
          label={venue.contact.website}
          onPress={() => {
            WebBrowser.openBrowserAsync('https://' + venue.contact.website);
          }}
        />
        {venue.gastronautId && (
          <LineItemWithIcon
            icon={Table2}
            label={t('Make a Reservation')}
            onPress={() => {
              WebBrowser.openBrowserAsync(
                'https://gastronaut.ai/reservations/' + venue.gastronautId
              );
            }}
          />
        )}
        <LineItemWithIcon
          icon={Phone}
          label={venue.contact.phone}
          onPress={() => {
            Linking.openURL('tel:+' + venue.contact.phone.replace(/\W/gm, ''));
          }}
        />
        {venue.socials.instagram && (
          <LineItemWithIcon
            icon={Instagram}
            label={venue.socials.instagram}
            onPress={() => {
              Linking.openURL(
                'https://www.instagram.com/' + venue.socials.instagram
              );
            }}
          />
        )}
        <LineItemWithIcon icon={Clock} bold label={t('Opening Hours')}>
          <View style={{ gap: 8 }}>
            {next7Days
              .sort(
                (a, b) =>
                  (new Date(a.date).getDay() || 7) -
                  (new Date(b.date).getDay() || 7)
              )
              .map(({ date, hours }) => (
                <Day
                  day={t(getWeekdayString(date))}
                  hours={hours}
                  today={date === today}
                />
              ))}
          </View>
        </LineItemWithIcon>
        <LineItemWithIcon
          icon={Map}
          label={venue.address}
          onPress={() => {
            showLocation({
              address: venue.address,
            });
          }}
        />
        <View style={{ height: 60 }} />
      </ScrollView>
      {venue.gastronautId && (
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,0.95)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
          ]}
          style={styles.button}
        >
          <Button
            backgroundColor="#601D48"
            color="#fff"
            style={{ width: '100%' }}
            onPress={() => {
              WebBrowser.openBrowserAsync(
                'https://gastronaut.ai/reservations/' + venue.gastronautId
              );
            }}
          >
            {t('Make a Reservation')}
          </Button>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  content: {
    padding: 20,
  },
  button: {
    padding: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default VenueScreen;

const Stars: React.FC<{
  size?: number;
  gap?: number;
  rating: number;
  style?: StyleProp<any>;
}> = ({ size = 20, gap = size / 4, rating, style }) => {
  function getColor(index: number) {
    if (rating > index) {
      return 'rgba(69, 26, 55, 1)';
    }
    return 'rgba(31, 18, 27, 1)';
  }

  return (
    <View style={[{ flexDirection: 'row', gap }, style]}>
      <Star size={size} color={getColor(0.5)} fill={getColor(0.5)} />
      <Star size={size} color={getColor(1.5)} fill={getColor(1.5)} />
      <Star size={size} color={getColor(2.5)} fill={getColor(2.5)} />
      <Star size={size} color={getColor(3.5)} fill={getColor(3.5)} />
      <Star size={size} color={getColor(4.5)} fill={getColor(4.5)} />
    </View>
  );
};

const Day: React.FC<{
  day: string;
  hours: string;
  today: boolean;
}> = ({ day, hours, today }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text color={today ? 'rgba(237, 237, 237, 1)' : 'rgba(126, 126, 126, 1)'}>
        {day}
      </Text>
      <Text color={today ? 'rgba(237, 237, 237, 1)' : 'rgba(126, 126, 126, 1)'}>
        {hours}
      </Text>
    </View>
  );
};
