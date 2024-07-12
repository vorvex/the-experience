import React, { useCallback } from 'react';
import { AvailabilityDoc } from '../types/deal';
import { useNavigation as useNav } from '@react-navigation/native';
import { Venue, VenueRating } from '../types/venue';
import { Rating } from '../types/booking';

type Routes =
  | {
      route: 'Venue';
      params: {
        venue: AvailabilityDoc['venue'];
        deals?: AvailabilityDoc['deal'][];
      };
    }
  | {
      route: 'Deal';
      params: {
        deal: AvailabilityDoc['deal'];
        venue: AvailabilityDoc['venue'];
      };
    }
  | {
      route: 'VenueDeals';
      params: {
        venue: Venue;
        deals: AvailabilityDoc['deal'][];
      };
    }
  | {
      route: 'VenueRatings';
      params: {
        venue: Venue;
        ratings: VenueRating[];
      };
    }
  | {
      route: 'Subscription';
      params: {};
    };

function useNavigation() {
  const navigation = useNav();

  const navigate = useCallback((props: Routes) => {
    return (navigation as any).navigate(props.route, props.params);
  }, []);

  return { ...navigation, navigate };
}

export default useNavigation;
