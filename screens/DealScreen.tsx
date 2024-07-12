import { StyleSheet, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';

import { auth } from '../config';
import { View, Image, Text, Button } from 'tamagui';
import { AvailabilityDoc } from '../types/deal';
import { LinearGradient } from 'expo-linear-gradient';
import IconButton from '../components/IconButton';
import { ArrowLeft, Heart } from 'lucide-react-native';
import useDeal from '../hooks/useDeal';
import useNavigation from '../hooks/useNavigation';
import { useContext } from 'react';
import { MapContext } from '../providers';

const { width } = Dimensions.get('window');

/**
 * [ ] Galery in Deal
 * [ ] Share Deal
 * [ ] Book Deal
 * [ ] Show Dates
 * [ ] Groups
 * [ ] Like / Unlike
 * [ ] Experience
 * [ ] Booking
 * [ ] Reservation
 */

const DealScreen: React.FC<{
  route: {
    params: { deal: AvailabilityDoc['deal']; venue: AvailabilityDoc['venue'] };
  };
}> = ({ route: props }) => {
  const { goBack, canGoBack, navigate } = useNavigation();

  const { deals } = useContext(MapContext);

  const { deal, t } = useDeal(props.params.deal, props.params.venue);

  const openVenue = () =>
    navigate({
      route: 'Venue',
      params: {
        venue: props.params.venue,
        deals: deals.flatMap((x) =>
          x.venue.id === deal.venue.id ? x.deal : []
        ),
      },
    });

  console.log(props);

  if (!deal) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: deal.media.card || '',
          width: width,
          height: width,
        }}
        width={width}
        height={width * 0.7}
      />
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
          {props.params.deal.title}
        </Text>
        <IconButton
          onPress={() => {}}
          icon={<Heart size="24px" color="#ffffff" />}
        />
      </LinearGradient>
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.8)',
          'rgba(0,0,0,0.95)',
          'rgba(0,0,0,1)',
          'rgba(0,0,0,1)',
        ]}
        style={styles.venue}
      >
        <View style={styles.venueInner} onPress={openVenue}>
          <Image
            source={{ uri: deal.venue.thumb, width: 36, height: 36 }}
            width="36px"
            height="36px"
            style={{ borderRadius: 18 }}
          />
          <View style={styles.venueText}>
            <Text color="#fff" fontWeight="bold">
              {deal?.venue?.title}
            </Text>
            <Text color="$color1" fontSize="$1">
              {deal?.venue?.subtitle?.split(' • ')[1]}
            </Text>
          </View>
        </View>
        <Button variant="outlined" color="#fff" size="$3">
          {t('Learn more')}
        </Button>
      </LinearGradient>
      <View style={styles.content}>
        <Text
          color="#fff"
          fontWeight="bold"
          fontSize="$8"
          style={{ marginBottom: 10 }}
        >
          {deal.title}
        </Text>
        <Text color="$color10">
          {deal.body ||
            `Lorem ipsum dolor sit amet consectetur. Sollicitudin non ipsum non congue nibh nulla. Ut commodo turpis quis molestie. Et scelerisque enim vitae ipsum. Fermentum quis nisl ipsum eget id massa adipiscing eu. Augue ultrices vulputate nec sit faucibus sit ac integer. Ultricies orci nascetur auctor eu. Aliquam penatibus dui cursus at bibendum sit.`}
        </Text>
      </View>
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
        >
          {t('Book Deal')}
        </Button>
      </LinearGradient>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  venue: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -50,
  },
  venueInner: {
    flexDirection: 'row',
    flex: 1,
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
  content: {
    padding: 20,
    paddingTop: 0,
  },
  button: {
    padding: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DealScreen;
