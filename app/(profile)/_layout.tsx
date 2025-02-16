import React from "react";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const commonHeaderOptions: NativeStackNavigationOptions = {
  headerTitleStyle: {
    fontWeight: "700",
    fontSize: 20,
  },
  headerLeft: () => (
    <TouchableOpacity className="mr-4 mt-1" onPress={() => router.back()}>
      <AntDesign name="leftcircleo" size={22} color="black" />
    </TouchableOpacity>
  ),
};

const screenConfigs: Record<string, NativeStackNavigationOptions> = {
  feedback: {
    ...commonHeaderOptions,
    headerTitle: "Đánh giá người dùng",
  },
  "appointment-history": {
    ...commonHeaderOptions,
    headerTitle: "Lịch sử cuộc hẹn",
  },
  "nurse-profile": {
    ...commonHeaderOptions,
    headerTitle: "Hồ sơ điều dưỡng",
  },
  payroll: {
    ...commonHeaderOptions,
    headerTitle: "Lương và thưởng",
  },
};

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        presentation: "modal",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="feedback" options={screenConfigs.feedback} />
      <Stack.Screen
        name="appointment-history"
        options={screenConfigs["appointment-history"]}
      />
      <Stack.Screen name="payroll" options={screenConfigs.payroll} />
      <Stack.Screen
        name="nurse-profile"
        options={screenConfigs["nurse-profile"]}
      />
    </Stack>
  );
};

export default ProfileLayout;
