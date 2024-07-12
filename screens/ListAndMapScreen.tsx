import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { H4, Text, View } from 'tamagui';
import { Locate, Search, X } from 'lucide-react-native';
import IconButton from '../components/IconButton';
import Map from '../components/Map';
import { StatusBar } from 'expo-status-bar';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import FullScreenModal from '../components/FullScreenModal';
import FilterListToggle from '../components/FilterListToggle';
import { BlurView } from 'expo-blur';
import { MapContext } from '../providers';
import PillSelect from '../components/PillSelect';
import { getNextXDays, getWeekdayString } from '../config/helper';
import useTranslation from '../hooks/useTranslation';
import Carousel from '../components/Carousel';
import Filter from '../components/Filter';
import List from '../components/List';

/**
 * [x] Select City
 * [x] Show Markers in City
 * [x] Show this Area instead button
 */

// Mapbox.StyleURL = Mapbox.StyleURL.Street;
export const ListAndMapScreen: React.FC<{}> = ({}) => {
  const ctx = useContext(MapContext);

  const x = useSafeAreaInsets();

  const { t } = useTranslation();

  return (
    <BlurView intensity={50} style={styles.container}>
      {ctx.state.overlay === 'search' && (
        <FullScreenModal
          title={t('Search')}
          open
          onClose={() => ctx.setState((st) => ({ ...st, overlay: null }))}
          subHeader={
            <View style={styles.searchSubHeader}>
              <Search size="24px" color="#ffffff" />
              <TextInput
                placeholder={t('Search')}
                style={{ flex: 1, color: '#fff', fontSize: 16 }}
                value={ctx.state.search}
                onChangeText={(search) =>
                  ctx.setState((st) => ({ ...st, search }))
                }
                autoFocus
              />
            </View>
          }
        >
          <></>
        </FullScreenModal>
      )}
      {ctx.state.overlay === 'cities' && (
        <FullScreenModal
          title={t('Cities')}
          open
          onClose={() => ctx.setState((st) => ({ ...st, overlay: null }))}
        >
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
            onPress={() => ctx.getCurrentLocation({ overlay: null })}
          >
            <Locate
              size="20px"
              strokeWidth={ctx.state.city === '__current__' ? 3 : undefined}
              color="#ffffff"
            />
            <H4
              color="#ffffff"
              fontWeight={ctx.state.city === '__current__' ? 'bold' : 'normal'}
            >
              {t('Current Location')}
            </H4>
          </TouchableOpacity>
          {ctx.cities.map((c) => (
            <TouchableOpacity
              style={{ padding: 10 }}
              key={c.id}
              onPress={() =>
                ctx.changeRegion(
                  {
                    latitude: c.region.latitude,
                    longitude: c.region.longitude,
                    latitudeDelta:
                      c.region?.latitudeDelta ||
                      ctx.state?.region?.latitudeDelta ||
                      0.0922,
                    longitudeDelta:
                      c.region?.longitudeDelta ||
                      ctx.state?.region?.longitudeDelta ||
                      0.0421,
                  },
                  {
                    city: c.id,
                    overlay: null,
                  }
                )
              }
            >
              <H4
                color="#ffffff"
                fontWeight={ctx.state.city === c.id ? 'bold' : 'normal'}
              >
                {c.name}
              </H4>
            </TouchableOpacity>
          ))}
        </FullScreenModal>
      )}
      {ctx.state.filterOpen && (
        <FullScreenModal
          title={t('Filter')}
          noScrollView
          open
          onClose={() => ctx.setState((st) => ({ ...st, filterOpen: false }))}
        >
          <Filter
            state={ctx.state.filters ?? {}}
            onChange={(filters) =>
              ctx.setState((st) => ({ ...st, filters, filterOpen: false }))
            }
          />
        </FullScreenModal>
      )}
      <View style={styles.header}>
        <StatusBar />
        <View style={{ backgroundColor: '#000', height: x.top - 10 }} />
        <View style={styles.headerInner}>
          <H4
            color="#ffffff"
            fontWeight="bold"
            onPress={() => ctx.setState((st) => ({ ...st, overlay: 'cities' }))}
          >
            {ctx.state.city === '__current__'
              ? t('Current Location')
              : ctx.cities.find((x) => x.id === ctx.state.city)?.name || ''}
          </H4>
          <IconButton
            icon={<Search size="24px" color="#ffffff" />}
            onPress={() => ctx.setState((st) => ({ ...st, overlay: 'search' }))}
          />
        </View>
        <LinearGradient colors={['#000', 'transparent']} style={styles.fade} />
      </View>
      {ctx.state.view === 'list' && <List />}
      {ctx.state.view === 'map' && (
        <>
          {!ctx.isInCurrentArea && (
            <View
              style={{
                position: 'absolute',
                top: x.top + 70,
                left: 0,
                right: 0,
                zIndex: 1020,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableHighlight
                onPress={() => ctx.getCurrentArea()}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 13,
                  flexDirection: 'row',
                  gap: 10,
                  backgroundColor: 'rgba(20, 20, 20, 0.7)',
                  borderRadius: 10,
                }}
              >
                <Text color="#fff">{t('Search this Area')}</Text>
              </TouchableHighlight>
            </View>
          )}
          <Map />

          {!!ctx.state.currentDeal && <Carousel />}
          {!!ctx.state.currentDeal && (
            <IconButton
              onPress={() =>
                ctx.setState((st) => ({ ...st, currentDeal: null }))
              }
              style={{
                zIndex: 2020,
                position: 'absolute',
                bottom: 120,
                left: 20,
              }}
              icon={<X size="24px" color="#ffffff" />}
            />
          )}
          <IconButton
            onPress={() => {
              console.log(ctx.state.region);
              // ctx.getCurrentLocation({ overlay: null });
            }}
            style={{
              zIndex: 2020,
              position: 'absolute',
              bottom: 120,
              right: 20,
            }}
            icon={<Locate size="24px" color="#ffffff" />}
          />
        </>
      )}

      {/* <View
        style={{
          position: 'absolute',
          top: x.top + 70,
          left: 0,
          right: 0,
          zIndex: 200,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></View> */}
      <FilterListToggle
        view={ctx.state.view}
        onSwitch={() =>
          ctx.setState((st) => ({
            ...st,
            view: st.view === 'list' ? 'map' : 'list',
          }))
        }
        onOpenFilter={() => ctx.setState((st) => ({ ...st, filterOpen: true }))}
        filtersLength={
          Object.values(ctx.state.filters ?? {}).filter((x) =>
            Array.isArray(x) ? x.length : x
          ).length
        }
      />
      <LinearGradient
        colors={['transparent', '#000']}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 98,
          right: 0,
          height:
            !!ctx.state.currentDeal && ctx.state.view === 'map' ? 240 : 60,
          zIndex: 1,
        }}
      />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    // height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    padding: 10,
  },
  fade: {
    height: 30,
  },
  searchSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    padding: 10,
  },
});
