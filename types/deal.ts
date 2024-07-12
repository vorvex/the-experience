import { Translation } from './index';

/**
 * /deals/:dealId
 * /deals/:dealId/availability/:availabilityId
 * /deals/:dealId/faqs/:faqId
 * /availabilityDocs/:city_date_dealId
 */

export interface Deal {
  id: string;
  venue: {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    city: string;
    lat: number;
    lng: number;
    timezone: string;
    hash: string;
    media: {
      thumb: string;
      small: string;
      banner: string;
    };
  };

  active: boolean;

  deleted?: boolean;

  minInAdvance: number; // in minutes

  keepTrackOfGuests: boolean;
  minGroupSize?: number;
  maxGroupSize?: number;

  title: string;
  body: string;
  instructions: string;

  tags: string[];

  availability: DealAvailability[];

  statusAfterBooking?: 'pending' | 'confirmed';

  canBeRedeemedByUser: boolean;

  reusable:
    | {
        type: 'everyXDays';
        days: number;
      }
    | { type: 'once' }
    | {
        type: 'always';
      };

  reservation?: null | unknown;

  media: {
    card: string | Record<string, string> | null;
    cover: string | Record<string, string> | null;
    videoLandscape?: string | Record<string, string> | null;
    videoPortrait?: string | Record<string, string> | null;
  };

  translations: Translation<{
    title?: string;
    body?: string;
    instructions?: string;
  }>;

  generalRelevance: number;

  availableWithoutSubscription: boolean;

  rating: {
    sum: number;
    count: number;
  };
}

export type LocalizedDeal = {
  id: string;

  language: string;

  venue: {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    city: string;
    lat: number;
    lng: number;
    thumb: string;
  };

  active: boolean;

  deleted?: boolean;

  title: string;
  body: string;

  tags: string[];

  availability: Omit<DealAvailability, 'translations'>[];

  reusable:
    | {
        type: 'everyXDays';
        days: number;
      }
    | { type: 'once' }
    | {
        type: 'always';
      };

  reservation?: null | unknown;

  media: {
    card: string | null;
    cover: string | null;
    videoLandscape?: string | null;
    videoPortrait?: string | null;
  };

  generalRelevance: number;

  availableWithoutSubscription: boolean;
};

export type DealAvailability = {
  id: string;
  active: boolean;

  from: number;
  service?: number;
  close: number;

  closed?: boolean;

  slotsAvailable?: number;
  slotsPer?: 'block' | 'shift';
  blockedAt?: number[];
  per?: 'guests' | 'groups';

  title?: string;
  body?: string;

  translations: Translation<{
    title?: string;
    body?: string;
  }>;
} & (
  | {
      type: 'general';
      wDays: number[];
    }
  | {
      type: 'special';
      dates: string[];
    }
);

export interface AvailabilityDoc {
  venue: {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    city: string;
    latitude: number;
    longitude: number;
    hash: string;
    media: {
      thumb: string;
      small: string;
      banner: string;
    };
  };
  deal: {
    id: string;
    title: string;
    generalRelevance: number;
    reusable: Deal['reusable'];
    media: {
      card: string;
    };
  };

  date: string;

  active: boolean;

  slots: {
    [time: string]: number;
    earlyMorning: number; // 00:00 - 04:00
    breakfast: number; // 04:00 - 11:00
    lunch: number; // 10:00 - 16:00
    afternoon: number; // 12:00 - 19:00
    dinner: number; // 17:00 - 23:00
    lateNight: number; // 21:00 - 24:00
  };

  availableWithoutSubscription: boolean;
}
