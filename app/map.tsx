import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, {
  Polyline,
  Marker,
  UrlTile,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import GoongServices from "@goongmaps/goong-sdk";
import DirectionsService from "@goongmaps/goong-sdk/services/directions";
import polyline from "@mapbox/polyline";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const GOONG_MAPTILES_KEY = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY;
const GOONG_DIRECTIONS_KEY = process.env.EXPO_PUBLIC_GOONG_API_KEY;

const GOONG_MAPTILES_URL = `https://api.goong.io/tile/{z}/{x}/{y}.png?api_key=${GOONG_MAPTILES_KEY}`;

const goongServices = GoongServices({
  accessToken: GOONG_DIRECTIONS_KEY,
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
    }
  }

  const [coordinates, setCoordinates] = useState<CoordinatesState>({
    pointA: null,
    pointB: pointB,
    route: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [distance, setDistance] = useState<number | null>(null);

  const getCurrentLocation = async (): Promise<Coordinate | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Quyền truy cập vị trí bị từ chối");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err: any) {
      console.error("Location error:", err.message);
      setError(`Không thể lấy vị trí: ${err.message}`);
      return null;
    }
  };

  const calculateDistance = (
    coord1: Coordinate,
    coord2: Coordinate
  ): number => {
    const R = 6371;
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getRoute = async (
    origin: Coordinate,
    destination: Coordinate
  ): Promise<{ route: Coordinate[]; distance: number | null }> => {
    try {
      if (
        !origin.latitude ||
        !origin.longitude ||
        !destination.latitude ||
        !destination.longitude
      ) {
        throw new Error("Invalid coordinates provided");
      }

      const response = await directionsService
        .getDirections({
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          vehicle: "car",
        })
        .send();

      const routes = response.body.routes;
      if (!routes || routes.length === 0) {
        throw new Error("No routes found in API response");
      }

      const polylinePoints = routes[0]?.overview_polyline?.points;
      const routeDistance = routes[0]?.legs?.[0]?.distance?.value;
      if (!polylinePoints) {
        throw new Error("No polyline points found in API response");
      }

      const decodedCoordinates = polyline.decode(polylinePoints);
      const formattedRoute = decodedCoordinates.map(
        ([lat, lng]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        })
      );

      return {
        route: formattedRoute,
        distance: routeDistance ? routeDistance / 1000 : null,
      };
    } catch (error: any) {
      console.error("Route fetch error:", error.message);
      setError(`Không thể lấy tuyến đường: ${error.message}`);
      return { route: [], distance: null };
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        throw new Error("Không thể lấy vị trí hiện tại");
      }

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
        setError("Thiếu tọa độ điểm đến");
      }
    } catch (error: any) {
      console.error("Initial fetch error:", error.message);
      setError("Không thể lấy vị trí hoặc tuyến đường");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  const startNavigation = () => {
    if (coordinates.pointA && coordinates.pointB) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${coordinates.pointA.latitude},${coordinates.pointA.longitude}&destination=${coordinates.pointB.latitude},${coordinates.pointB.longitude}&travelmode=driving&dir_action=navigate`;
      Linking.openURL(url).catch((err) =>
        console.error("Không thể mở Google Maps:", err)
      );
    } else {
      setError("Vui lòng đảm bảo vị trí hiện tại và điểm đến đã được xác định");
    }
  };

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
            provider={PROVIDER_GOOGLE}
          >
            <UrlTile urlTemplate={GOONG_MAPTILES_URL} zIndex={1} />
            <Marker
              coordinate={coordinates.pointA}
              title="Vị trí hiện tại"
              description="Vị trí của bạn"
            />
            <Marker
              coordinate={coordinates.pointB}
              title="Điểm đến"
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
          <TouchableOpacity
            style={styles.startButton}
            onPress={startNavigation}
            accessibilityLabel="Bắt đầu điều hướng"
          >
            <Text style={styles.startButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
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
  startButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MapScreen;