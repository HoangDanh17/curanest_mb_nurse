import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/styles/global.css";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
