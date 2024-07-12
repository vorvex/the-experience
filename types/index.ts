export * from './users';

export type Translation<T extends {}> = {
  [lang: string]: T;
};

export type Amount = {
  value: string; // 0.00
  currency: string; // defaults to 'EUR'
};

export type City = {
  id: string;

  show: boolean;

  name: string;
  country: string;

  timezone: string;

  media: {
    card: string | Record<string, string> | null;
    cover: string | Record<string, string> | null;
  };

  venues: number;

  translations: Translation<{
    name?: string;
  }>;
};
