import React, { useContext } from 'react';
import { useTranslation as useI18n } from 'react-i18next';
import '../translation';
import { AuthenticatedUserContext } from '../providers';
import i18n from '../translation';

const useTranslation = () => {
  const { t } = useI18n();
  const { user, language } = useContext(AuthenticatedUserContext);

  return { t, language };
};

export default useTranslation;
