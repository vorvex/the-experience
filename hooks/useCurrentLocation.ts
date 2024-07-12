import React, { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (renew = false) => {
    if (location && !renew) return location;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      console.error('Permission to access location was denied', status);
      return null;
    } else {
      try {
        setErrorMsg(null);
        let location = await Location.getCurrentPositionAsync({ accuracy: 1 });
        setLocation(location);
        return location;
      } catch (error: any) {
        console.error('Error getting location', error);
        setErrorMsg(error.message);

        return null;
      }
    }
  }, []);

  //   useEffect(() => {
  //     getCurrentLocation();
  //   }, [getCurrentLocation]);

  return {
    location,
    errorMsg,
    getCurrentLocation,
  };
};

export default useCurrentLocation;
