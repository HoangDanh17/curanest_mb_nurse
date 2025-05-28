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
  TouchableOpacity,
} from "react-native";
import WelcomeImage from "@/assets/images/homepage.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppointmentList } from "@/types/appointment";
import appointmentApiRequest from "@/app/api/appointmentApi";
import { UserData } from "@/app/(auth)/login";
import { format } from "date-fns";
import { useProvider } from "@/app/provider";
import { Ionicons } from "@expo/vector-icons";
import { NotiListType } from "@/types/noti";
import notiApiRequest from "@/app/api/notiApi";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentList[]>([]);
  const { setUserData } = useProvider();
  const [data, setData] = useState<UserData | undefined>();
  const [notiList, setNotiList] = useState<NotiListType[]>([]);

  async function fetchNoti(userId: string) {
    try {
      setLoading(true);
      const response = await notiApiRequest.getNotiList(userId);
      const filterData = response.payload.data.filter(
        (s) => s["read-at"] === null
      );
      setNotiList(filterData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

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
            item.status === "confirmed" ||
            item.status === "upcoming" ||
            item.status === "success"
        )
        .sort((a: AppointmentList, b: AppointmentList) => {
          const statusPriority: { [key: string]: number } = {
            confirmed: 1,
            upcoming: 2,
            success: 3,
          };
          const priorityA = statusPriority[a.status] || 4;
          const priorityB = statusPriority[b.status] || 4;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
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

  const fetchUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem("userInfo");
      if (value) {
        const parsedValue: UserData = JSON.parse(value);
        setUserData(parsedValue);
        setData(parsedValue);
        return parsedValue;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const userInfo = await fetchUserInfo();
          if (userInfo && userInfo.id) {
            await Promise.all([
              fetchAppointments(String(userInfo.id)),
              fetchNoti(String(userInfo.id)),
            ]);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
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
      case "success":
        return {
          backgroundColor: "#E6FFFA",
          borderColor: "#00C4B4",
          statusText: "Hoàn thành",
          statusColor: "#00C4B4",
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
              id: String(item.id),
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
        <View className="flex flex-row items-center justify-between px-4 mt-4">
          <View className="flex flex-col items-start mb-5">
            <Text className="text-md font-psemibold text-gray-400">
              Chào mừng trở lại
            </Text>
            <Text className="text-lg font-pbold text-teal-400">
              {data?.["full-name"] || "Khách"}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push("/detail-notification")}
              className="relative mr-4"
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#374151"
              />
              {notiList.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <Text className="text-white text-xs font-psemibold">
                    {notiList.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
            removeClippedSubviews={false}
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
