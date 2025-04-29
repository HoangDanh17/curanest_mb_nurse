import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 60,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          backgroundColor: "white",
          elevation: 0,
        },
        tabBarActiveTintColor: "#41f3ea",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarHideOnKeyboard: true,
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-month" color={color} size={size} />
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" color={color} size={size} />
          ),
          title: "",
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
