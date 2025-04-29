import appointmentApiRequest from "@/app/api/appointmentApi";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  Pressable,
} from "react-native";
import { AppointmentList, Status, StatusStyle } from "@/types/appointment";
import { UserInfo } from "@/app/(tabs)/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const STATUS_STYLES: Record<Status, StatusStyle> = {
  waiting: {
    backgroundColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-2 border-amber-500",
    label: "Chờ xác nhận",
  },
  upcoming: {
    backgroundColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-2 border-indigo-500",
    label: "Sắp tới",
  },
  success: {
    backgroundColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-2 border-emerald-500",
    label: "Hoàn thành",
  },
  confirmed: {
    backgroundColor: "bg-sky-50",
    textColor: "text-sky-600",
    borderColor: "border-2 border-sky-500",
    label: "Đã xác nhận",
  },
  changed: {
    backgroundColor: "bg-violet-50",
    textColor: "text-violet-600",
    borderColor: "border-2 border-violet-500",
    label: "Chờ đổi điều dưỡng",
  },
};

const AppointmentHistoryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentList[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem("userInfo");
      if (value) {
        const parsedValue: UserInfo = JSON.parse(value);
        setUserInfo(parsedValue);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  async function fetchAppointments() {
    try {
      setIsLoading(true);
      const response = await appointmentApiRequest.getListAppointmentHistory(
        String(userInfo?.id)
      );
      setAppointments(response.payload.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserInfo();
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (!selectedDate) return true;
    const appointmentDate = new Date(appointment["est-date"]).toDateString();
    return appointmentDate === selectedDate.toDateString();
  });

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Xử lý khi chọn ngày từ date picker
  const handleDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "dismissed" || !selected) {
      return;
    }
    setSelectedDate(selected);
  };

  // Xóa ngày đã chọn
  const clearDate = () => {
    setSelectedDate(null);
  };

  // Format ngày hiển thị
  const formatDate = (date: Date | null) => {
    if (!date) return "Tìm theo ngày";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <View className="flex-1 p-4 px-2 bg-white">
      <View className="flex-row justify-end mb-4 items-center gap-2">
        <Pressable
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-sm text-gray-800">
            {formatDate(selectedDate)}
          </Text>
        </Pressable>
        {selectedDate && (
          <Pressable
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            onPress={clearDate}
          >
            <Text className="text-sm text-gray-800">Xóa ngày</Text>
          </Pressable>
        )}
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <View className="w-4/5 self-center">
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            onChange={handleDateChange}
          />
        </View>
      )}

      {/* Danh sách appointment */}
      {isLoading ? (
        <View className="flex justify-center items-center my-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          className="p-2"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          fadingEdgeLength={0}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0000ff"]}
              tintColor="#0000ff"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {!isLoading && filteredAppointments.length === 0 ? (
            <View className="flex-1 justify-center items-center my-4">
              <Image
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/man-with-no-schedule-illustration-download-in-svg-png-gif-file-formats--calendar-appointment-empty-state-pack-people-illustrations-10920936.png",
                }}
                className="w-64 h-64 mb-2"
                resizeMode="contain"
              />
              <Text className="text-lg text-gray-600">
                Không có lịch hẹn phù hợp
              </Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => (
              <View
                key={appointment.id}
                className="mb-4 border border-gray-200 rounded-xl bg-white p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-col items-start">
                    <Text
                      className={`text-sm font-pmedium ${
                        STATUS_STYLES[appointment.status].textColor
                      } px-2 py-1 rounded-2xl ${
                        STATUS_STYLES[appointment.status].backgroundColor
                      } ${STATUS_STYLES[appointment.status].borderColor}`}
                    >
                      {STATUS_STYLES[appointment.status].label}
                    </Text>
                    <Text className="text-md font-pmedium mt-2">
                      Lịch hẹn -{" "}
                      {new Date(appointment["est-date"]).toLocaleDateString(
                        "vi-VN"
                      )}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-teal-400 px-4 py-2 rounded-lg"
                    onPress={() => {
                      router.push({
                        pathname: "/detail-appointment/[id]",
                        params: {
                          id: String(appointment.id),
                          packageId: appointment["cuspackage-id"],
                          patientId: appointment["patient-id"],
                          date: appointment["est-date"],
                          status: appointment.status,
                        },
                      });
                    }}
                  >
                    <Text className="text-white font-psemibold">Chi tiết</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AppointmentHistoryScreen;
