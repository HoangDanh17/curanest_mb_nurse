import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Polyline, Marker, UrlTile } from "react-native-maps";
import GoongServices from "@goongmaps/goong-sdk";
import DirectionsService from "@goongmaps/goong-sdk/services/directions";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Goong = process.env.GOONG_MAPTILES_KEY;
const GOONG_MAPTILES_URL = `https://api.goong.io/tile/{z}/{x}/{y}.png?api_key=${Goong}`;

const goongServices = GoongServices({
  accessToken: "h6ciGm6oTBTktgLs6XTYcJXlt0e7ZPC6x3T3NZwV",
});
const directionsService = DirectionsService(goongServices);

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface CoordinatesState {
  pointA: Coordinate | null;
  pointB: Coordinate | null;
  route: Coordinate[];
}

const MapScreen: React.FC = () => {
  const { locationGPS } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = React.useRef<MapView>(null);

  let pointB: Coordinate | null = null;
  if (typeof locationGPS === "string") {
    const [latitude, longitude] = locationGPS
      .split(",")
      .map((val) => Number(val));
    if (!isNaN(latitude) && !isNaN(longitude)) {
      pointB = { latitude, longitude };
    } else {
      console.error("Invalid locationGPS format:", locationGPS);
    }
  }

  const [coordinates, setCoordinates] = useState<CoordinatesState>({
    pointA: null,
    pointB: pointB || {
      latitude: 10.75500449695062,
      longitude: 106.63459685122865,
    },
    route: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [lastRouteFetch, setLastRouteFetch] = useState<number>(0);

  // Haversine formula to calculate straight-line distance (in kilometers)
  const calculateDistance = (
    coord1: Coordinate,
    coord2: Coordinate
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const getRoute = async (
    origin: Coordinate,
    destination: Coordinate
  ): Promise<{ route: Coordinate[]; distance: number | null }> => {
    try {
      console.log("Fetching route from", origin, "to", destination);
      const response = await directionsService
        .getDirections({
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          vehicle: "car",
        })
        .send();

      const polylinePoints = response.body.routes[0]?.overview_polyline?.points;
      const routeDistance = response.body.routes[0]?.distance; // Distance in meters
      if (!polylinePoints) {
        throw new Error("No route found in API response");
      }

      const decodedCoordinates = polyline.decode(polylinePoints);
      const formattedRoute = decodedCoordinates.map(
        (coord: [number, number]) => ({
          latitude: coord[0],
          longitude: coord[1],
        })
      );

      return {
        route: formattedRoute,
        distance: routeDistance ? routeDistance / 1000 : null,
      };
    } catch (error: any) {
      console.error("Route fetch error:", error.message);
      setError(`Failed to fetch route: ${error.message}`);
      return { route: [], distance: null };
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoordinates((prev) => ({ ...prev, pointA: currentLocation }));

      if (currentLocation && coordinates.pointB) {
        const { route, distance } = await getRoute(
          currentLocation,
          coordinates.pointB
        );
        setCoordinates((prev) => ({ ...prev, pointA: currentLocation, route }));
        setDistance(
          distance || calculateDistance(currentLocation, coordinates.pointB)
        );
      } else {
        setError("Destination coordinates are missing");
      }
    } catch (error: any) {
      console.error("Initial fetch error:", error.message);
      setError("Failed to fetch location or route");
    } finally {
      setLoading(false);
    }
  };

  // Watch user's location in real-time with throttling
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          setLoading(false);
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 50, // Update every 50 meters
            timeInterval: 5000, // Update every 5 seconds
          },
          (location) => {
            const currentLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCoordinates((prev) => ({ ...prev, pointA: currentLocation }));

            if (coordinates.pointB) {
              // Update distance
              const newDistance = calculateDistance(
                currentLocation,
                coordinates.pointB
              );
              setDistance(newDistance);

              // Throttle route refetching (every 10 seconds)
              const now = Date.now();
              if (now - lastRouteFetch > 10000) {
                setLastRouteFetch(now);
                getRoute(currentLocation, coordinates.pointB).then(
                  ({ route, distance }) => {
                    setCoordinates((prev) => ({ ...prev, route }));
                    setDistance(distance || newDistance);
                  }
                );
              }

              // Center map on user's location
              mapRef.current?.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01, // Closer zoom
                longitudeDelta: 0.01, // Closer zoom
              });
            }
          }
        );
      } catch (error: any) {
        console.error("Watch location error:", error.message);
        setError("Failed to watch location");
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [coordinates.pointB, lastRouteFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Đang tải bản đồ...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : coordinates.pointA && coordinates.pointB ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: coordinates.pointA.latitude,
              longitude: coordinates.pointA.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
          >
            <UrlTile urlTemplate={GOONG_MAPTILES_URL} zIndex={1} />
            <Marker
              coordinate={coordinates.pointA}
              title="Vị trí hiện tại"
              description="Your location"
            />
            <Marker
              coordinate={coordinates.pointB}
              title="Điểm B"
              description="Destination"
            />
            {coordinates.route.length > 0 && (
              <Polyline
                coordinates={coordinates.route}
                strokeColor="#004cff"
                strokeWidth={4}
              />
            )}
          </MapView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Quay lại màn hình trước"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              Khoảng cách còn lại:{" "}
              {distance ? distance.toFixed(2) : "Đang tính"} km
            </Text>
          </View>
        </>
      ) : (
        <Text>Không thể tải bản đồ</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  distanceContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
  distanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
