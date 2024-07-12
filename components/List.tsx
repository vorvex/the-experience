import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, View } from 'tamagui';
import { MapContext } from '../providers';
import VenueWithDeals from './VenueWithDeals';

type ListProps = {};

const List: React.FC<ListProps> = (props) => {
  const { venues } = useContext(MapContext);

  return (
    <ScrollView style={styles.container}>
      {venues.map((venue) => (
        <VenueWithDeals key={venue.id} venue={venue} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    gap: 10,
    marginTop: 110,
    paddingVertical: 20,
  },
  venueCard: {
    padding: 20,
    margin: 10,
  },
});

export default List;
