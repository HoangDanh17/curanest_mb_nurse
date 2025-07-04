import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MenuItem from "@/components/MenuItem";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ava from "@/assets/images/welcome.png";
import { useProvider } from "@/app/provider";

const ProfileScreen: React.FC = () => {
  const { userData } = useProvider();

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Đăng xuất thất bại", error);
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView className="bg-white">
      <View className="p-4 flex-1 mt-4">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-teal-400">
              {userData["full-name"]}
            </Text>
            <Text className="text-gray-400 font-psemibold">
              {userData["phone-number"]}
            </Text>
          </View>
          <Image source={Ava} className="w-20 h-20 rounded-full" />
        </View>

        <View className="mt-6 gap-6">
          <MenuItem
            iconName="person"
            title="Hồ sơ"
            handlePress={() => router.push("/(profile)/nurse-profile")}
          />
          <MenuItem
            iconName="event"
            title="Lịch sử lịch hẹn"
            handlePress={() => router.push("/(profile)/appointment-history")}
          />
          <MenuItem
            iconName="star"
            title="Đánh giá người dùng"
            handlePress={() => router.push("/(profile)/feedback")}
          />
        </View>
        <View className="mt-12 p-4 border border-gray-300 rounded-2xl">
          <TouchableOpacity
            className="flex flex-row items-center justify-between w-full p-3"
            onPress={handleLogout}
          >
            <View className="flex flex-row items-center gap-2">
              <Entypo
                name="log-out"
                size={24}
                color="red"
                className="bg-red-100 rounded-full p-2"
              />
              <Text className="ml-2 font-pbold text-red-600">Đăng xuất</Text>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
