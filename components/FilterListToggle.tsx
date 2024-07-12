import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Filter, List, Map } from 'lucide-react-native'; // Importing the Icon component from lucide-react-native
import { Text, View } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTranslation from '../hooks/useTranslation';

const FilterListToggle: React.FC<{
  view: 'map' | 'list';
  onSwitch: () => void;
  onOpenFilter: () => void;
  filtersLength?: number;
}> = ({ view, onSwitch, onOpenFilter, filtersLength = 0 }) => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.outerContainer, { bottom: bottom + 90 }]}>
      <View style={[styles.container]}>
        <TouchableOpacity onPress={onSwitch} style={styles.button}>
          {view === 'list' ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Map size="20px" color="#ffffff" strokeWidth={1.7} />
              <Text color="#ffffff" fontWeight="bold">
                {t('Show Map')}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <List size="20px" color="#ffffff" strokeWidth={1.7} />
              <Text color="#ffffff" fontWeight="bold">
                {t('Show List')}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View
          style={{
            height: '100%',
            width: 1,
            backgroundColor: 'rgba(62, 62, 62, 0.7)',
          }}
        />
        <TouchableOpacity onPress={onOpenFilter} style={styles.button}>
          {!!filtersLength && (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'rgba(96, 29, 72, 1)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 4,
                top: 4,
                zIndex: 1,
              }}
            >
              <Text color="#fff" fontSize="$1">
                {filtersLength}
              </Text>
            </View>
          )}
          <Filter size="20px" color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderRadius: 10,
    height: 36,
    flexDirection: 'row',
  },
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2010,
    position: 'absolute',
    bottom: 90,
    right: 0,
    left: 0,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    flexDirection: 'row',
    gap: 10,
  },
});

export default FilterListToggle;
