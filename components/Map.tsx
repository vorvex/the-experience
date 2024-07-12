import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import MapView, {
  Camera,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import * as Geofire from 'geofire-common';
import { MapContext } from '../providers';
import { Image } from 'tamagui';

const pin = require('../assets/Pin.png');
const pinActive = require('../assets/PinActive.png');

/**
 * [ ] Select City
 * [ ] Show Markers in City
 * [ ] Show this Area instead button
 */

function initialState(props: {
  city?: string;
  hash?: string;
  country?: string;
  region?: Region;
}): {
  region?: Region;
  hash?: string;
  prevHash?: string;
} {
  let hash =
    props.hash ??
    (props.region
      ? Geofire.geohashForLocation(
          [props.region.latitude, props.region.longitude],
          6
        )
      : undefined);

  return {
    hash,
    region: props.region,
  };
}

// Mapbox.StyleURL = Mapbox.StyleURL.Street;
const Map: React.FC<{}> = ({}) => {
  const { state, setState, deals, flatListRef } = useContext(MapContext);

  return (
    <View style={styles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE}
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        // }}
        userInterfaceStyle="dark"
        style={styles.map}
        cameraZoomRange={{
          minCenterCoordinateDistance: 2000,
          maxCenterCoordinateDistance: 1000000,
          //   animated: true,
        }}
        // initialCamera={{
        //   center: {
        //     latitude: 49.39875,
        //     longitude: 8.672434,
        //   },
        //   zoom: 40000,
        //   heading: 0,
        //   pitch: 0,
        // }}
        region={state.region}
        onRegionChangeComplete={(region) =>
          setState((st) => ({
            ...st,
            region,
            prevHash: st.hash,
            hash: Geofire.geohashForLocation(
              [region.latitude, region.longitude],
              6
            ),
          }))
        }
      >
        {deals.map((deal, i) => (
          <Marker
            key={deal.deal.id}
            zIndex={state.currentDeal === deal.deal.id ? 100 : 1}
            coordinate={{
              latitude: deal.venue.latitude,
              longitude: deal.venue.longitude,
            }}
            // title={venue.name}
            onPress={() => {
              setState((st) => ({
                ...st,
                currentDeal: deal.deal.id,
                region: {
                  latitude:
                    deal.venue.latitude +
                    -(st?.region?.latitudeDelta || 0.0922) / 6,
                  longitude: deal.venue.longitude,
                  latitudeDelta: st?.region?.latitudeDelta || 0.0922,
                  longitudeDelta: st?.region?.longitudeDelta || 0.0922,
                },
              }));

              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: i,
                  animated: false,
                });
              }, 200);
            }}
            tappable
            opacity={
              !state.currentDeal || state.currentDeal === deal.deal.id ? 1 : 0.7
            }
            // image={state.currentDeal === deal.deal.id ? pinActive : pin}
          >
            <TouchableOpacity
              style={{ zIndex: state.currentDeal === deal.deal.id ? 100 : 1 }}
              onPress={() => {
                setState((st) => ({
                  ...st,
                  currentDeal: deal.deal.id,
                  region: {
                    latitude:
                      deal.venue.latitude +
                      -(st?.region?.latitudeDelta || 0.0922) / 6,
                    longitude: deal.venue.longitude,
                    latitudeDelta: st?.region?.latitudeDelta || 0.0922,
                    longitudeDelta: st?.region?.longitudeDelta || 0.0922,
                  },
                }));

                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: i,
                    animated: false,
                  });
                }, 200);
              }}
            >
              <Image
                source={state.currentDeal === deal.deal.id ? pinActive : pin}
                width={state.currentDeal === deal.deal.id ? 45 : 36}
                height={state.currentDeal === deal.deal.id ? 52 : 42}
              />
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;
