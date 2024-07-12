import React, { useState } from 'react';
import { Filters } from '../providers/MapContext';
import { Button, ScrollView, View } from 'tamagui';
import { Trash } from 'lucide-react-native';
import PillSelect from './PillSelect';
import useTranslation from '../hooks/useTranslation';
import { getNextXDays, getWeekdayString } from '../config/helper';

type FilterProps = {
  state: Filters;
  onChange: (state: Filters) => void;
};

const Filter: React.FC<FilterProps> = (props) => {
  const [localState, setLocalState] = useState<Filters>(props.state);

  const [today, tomorrow, ...next5Days] = getNextXDays(7);

  const deleteState = () => {
    setLocalState({});
    props.onChange({});
  };

  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <PillSelect
          label={t('Date')}
          options={[
            {
              id: '',
              name: t('General'),
            },
            {
              id: today,
              name: t('Today'),
            },
            {
              id: tomorrow,
              name: t('Tomorrow'),
            },
            ...next5Days.map((id) => ({
              id,
              name: t(getWeekdayString(id)),
            })),
          ]}
          onChange={(date) => setLocalState({ ...localState, date })}
          value={localState.date ?? ''}
        />
        <PillSelect
          label={t('Time')}
          options={[
            {
              id: '',
              name: t('All Day'),
            },
            {
              id: 'morning',
              name: t('Morning'),
            },
            {
              id: 'midday',
              name: t('Midday'),
            },
            {
              id: 'afternoon',
              name: t('Afternoon'),
            },
            {
              id: 'dinner',
              name: t('Dinner'),
            },
            {
              id: 'latenight',
              name: t('Late Night'),
            },
          ]}
          onChange={(time) => setLocalState({ ...localState, time })}
          value={localState.time ?? ''}
        />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          flexDirection: 'row',
          gap: 10,
          padding: 10,
        }}
      >
        <Button
          style={{ flex: 1 }}
          disabled={JSON.stringify(localState) === JSON.stringify(props.state)}
          onPress={() => props.onChange(localState)}
          color="#fff"
          backgroundColor="$pink10"
        >
          {t('Apply')}
        </Button>
        <Button
          backgroundColor="$pink10"
          onPress={deleteState}
          icon={<Trash color="#fff" size="24px" />}
        ></Button>
      </View>
    </View>
  );
};

export default Filter;
