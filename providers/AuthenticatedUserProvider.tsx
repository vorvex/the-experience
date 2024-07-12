import { User as FirebaseUser, useDeviceLanguage } from 'firebase/auth';
import React, { useState, createContext, useEffect } from 'react';
import i18n from '../translation';
import useDocument from '../hooks/useDocument';
import { auth } from '../config';

export const LANGUAGES = [
  {
    id: 'de',
    label: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    id: 'en',
    label: 'English',
    flag: '🇬🇧',
  },
];

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;

  language: string;

  biography: string;

  avatar: string | null;

  defaultCity: string;

  knownIps: string[];
  userAgents: string[];

  points: number;

  subscriptionId?: string | null;
  hasSubscription: boolean;

  disabled?: boolean;

  isGastronautAdmin?: boolean;

  emailVerified: boolean;

  createdAt: string;
};

export interface AuthenticatedUserContextType {
  firebaseUser: FirebaseUser | null;
  setFirebaseUser: React.Dispatch<FirebaseUser | null>;
  user: User | null;
  setUser: React.Dispatch<User | null>;
  changeLanguage: (language: string) => void;
  language: string;
}

export const AuthenticatedUserContext =
  createContext<AuthenticatedUserContextType>({
    user: null,
    setUser: () => {},
    firebaseUser: null,
    setFirebaseUser: () => {},
    changeLanguage: () => {},
    language: i18n.language,
  });

export const AuthenticatedUserProvider = ({ children }: any) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useDeviceLanguage(auth);

  const [user, setUser] = useDocument<User>(
    'users',
    firebaseUser?.uid || '',
    true
  );

  const [language, setLanguage] = useState<string>(
    user?.data?.language ??
      LANGUAGES.find((l) => l.id === i18n.language)?.id ??
      i18n.language
  );

  useEffect(() => {
    if (!!user.data?.language && user.data?.language !== language) {
      setLanguage(user.data?.language);
    }
  }, [user.data]);

  const changeLanguage = async (lang: string) => {
    let LANG = LANGUAGES.find((l) => l.id === lang)?.id ?? language;
    setLanguage(LANG);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    if (user.data) {
      setUser((d) => (d ? { ...d, language } : null));
    }
  }, [language]);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user: user.data,
        setUser,
        firebaseUser,
        setFirebaseUser,
        changeLanguage,
        language,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
