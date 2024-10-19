import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { HostProfile } from '../types/hostTypes';

interface HostMapViewProps {
  hosts: HostProfile[];
  onHostSelect: (hostId: string) => void;
}

const HostMapView: React.FC<HostMapViewProps> = ({ hosts, onHostSelect }) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {hosts.map((host) => (
          <Marker
            key={host.id}
            coordinate={{
              latitude: host.latitude,
              longitude: host.longitude,
            }}
            title={host.name}
            description={host.cuisine}
            onPress={() => onHostSelect(host.id)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default HostMapView;