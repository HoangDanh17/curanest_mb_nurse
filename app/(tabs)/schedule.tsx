import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useFocusEffect, useRouter } from "expo-router";
import SystemOptionScreen from "@/components/createAppointment/SystemOptionScreen";
import { AppointmentList, Status } from "@/types/appointment";
import { UserData } from "@/app/(auth)/login";
import { format } from "date-fns";
import appointmentApiRequest from "@/app/api/appointmentApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProvider } from "@/app/provider";

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  avatar: string;
  locationGPS: string;
  status: Status;
  cuspackageId?: string;
  nurseId?: string;
  patientId?: string;
  estDate?: string;
  apiStatus?: string;
}

const schedule: { [key: string]: Appointment[] } = {};

const mapStatus = (apiStatus: string): Status => {
  switch (apiStatus) {
    case "waiting":
      return "waiting";
    case "confirmed":
      return "confirmed";
    case "success":
      return "success";
    case "upcoming":
      return "upcoming";
    case "changed":
      return "changed";
    default:
      return "waiting";
  }
};

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string>("");
  const [currentMonthYear, setCurrentMonthYear] = useState<string>("");
  const [loadingTime, setLoadingTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const translateY = useSharedValue(-50);
  const [appointments, setAppointments] = useState<AppointmentList[]>([]);
  const { userData } = useProvider();

  async function fetchAppointments() {
    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(
      new Date(new Date().setDate(new Date().getDate() + 14)),
      "yyyy-MM-dd"
    );
    try {
      const response = await appointmentApiRequest.getListAppointment(
        String(userData?.id),
        today,
        tomorrow
      );
      const mappedAppointments: { [key: string]: Appointment[] } = {};

      const filteredData = response.payload.data.filter(
        (item: AppointmentList) =>
          item.status === "confirmed" ||
          item.status === "upcoming" ||
          item.status === "success"
      );

      filteredData.forEach((item: AppointmentList) => {
        const estDate = new Date(item["est-date"]);
        const dateKey = format(estDate, "yyyy-MM-dd");
        const time = format(estDate, "HH:mm a");

        const appointment: Appointment = {
          id: item.id,
          time: time,
          patientName: "Lịch hẹn sắp tới",
          avatar:
            "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
          status: mapStatus(item.status),
          cuspackageId: item["cuspackage-id"],
          nurseId: item["nursing-id"],
          patientId: item["patient-id"],
          estDate: item["est-date"],
          locationGPS: item["patient-lat-lng"],
          apiStatus: item.status,
        };

        if (!mappedAppointments[dateKey]) {
          mappedAppointments[dateKey] = [];
        }
        mappedAppointments[dateKey].push(appointment);
      });

      Object.assign(schedule, mappedAppointments);
      setAppointments(filteredData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    handleDateSelect(today);
  }, []);

  
  useFocusEffect(
    useCallback(() => {
      if (userData?.id) {
        fetchAppointments().then(() => {
          const dates = getDates();
          if (dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
            handleDateSelect(dates[0]);
          }
        });
      }
    }, [userData?.id])
  );

  const getDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  const getTimes = (selectedDate: Date | null) => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return schedule[dateKey] || [];
  };

  const calculateEndTime = (time: string, duration: number) => {
    try {
      const [timePart, period] = time.split(" ");
      if (!timePart || !period) {
        throw new Error("Invalid time format, expected 'HH:mm a'");
      }
      const [hoursStr, minutesStr] = timePart.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid hours or minutes");
      }

      if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(startDate.getTime() + duration * 60000);
      return format(endDate, "HH:mm a").toUpperCase(); // Trả về định dạng HH:mm a
    } catch (error) {
      console.error("Error in calculateEndTime:", error);
      return time; // Trả về time gốc nếu có lỗi
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) {
      console.error("selectedDate is null or undefined");
      setLoadingTime(null);
      return;
    }
    if (!userData?.id) {
      console.error("data.id is undefined");
      setLoadingTime(null);
      return;
    }

    const normalizedTime = time.toUpperCase();
    setSelectedTime(normalizedTime);
    const endTime = calculateEndTime(normalizedTime, 90);
    setEndTime(endTime);
    setLoadingTime(normalizedTime);

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const selectedAppointment = schedule[dateKey]?.find((appt) => {
      return appt.time === normalizedTime;
    });

    if (selectedAppointment) {
      const params = {
        id: selectedAppointment.id,
        packageId: selectedAppointment.cuspackageId || "",
        nurseId: selectedAppointment.nurseId || String(userData.id),
        patientId: selectedAppointment.patientId || "",
        date: selectedAppointment.estDate || "",
        locationGPS: selectedAppointment.locationGPS,
        status: selectedAppointment.apiStatus || "",
      };
      setTimeout(() => {
        router.push({
          pathname: "/detail-appointment/[id]",
          params,
        });
      }, 500);
    } else {
      console.error(
        "No appointment found for time:",
        normalizedTime,
        "on date:",
        dateKey
      );
    }

    setLoadingTime(null);
  };

  const handleDateSelect = async (date: Date) => {
    setIsLoading(true);
    setSelectedDate(date);
    translateY.value = 0;

    const index = dates.findIndex(
      (d) => d.toDateString() === date.toDateString()
    );

    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const hasAppointment = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return schedule[dateKey] && schedule[dateKey].length > 0;
  };

  const renderDateItem = ({ item }: { item: Date }) => {
    const isSelected = selectedDate?.toDateString() === item.toDateString();
    const hasAppointments = hasAppointment(item);

    return (
      <View className="flex flex-col items-center">
        <Pressable
          className={`w-16 h-16 rounded-full items-center justify-center mx-2 font-pbold ${
            isSelected
              ? "bg-[#64C1DB]"
              : hasAppointments
              ? "bg-white border-2 border-[#64C1DB]"
              : "bg-white border-2 border-gray-200/90"
          }`}
          onPress={() => handleDateSelect(item)}
        >
          <Text
            className={`text-lg font-pbold ${
              isSelected ? "text-white" : "text-gray-900"
            }`}
          >
            {item.getDate()}
          </Text>
        </Pressable>
        <Text
          className={`text-sm font-psemibold mt-2 ${
            isSelected ? "text-gray-700" : "text-gray-700"
          }`}
        >
          {item.toLocaleDateString("vi-VN", { weekday: "short" })}
        </Text>
      </View>
    );
  };

  const renderTimeItem = ({ item }: { item: Appointment }) => {
    const isLoading = loadingTime === item.time;

    const statusStyles = {
      upcoming: {
        bg: "bg-amber-50",
        border: "border-amber-400",
        text: "text-amber-800",
      },
      confirmed: {
        bg: "bg-indigo-50",
        border: "border-indigo-400",
        text: "text-indigo-800",
      },
      success: {
        bg: "bg-emerald-50",
        border: "border-emerald-400",
        text: "text-emerald-800",
      },
      waiting: {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-800",
      },
      changed: {
        bg: "bg-violet-50",
        border: "border-violet-400",
        text: "text-violet-800",
      },
    }[item.status];

    return (
      <TouchableOpacity
        className={`flex-row items-center p-4 m-2 rounded-lg border-2 ${statusStyles.bg} ${statusStyles.border}`}
        onPress={() => handleTimeSelect(item.time)}
        disabled={isLoading}
      >
        <View className="flex-row items-center w-full">
          {isLoading ? (
            <View className="flex-1 justify-center items-center h-[86px]">
              <ActivityIndicator size="large" color={"#64C1DB"} />
            </View>
          ) : (
            <>
              <View className="flex-1 flex-col">
                <View className="flex-row justify-between items-center">
                  <View className="flex-col gap-2">
                    <Text className={`text-xl font-pbold ${statusStyles.text}`}>
                      {item.patientName}
                    </Text>
                    <Text
                      className={`text-sm font-psemibold ${statusStyles.text}`}
                    >
                      {item.time}
                    </Text>
                  </View>

                  <Image
                    source={{ uri: item.avatar }}
                    className="w-20 h-20 rounded-xl"
                  />
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <View
                    className={`px-2 py-1 rounded-full ${statusStyles.bg} border ${statusStyles.border}`}
                  >
                    <Text
                      className={`text-xs font-psemibold ${statusStyles.text}`}
                    >
                      {item.status === "waiting" && "Chờ xác nhận"}
                      {item.status === "confirmed" && "Đã xác nhận"}
                      {item.status === "success" && "Hoàn thành"}
                      {item.status === "upcoming" && "Sắp tới"}
                      {item.status === "changed" && "Chờ đổi điều dưỡng"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstVisibleDate = viewableItems[0].item;
      const monthYear = firstVisibleDate.toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      });
      setCurrentMonthYear(monthYear);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="font-pbold text-2xl mx-2 my-6">Lịch hẹn bệnh nhân</Text>
      <SystemOptionScreen
        currentMonthYear={currentMonthYear}
        dates={dates}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        loadingTime={loadingTime}
        flatListRef={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        handleDateSelect={handleDateSelect}
        handleTimeSelect={handleTimeSelect}
        getTimes={getTimes}
        renderDateItem={renderDateItem}
        renderTimeItem={renderTimeItem}
        translateY={translateY}
        isLoading={isLoading}
      />
    </View>
  );
};

export default AppointmentScreen;
