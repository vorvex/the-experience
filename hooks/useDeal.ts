import React from 'react';
import { AvailabilityDoc, Deal, LocalizedDeal } from '../types/deal';
import useDocument from './useDocument';
import { useDeviceLanguage } from 'firebase/auth';
import useTranslation from './useTranslation';

function useDeal<T extends Partial<AvailabilityDoc['deal']> & { id: string }>(
  minimizedDeal: T,
  venue: AvailabilityDoc['venue']
) {
  const { language, t } = useTranslation();

  const [{ data, loading }] = useDocument<LocalizedDeal>(
    'deals',
    `${language}_${venue.city}_${minimizedDeal.id}`
  );

  let deal: LocalizedDeal = data ?? {
    id: minimizedDeal.id,
    active: true,
    availability: [],
    availableWithoutSubscription: false,
    body: '',
    generalRelevance: 0,
    language,
    media: {
      card: minimizedDeal.media?.card ?? '',
      cover: minimizedDeal.media?.card ?? '',
      videoLandscape: '',
      videoPortrait: '',
    },
    reusable: { type: 'once' },
    tags: [],
    title: minimizedDeal.title ?? '',
    venue: {
      id: venue.id,
      city: venue.city,
      lat: venue.latitude,
      lng: venue.longitude,
      tags: venue.tags,
      title: venue.title,
      subtitle: venue.subtitle,
      thumb: venue.media.thumb,
    },
  };

  return {
    deal,
    loading,
    language,
    t,
  };
}

export default useDeal;
