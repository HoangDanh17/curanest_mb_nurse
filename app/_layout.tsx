import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import "@/styles/global.css";
import { Provider } from "@/app/provider";
import { StatusBar, Platform, AppState } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/components/ToastConfig";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("curanest_channel", {
      name: "CuraNest Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4A90E2",
    });
  }

  if (!Device.isDevice) {
    console.error("Must use physical device for push notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error("Permission not granted for push notifications");
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    console.error("Project ID not found");
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    await AsyncStorage.setItem("expoPushToken", pushTokenString);
    return pushTokenString;
  } catch (e) {
    console.error("Error getting push token:", e);
    return;
  }
}

type AppScreen = "/(tabs)/schedule" | "/(auth)/login";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "BeVietnamPro-Black": require("../assets/fonts/BeVietnamPro-Black.ttf"),
    "BeVietnamPro-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "BeVietnamPro-ExtraBold": require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    "BeVietnamPro-ExtraLight": require("../assets/fonts/BeVietnamPro-ExtraLight.ttf"),
    "BeVietnamPro-Light": require("../assets/fonts/BeVietnamPro-Light.ttf"),
    "BeVietnamPro-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "BeVietnamPro-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "BeVietnamPro-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
    "BeVietnamPro-Thin": require("../assets/fonts/BeVietnamPro-Thin.ttf"),
  });

  const [isMounted, setIsMounted] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setIsMounted(true);
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!isMounted) {
        return;
      }
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          router.navigate("/(tabs)/home");
        } else {
          router.navigate("/(auth)/login");
        }
      } catch (error) {
        router.navigate("/(auth)/login");
      }
    };

    const handleNotificationNavigation = async (screen: AppScreen) => {
      if (!isMounted) {
        return;
      }
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        router.navigate(accessToken ? screen : "/(auth)/login");
      } catch (error) {
        router.navigate("/(auth)/login");
      }
    };

    const initializeApp = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const screen = response.notification.request.content.data.screen as
          | AppScreen
          | undefined;
        if (screen) {
          await handleNotificationNavigation(screen);
          return;
        }
      }

      await checkAuthStatus();
    };

    initializeApp();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const screen = response.notification.request.content.data.screen as
            | AppScreen
            | undefined;
          if (screen) {
            await handleNotificationNavigation(screen);
          }
        }
      );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      subscription.remove();
    };
  }, [isMounted]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider>
      <Stack
        screenOptions={{
          animation: "fade",
          presentation: "modal",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen
          name="detail-appointment/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="report-appointment/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="map"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Toast config={toastConfig}/>
    </Provider>
  );
}