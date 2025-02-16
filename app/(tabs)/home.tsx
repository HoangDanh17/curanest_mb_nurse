import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Logo from "@/assets/images/logo-app.png";
import WelcomeImage from "@/assets/images/homepage.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const todayAppointments = [
  {
    id: "1",
    name: "Nguyen Van A",
    time: "8:00-9:00",
    address: "123 To Hien Thanh, ...",
    service: "Vệ sinh",
  },
  {
    id: "2",
    name: "Nguyen Van B",
    time: "10:00-11:00",
    address: "456 Le Loi, ...",
    service: "Khám bệnh",
  },
  {
    id: "3",
    name: "Nguyen Van C",
    time: "10:00-11:00",
    address: "456 Le Loi, ...",
    service: "Khám bệnh",
  },
];

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  const renderAppointmentItem = ({ item }: any) => (
    <Pressable
      onPress={() => router.push(`/detail-appointment/${123}`)}
      className="bg-white p-4 mx-4 my-2 rounded-lg shadow-lg border border-gray-400"
    >
      <View className="flex flex-row justify-start items-center border-b-2 border-gray-200">
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAdmCtWjfGHEabmDXtRwRDMQ1RLh2v1gxGKA&s",
          }}
          className="w-12 h-12 mr-4 bg-white rounded-xl"
        />
        <View className="flex flex-col justify-end mb-2">
          <Text className="text-lg font-pbold">{item.name}</Text>
          <Text className="text-md font-psemibold text-gray-500">
            {item.time}
          </Text>
        </View>
      </View>
      <Text
        className="text-md font-pmedium text-gray-600 mt-2"
        numberOfLines={1}
      >
        Địa chỉ: {item.address}
      </Text>
      <View className="flex flex-row justify-between items-center mt-2">
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-md font-pmedium text-blue-800">
            {item.service}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-col items-start ml-4">
            <Text className="text-md font-psemibold text-gray-400">
              Chào mừng trở lại
            </Text>
            <Text className="text-lg font-pbold">0789456</Text>
          </View>
          <View>
            <Image
              source={Logo}
              style={{
                width: width * 0.3,
                height: height * 0.14,
                resizeMode: "contain",
              }}
            />
          </View>
        </View>

        <View style={{ margin: width * 0.05 }}>
          <Image
            source={WelcomeImage}
            style={{
              width: "100%",
              height: height * 0.25,
              borderTopLeftRadius: 30,
              borderBottomRightRadius: 30,
              marginTop: -25,
            }}
            className="shadow-xl"
            resizeMode="contain"
          />
        </View>
        <View className="flex flex-row items-center justify-between mx-4 mt-4">
          <Text className="text-2xl font-pbold mb-2">Lịch hẹn hôm nay</Text>
        </View>

        <FlatList
          data={todayAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={() => (
            <Text className="text-center text-3xl text-gray-200 font-pbold">
              ⦿
            </Text>
          )}
        />

        <View className="mb-16"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
