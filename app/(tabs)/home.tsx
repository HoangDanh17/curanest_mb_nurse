import React, { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppointmentList } from "@/types/appointment";
import appointmentApiRequest from "@/app/api/appointmentApi";
import { UserData } from "@/app/(auth)/login";
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentList[]>([]);
  const [data, setData] = useState<UserData | undefined>();

  const fetchUserData = async () => {
    try {
      const dataUser = await AsyncStorage.getItem("userInfo");
      if (dataUser) {
        const parsedData: UserData = JSON.parse(dataUser);
        setData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return null;
  };

  const fetchAppointments = async (userId: string) => {
    setLoading(true);
    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(
      new Date(new Date().setDate(new Date().getDate() + 1)),
      "yyyy-MM-dd"
    );
    try {
      const response = await appointmentApiRequest.getListAppointment(
        userId,
        today,
        tomorrow
      );
      const confirmedAppointments = response.payload.data.filter(
        (item: AppointmentList) => item.status === "waiting"
      );
      setAppointments(confirmedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserData().then((userData) => {
        if (userData?.id) {
          fetchAppointments(String(userData.id));
        } else {
          setLoading(false);
        }
      });
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#64CBDB" />
      </View>
    );
  }

  const renderAppointmentItem = ({ item }: { item: AppointmentList }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/detail-appointment/[id]",
          params: {
            id: String(data?.id),
            packageId: item["cuspackage-id"],
            nurseId: String(data?.id),
            patientId: item["patient-id"],
            date: item["est-date"],
            status: item.status,
          },
        })
      }
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
          <Text className="text-lg font-pbold">{item.id}</Text>
          <Text className="text-md font-psemibold text-gray-500">
            {format(new Date(item["est-date"]), "dd/MM/yyyy")}
          </Text>
        </View>
      </View>
      <Text
        className="text-md font-pmedium text-gray-600 mt-2"
        numberOfLines={1}
      >
        {/* Địa chỉ: {item.address || "Không có thông tin"} */}
      </Text>
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
            <Text className="text-lg font-pbold text-teal-400">
              {data?.["full-name"] || "Khách"}
            </Text>
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
              borderBottomLeftRadius: 100,
              borderTopRightRadius: 100,
              marginTop: -25,
            }}
            className="shadow-2xl"
            resizeMode="contain"
          />
        </View>

        <View className="flex flex-row items-center justify-between mx-4 mt-4">
          <Text className="text-2xl font-pbold mb-2 text-teal-400">
            Lịch hẹn hôm nay
          </Text>
        </View>

        {appointments.length === 0 ? (
          <View>
            <Image
              source={{
                uri: "https://cdni.iconscout.com/illustration/premium/thumb/woman-with-no-appointment-illustration-download-in-svg-png-gif-file-formats--waiting-issue-empty-state-pack-people-illustrations-10922122.png?f=webp",
              }}
              style={{
                width: "100%",
                height: height * 0.25,
              }}
              className="shadow-2xl"
              resizeMode="contain"
            />
            <Text className="text-center text-lg text-gray-500 mt-4 font-psemibold">
              Không có lịch hẹn nào hôm nay
            </Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
