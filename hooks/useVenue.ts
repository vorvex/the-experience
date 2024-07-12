import React, { useMemo } from 'react';
import { AvailabilityDoc, Deal, LocalizedDeal } from '../types/deal';
import useDocument from './useDocument';
import { useDeviceLanguage } from 'firebase/auth';
import useTranslation from './useTranslation';
import { MinifiedVenue, Venue, VenueRating } from '../types/venue';
import useCollection from './useCollection';
import { blockToTime, getNextXDays, getTranslation } from '../config/helper';
import { Rating } from '../types/booking';

function useVenue<
  T extends Partial<AvailabilityDoc['venue']> & { id: string; city: string }
>(minimizedVenue: T, minimizedDeals: AvailabilityDoc['deal'][] = []) {
  const { language, t } = useTranslation();

  const [{ data, loading }] = useDocument<Venue>(
    'venues',
    `${language}_${minimizedVenue.city}_${minimizedVenue.id}`
  );

  const [{ data: availability }] = useCollection<AvailabilityDoc>(
    'availability',
    {
      filter: [
        ['venue.id', '==', minimizedVenue.id],
        ['language', '==', language],
      ],
    }
  );

  let venue: Venue = data ?? {
    id: minimizedVenue.id,
    active: true,
    address: 'Alte Glockengießerei 9, 69115 Heidelberg',
    body: '',
    city: minimizedVenue.city,
    language,
    latitude: minimizedVenue.latitude || 0,
    longitude: minimizedVenue.longitude || 0,
    media: minimizedVenue.media ?? {
      banner: '',
      small: '',
      thumb: '',
    },
    contact: {
      email: '',
      phone: '+49 6221 7333 003',
      website: 'schillingroofbar.com',
    },
    galery: minimizedVenue.media?.banner
      ? [
          minimizedVenue.media?.banner,
          minimizedVenue.media?.banner,
          minimizedVenue.media?.banner,
        ]
      : [],
    country: 'DE',
    currency: 'EUR',
    hash: '',
    placeId: '',
    ratings: {
      count: 1000,
      sum: 4900,
    },
    shortDescription: '',
    tags: [],
    timezone: 'Europe/Berlin',
    title: minimizedVenue.title || '',
    translations: {},
    verified: false,
    dates: {},
    generalRelevance: 0,
    openingHours: [],
    socials: {
      facebook: '',
      instagram: 'schillingroofbar',
      google: '',
      tripadvisor: '',
      yelp: '',
    },
    gastronautId: 'schillingroofbar',
  };

  const deals = availability?.length
    ? availability.map(({ deal }) => deal)
    : minimizedDeals;

  let texts = {
    title: getTranslation(
      language,
      data?.translations ?? {},
      'title',
      venue.title
    ),
    shortDescription: getTranslation(
      language,
      data?.translations ?? {},
      'shortDescription',
      venue.shortDescription
    ),
    body: getTranslation(
      language,
      data?.translations ?? {},
      'body',
      venue.body
    ),
  };

  const reviews: VenueRating[] = [
    {
      id: '1',
      rating: 5,
      comment: 'Great place',
      name: 'John Doe',
      visitedAt: new Date().toISOString(),
      confirmedVisit: true,
    },
  ];

  const avgRating = venue.ratings.sum / (venue.ratings.count || 1);

  const next7Days = useMemo(
    () =>
      getNextXDays(7).map((date) => {
        const open = !!data?.dates[date];

        if (!open) return { date, hours: 'Closed' };

        let specialHour = data?.openingHours?.find(
          (x) => x.active && x.type === 'special' && x.dates.includes(date)
        );

        let hours: string[] = [];

        if (specialHour) {
          if (specialHour.closed) {
            return {
              date,
              hours:
                getTranslation(
                  language,
                  specialHour?.translations ?? {},
                  'title',
                  specialHour?.title ?? ''
                ) || t('Closed'),
            };
          } else {
            hours.push(
              getTranslation(
                language,
                specialHour?.translations ?? {},
                'timeString',
                specialHour?.timeString ??
                  `${blockToTime(specialHour.from)} - ${blockToTime(
                    specialHour.close
                  )}`
              )
            );
          }
        } else {
          let generalHour = data?.openingHours?.find(
            (x) =>
              x.active &&
              x.type === 'general' &&
              x.wDays.includes(new Date(date).getDay())
          );

          if (generalHour) {
            if (generalHour.closed) {
              return {
                date,
                hours: getTranslation(
                  language,
                  generalHour?.translations ?? {},
                  'timeString',
                  generalHour?.timeString ?? t('Closed')
                ),
              };
            } else {
              hours.push(
                getTranslation(
                  language,
                  generalHour?.translations ?? {},
                  'timeString',
                  generalHour?.timeString ??
                    `${blockToTime(generalHour?.from)} - ${blockToTime(
                      generalHour?.close
                    )}`
                )
              );
            }
          } else {
            return {
              date,
              hours: t('Closed'),
            };
          }
        }

        return {
          date,
          hours: hours.join(', '),
        };
      }),
    [data, language]
  );

  const today = new Date().toISOString().split('T')[0];

  return {
    venue,
    texts,
    deals,
    language,
    loading,
    reviews,
    avgRating,
    next7Days,
    today,
  };
}

export default useVenue;
