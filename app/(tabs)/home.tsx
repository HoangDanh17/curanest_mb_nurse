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
import { useProvider } from "@/app/provider";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentList[]>([]);
  const [data, setData] = useState<UserData | undefined>();
  const { setUserData } = useProvider();

  const fetchUserData = async () => {
    try {
      const dataUser = await AsyncStorage.getItem("userInfo");
      if (dataUser) {
        const parsedData: UserData = JSON.parse(dataUser);
        setData(parsedData);
        setUserData(parsedData);
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
      const sortedAppointments = response.payload.data
        .filter(
          (item: AppointmentList) =>
            item.status === "confirmed" || item.status === "upcoming"
        )
        .sort((a: AppointmentList, b: AppointmentList) => {
          if (a.status === "confirmed" && b.status === "upcoming") return -1;
          if (a.status === "upcoming" && b.status === "confirmed") return 1;
          return (
            new Date(a["est-date"]).getTime() -
            new Date(b["est-date"]).getTime()
          );
        });
      setAppointments(sortedAppointments);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          backgroundColor: "#E6F3E6",
          borderColor: "#4CAF50",
          statusText: "Đã xác nhận",
          statusColor: "#4CAF50",
        };
      case "upcoming":
        return {
          backgroundColor: "#FFF8E6",
          borderColor: "#FFA500",
          statusText: "Sắp tới",
          statusColor: "#FFA500",
        };
      default:
        return {
          backgroundColor: "#FFFFFF",
          borderColor: "#D1D5DB",
          statusText: "Không xác định",
          statusColor: "#6B7280",
        };
    }
  };

  const renderAppointmentItem = ({ item }: { item: AppointmentList }) => {
    const { backgroundColor, borderColor, statusText, statusColor } =
      getStatusStyle(item.status);

    return (
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
              locationGPS: item["patient-lat-lng"],
              status: item.status,
            },
          })
        }
        className="mx-4 my-2 rounded-lg shadow-lg"
        style={{ backgroundColor, borderWidth: 1, borderColor }}
      >
        <View className="flex flex-row justify-between items-center p-4">
          <View className="flex flex-row items-center">
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAdmCtWjfGHEabmDXtRwRDMQ1RLh2v1gxGKA&s",
              }}
              className="w-12 h-12 mr-4 rounded-xl"
            />
            <View>
              <Text className="text-lg font-pbold text-gray-800">
                {statusText}
              </Text>
              <Text className="text-md font-psemibold text-gray-500">
                {format(new Date(item["est-date"]), "dd/MM/yyyy - HH:mm")}
              </Text>
            </View>
          </View>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: `${statusColor}20` }}
          >
            <Text
              className="text-xs font-psemibold"
              style={{ color: statusColor }}
            >
              {statusText}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex flex-col items-start">
            <Text className="text-md font-psemibold text-gray-400">
              Chào mừng trở lại
            </Text>
            <Text className="text-lg font-pbold text-teal-400">
              {data?.["full-name"] || "Khách"}
            </Text>
          </View>
          <Image
            source={Logo}
            style={{
              width: width * 0.3,
              height: height * 0.14,
              resizeMode: "contain",
            }}
          />
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
          <View className="items-center">
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
