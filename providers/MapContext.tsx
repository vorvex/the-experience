import { User } from 'firebase/auth';
import React, {
  useState,
  createContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Region } from 'react-native-maps';
import {} from 'expo-location';
import useCurrentLocation from '../hooks/useCurrentLocation';
import * as Geofire from 'geofire-common';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { LoaderCircle } from 'lucide-react-native';
import { Spinner } from 'tamagui';
import { FlatList } from 'react-native-gesture-handler';
import { AvailabilityDoc } from '../types/deal';

const CITIES = [
  {
    id: 'heidelberg',
    name: 'Heidelberg',
    region: {
      latitude: 49.39875,
      longitude: 8.672434,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    country: 'DE',
  },
  {
    id: 'mannheim',
    name: 'Mannheim',
    region: {
      latitude: 49.4875,
      longitude: 8.466,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    country: 'DE',
  },
  {
    id: 'alicante',
    name: 'Alicante',
    region: {
      latitude: 38.33928297771545,
      longitude: -0.4809567230073394,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.061,
    },
    country: 'ES',
  },
  {
    id: 'denia',
    name: 'Denia',
    region: {
      latitude: 38.839440308871936,
      latitudeDelta: 0.09176231141195501,
      longitude: 0.10724602574772843,
      longitudeDelta: 0.06099999999992001,
    },
    country: 'ES',
  },
];

export type Filters = {
  date?: string;
  time?: string;
  tags?: string[];
};

// const VENUES = [
//   { id: '1', lat: 0.006, lng: 0.006, name: 'Venue 1', elevated: false },
//   { id: '2', lat: -0.007, lng: 0.002, name: 'Venue 2', elevated: false },
//   { id: '3', lat: 0.0, lng: -0.008, name: 'Venue 3', elevated: false },
//   { id: '4', lat: -0.004, lng: 0.0, name: 'Venue 4', elevated: false },
//   { id: '5', lat: 0.003, lng: -0.001, name: 'Venue 5', elevated: true },
// ];

const AVAILABILITIES: AvailabilityDoc[] = [
  {
    deal: {
      id: '1',
      title: 'Deal 1',
      generalRelevance: 1,
      reusable: { type: 'always' },
      media: {
        card: 'https://images.unsplash.com/photo-1484156818044-c040038b0719?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    },
    venue: {
      id: '1',
      title: 'Schilling Roofbar',
      subtitle: 'Nikkei Sushi & Cocktails • 4.9⭐️ (1000km)',
      tags: ['tag1', 'tag2'],
      city: 'heidelberg',
      latitude: 0.006,
      longitude: 0.006,
      hash: 'hash1',
      media: {
        thumb: 'https://via.placeholder.com/64',
        small: 'https://via.placeholder.com/300',
        banner: 'https://via.placeholder.com/600',
      },
    },
    date: '2021-09-06',
    active: true,
    availableWithoutSubscription: true,
    slots: {
      '18:00': 10,
      earlyMorning: 0,
      breakfast: 0,
      lunch: 0,
      afternoon: 0,
      dinner: 10,
      lateNight: 0,
    },
  },
  {
    deal: {
      id: '2',
      title: 'Deal 2',
      generalRelevance: 1,
      reusable: { type: 'always' },
      media: {
        card: 'https://via.placeholder.com/300',
      },
    },
    venue: {
      id: '2',
      title: 'Da Mario',
      subtitle: 'Italiener • 4.8⭐️ (500)',
      tags: ['tag1', 'tag2'],
      city: 'heidelberg',
      latitude: -0.007,
      longitude: 0.002,
      hash: 'hash1',
      media: {
        thumb: 'https://via.placeholder.com/64',
        small: 'https://via.placeholder.com/300',
        banner: 'https://via.placeholder.com/600',
      },
    },
    date: '2021-09-06',
    active: true,
    availableWithoutSubscription: true,
    slots: {
      '18:00': 10,
      earlyMorning: 0,
      breakfast: 0,
      lunch: 0,
      afternoon: 0,
      dinner: 10,
      lateNight: 0,
    },
  },
  {
    deal: {
      id: '3',
      title: 'Deal 3',
      generalRelevance: 1,
      reusable: { type: 'always' },
      media: {
        card: 'https://via.placeholder.com/300x200',
      },
    },
    venue: {
      id: '2',
      title: 'Da Mario',
      subtitle: 'Italiener • 4.8⭐️ (500)',
      tags: ['tag1', 'tag2'],
      city: 'heidelberg',
      latitude: -0.007,
      longitude: 0.002,
      hash: 'hash1',
      media: {
        thumb: 'https://via.placeholder.com/64',
        small: 'https://via.placeholder.com/300',
        banner: 'https://via.placeholder.com/600',
      },
    },
    date: '2021-09-06',
    active: true,
    availableWithoutSubscription: true,
    slots: {
      '18:00': 10,
      earlyMorning: 0,
      breakfast: 0,
      lunch: 0,
      afternoon: 0,
      dinner: 10,
      lateNight: 0,
    },
  },
  {
    deal: {
      id: '4',
      title: 'Deal 4',
      generalRelevance: 1,
      reusable: { type: 'always' },
      media: {
        card: 'https://via.placeholder.com/300',
      },
    },
    venue: {
      id: '3',
      title: 'Heid`s',
      subtitle: 'Steakhouse • 4.7⭐️ (1000)',
      tags: ['tag1', 'tag2'],
      city: 'heidelberg',
      latitude: 0,
      longitude: -0.008,
      hash: 'hash1',
      media: {
        thumb: 'https://via.placeholder.com/64',
        small: 'https://via.placeholder.com/300',
        banner: 'https://via.placeholder.com/600',
      },
    },
    date: '2021-09-06',
    active: true,
    availableWithoutSubscription: true,
    slots: {
      '18:00': 10,
      earlyMorning: 0,
      breakfast: 0,
      lunch: 0,
      afternoon: 0,
      dinner: 10,
      lateNight: 0,
    },
  },
];

export type MapState = {
  city?: string;
  region?: Region;
  hash?: string;
  prevHash?: string;
  filters?: Filters;
  filterOpen?: boolean;
  view: 'map' | 'list';
  search?: string;
  overlay?: 'search' | 'cities' | null;
  loading?: boolean;
  searchArea?: string; // city_id | hash_id
  currentDeal?: string | null;
};

export interface MapContextType {
  state: MapState;
  setState: React.Dispatch<React.SetStateAction<MapState>>;
  getCurrentLocation: (additional?: Partial<MapState>) => Promise<void>;
  cities: typeof CITIES;
  changeRegion: (
    region: Partial<Region> & { longitude: number; latitude: number },
    additional?: Partial<MapState>
  ) => void;
  isInCurrentArea: boolean;
  getCurrentArea: () => Promise<void>;
  venues: (AvailabilityDoc['venue'] & { deals: AvailabilityDoc['deal'][] })[];
  deals: AvailabilityDoc[];
  flatListRef: React.RefObject<FlatList>;
}

export const MapContext = createContext<MapContextType>({
  state: { view: 'map' },
  setState: () => {},
  getCurrentLocation: async () => {},
  cities: CITIES,
  changeRegion: () => {},
  getCurrentArea: async () => {},
  isInCurrentArea: false,
  venues: [],
  deals: AVAILABILITIES,
  flatListRef: { current: null },
});

export const MapProvider = ({ children }: any) => {
  const [state, setState] = useState<MapState>({
    view: 'map',
    city: '',
    overlay: 'cities',
  });

  const flatListRef = useRef<FlatList>(null);

  const cities = CITIES;

  const currentLocation = useCurrentLocation();

  const changeRegion = (
    region: Partial<Region> & { longitude: number; latitude: number },
    additional: Partial<MapState> = {}
  ) => {
    let hash = Geofire.geohashForLocation(
      [region.latitude, region.longitude],
      6
    );

    setState((state) => {
      let newState = {
        ...state,
        region: {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta:
            region.latitudeDelta ?? state.region?.latitudeDelta ?? 0.0922,
          longitudeDelta:
            region.longitudeDelta ?? state.region?.latitudeDelta ?? 0.0922,
        },
        ...additional,
        prevHash: state.hash,
        hash,
        searchArea: additional.city
          ? `city_${additional.city}`
          : `hash_${hash}`,
      };

      if (newState.searchArea !== state.searchArea && newState.currentDeal) {
        newState.currentDeal = null;
      }

      return newState;
    });
  };

  const getCurrentArea = async () => {
    let hash = state.hash;

    if (!!state.region) {
      let distanceToCities = cities
        .map((city) => ({
          id: city.id,
          distance: Geofire.distanceBetween(
            [state?.region?.latitude ?? 0, state?.region?.longitude ?? 0],
            [city.region.latitude, city.region.longitude]
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      const closebyCity = distanceToCities.find((c) => c.distance <= 10)?.id;

      if (closebyCity) {
        let city = cities.find((x) => x.id === closebyCity);

        changeRegion(city?.region ?? state.region, {
          searchArea: `city_${city?.id}`,
          city: city?.id,
        });
      } else {
        setState((state) => ({
          ...state,
          searchArea: `hash_${hash}`,
          hash,
          prevHash: hash,
        }));
      }
    }
  };

  const isInCurrentArea = useMemo(() => {
    if (state.searchArea && state.searchArea.startsWith('hash_')) {
      let currentHash = state.searchArea.replace('hash_', '');

      return currentHash.slice(0, 4) === state?.hash?.slice(0, 4);
    } else if (state.searchArea && state.searchArea.startsWith('city_')) {
      let distanceToCities = cities
        .map((city) => ({
          id: city.id,
          distance: Geofire.distanceBetween(
            [state?.region?.latitude ?? 0, state?.region?.longitude ?? 0],
            [city.region.latitude, city.region.longitude]
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      console.log(distanceToCities);

      const closebyCity = distanceToCities.find((c) => c.distance <= 10)?.id;

      return state.searchArea === `city_${closebyCity}`;
    }

    return true;
  }, [state.hash, state.searchArea]);

  // useEffect(() => {
  //   if(state.currentDeal) {

  //   }
  // }, [state.currentDeal])

  const getCurrentLocation = async (additional: Partial<MapState> = {}) => {
    if (state.loading) return;
    setState((state) => ({ ...state, loading: true }));
    const location = await currentLocation.getCurrentLocation();
    if (location) {
      let distanceToCities = cities
        .map((city) => ({
          id: city.id,
          distance: Geofire.distanceBetween(
            [location.coords.latitude, location.coords.longitude],
            [city.region.latitude, city.region.longitude]
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      const closebyCity = distanceToCities.find((c) => c.distance < 100)?.id;

      if (closebyCity) {
        let city = cities.find((x) => x.id === closebyCity);

        if (!city) return;

        changeRegion(
          {
            latitude: city.region.latitude,
            longitude: city.region.longitude,
            latitudeDelta: city.region?.latitudeDelta ?? 0.0922,
            longitudeDelta: city.region?.longitudeDelta ?? 0.0421,
          },
          {
            city: city.id,
            ...additional,
            loading: false,
          }
        );
      } else {
        changeRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: state?.region?.latitudeDelta ?? 0.0922,
            longitudeDelta: state?.region?.longitudeDelta ?? 0.0421,
          },
          {
            city: '__current__',
            ...additional,
            loading: false,
          }
        );
      }
    } else {
      setState((state) => ({
        ...state,
        ...additional,
        overlay: 'cities',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    getCurrentLocation({ overlay: null });
  }, []);

  const deals = useMemo(() => {
    let { latitude, longitude } = state.region ?? { latitude: 0, longitude: 0 };

    return AVAILABILITIES.map((c) => ({
      ...c,
      venue: {
        ...c.venue,
        latitude: c.venue.latitude + latitude,
        longitude: c.venue.longitude + longitude,
      },
    }));
  }, [state.searchArea]);

  const venues = useMemo(() => {
    return deals.reduce((acc, c) => {
      let venue = acc.find((v) => v.id === c.venue.id);

      if (!venue) {
        venue = {
          ...c.venue,
          deals: [],
        };

        acc.push(venue);
      }

      venue.deals.push(c.deal);

      return acc;
    }, [] as (AvailabilityDoc['venue'] & { deals: AvailabilityDoc['deal'][] })[]);
  }, [deals]);

  return (
    <MapContext.Provider
      value={{
        state,
        setState,
        getCurrentLocation,
        cities,
        changeRegion,
        isInCurrentArea,
        getCurrentArea,
        venues,
        deals,
        flatListRef,
      }}
    >
      {state.loading && (
        <BlurView
          intensity={60}
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: 'center', alignItems: 'center', zIndex: 1001 },
          ]}
        >
          <Spinner size="large" color="#ffffff" />
        </BlurView>
      )}
      {children}
    </MapContext.Provider>
  );
};
