import { Translation } from './index';

/**
 * /venues/:venueId
 * - /venues/:venueId/openingHours/:openingHourId
 * - /venues/:venueId/faqs/:faqId
 * - /venues/:venueId/user/:userId
 * - /venues/:venueId/media/:mediaId
 * - /minifiedVenues/:language_city_venueId
 */

export type VenueOpeningHour = {
  id: string;

  active: boolean;

  from: number;
  service?: number;
  close: number;

  closed?: boolean;

  title?: string;
  body?: string;
  timeString?: string;

  translations: Translation<{
    title?: string;
    body?: string;
    timeString?: string;
  }>;
} & (
  | {
      type: 'general';
      wDays: number[];
    }
  | {
      id: string;
      type: 'special';
      dates: string[];
    }
);

export interface Venue {
  id: string;

  verified?: boolean;

  active: boolean;

  title: string;
  shortDescription: string;

  body: string;

  translations: Translation<{
    title?: string;
    shortDescription?: string;
    body?: string;
  }>;

  galery: (string | Record<string, string>)[];

  tags: string[];

  city: string;
  address: string;
  language: string; // ‘de’;

  latitude: number;
  longitude: number;

  hash: string;
  placeId: string;

  country: string; // ‘DE’;
  timezone: string; // 'Europe/Berlin';
  currency: string; // 'EUR';

  gastronautId?: string;

  dates: {
    [date: string]: boolean;
  };

  ratings: {
    sum: number;
    count: number;
  };

  media: {
    thumb: string | Record<string, string>; // id
    small: string | Record<string, string>; // id
    banner: string | Record<string, string>; // id
  };

  contact: {
    phone: string;
    email: string;
    website: string;
  };

  socials: {
    google: string;
    facebook: string;
    instagram: string;
    tripadvisor: string;
    yelp: string;
  };

  openingHours: VenueOpeningHour[];
  generalRelevance: number;
}

export interface VenueUser {
  id: string;
  venueId: string;
  admin?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;

  translations: Translation<{
    question: string;
    answer: string;
  }>;

  media: null | string | Record<string, string>;
}

export interface Media {
  id: string;
  type: string;
  format: string;
  alt: string;

  language: string;

  versions: {
    [id: string]: string;
  };
}

export interface MinifiedVenue {
  vId: string; // language_city_id

  tl: string; // title
  sD: string; // shortDescription
  t: string[]; // tags

  lat: number; // latitude
  lng: number; // longitude

  gR: number; // generalRelevance

  mth: string | null; // media thumb
  msm: string | null; // media small
  mbn: string | null; // media banner

  d?: {
    [date: string]: boolean; // next 7 days
  };

  rsm: number; // ratings sum
  rcn: number; // ratings count
}

export interface VenueRating {
  id: string;
  name: string;
  dealId?: string;
  userId?: string;
  rating: number;
  comment: string;
  visitedAt: string;
  confirmedVisit: boolean;
}
