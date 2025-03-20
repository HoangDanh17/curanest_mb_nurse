import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useRouter } from "expo-router";
import SystemOptionScreen from "@/components/createAppointment/SystemOptionScreen";
type AppointmentStatus = "upcoming" | "in_progress" | "finish";

export interface Appointment {
  id: number;
  time: string;
  patientName: string;
  avatar: string;
  service: string[];
  status: AppointmentStatus;
  duration: number;
}

const schedule: { [key: string]: Appointment[] } = {
  "2025-03-08": [
    {
      id: 1,
      time: "08:00",
      patientName: "Nguyễn Văn A",
      avatar:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      service: ["Khám tổng quát", "Xét nghiệm máu"], // Mảng các dịch vụ
      status: "upcoming",
      duration: 60,
    },
    {
      id: 2,
      time: "09:00",
      patientName: "Trần Thị B",
      avatar:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      service: ["Khám răng", "Chụp X-quang"], // Mảng các dịch vụ
      status: "in_progress",
      duration: 60,
    },
  ],
  "2025-03-09": [
    {
      id: 3,
      time: "08:00",
      patientName: "Lê Văn C",
      avatar:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      service: ["Khám mắt", "Đo thị lực"], // Mảng các dịch vụ
      status: "finish",
      duration: 60,
    },
    {
      id: 4,
      time: "09:00",
      patientName: "Phạm Thị D",
      avatar:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      service: ["Khám da liễu", "Điều trị mụn"], // Mảng các dịch vụ
      status: "upcoming",
      duration: 60,
    },
  ],
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

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    handleDateSelect(today);
  }, []);

  const getDates = () => {
    const dates = [];
    const today = new Date();
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
    const dateKey = selectedDate.toISOString().split("T")[0];
    return schedule[dateKey] || [];
  };

  const calculateEndTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTimeSelect = async (time: string) => {
    setSelectedTime(time);
    const endTime = calculateEndTime(time, 90);
    setEndTime(endTime);
    setLoadingTime(time);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push(`/detail-appointment/${time}`);
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
    const dateKey = date.toISOString().split("T")[0];
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
            className={`text-lg font-pbold  ${
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
    const isSelected = selectedTime === item.time;
    const isLoading = loadingTime === item.time;

    const endTime = calculateEndTime(item.time, item.duration);

    const statusStyles = {
      upcoming: {
        bg: "bg-yellow-50",
        border: "border-yellow-400",
        text: "text-yellow-800",
      },
      in_progress: {
        bg: "bg-blue-50",
        border: "border-blue-400",
        text: "text-blue-800",
      },
      finish: {
        bg: "bg-green-50",
        border: "border-green-400",
        text: "text-green-800",
      },
    }[item.status];

    return (
      <Pressable
        className={`flex-row items-center p-4 m-2 rounded-lg border-2 ${statusStyles.bg} ${statusStyles.border}`}
        onPress={() => handleTimeSelect(item.time)}
        disabled={isLoading}
      >
        <View className="flex-row items-center w-full">
          {isLoading ? (
            <View className="flex-1 justify-center items-center h-[86px]">
              <ActivityIndicator
                size="large"
                color={isSelected ? "#999" : "#64C1DB"}
              />
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
                      {item.time} - {endTime}
                    </Text>
                  </View>

                  <Image
                    source={{ uri: item.avatar }}
                    className="w-20 h-20 rounded-xl"
                  />
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-1 flex-row flex-wrap items-center">
                    {item.service.map((service, index) => (
                      <View
                        key={index}
                        className={`px-2 py-1 rounded-full bg-gray-100 border border-gray-200 mr-2 mb-2 `}
                        style={{ maxWidth: "80%" }}
                      >
                        <Text
                          className={`text-xs font-psemibold text-gray-700`}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {service}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    className={`px-2 py-1 rounded-full ${statusStyles.bg} border ${statusStyles.border}`}
                  >
                    <Text
                      className={`text-xs font-psemibold ${statusStyles.text}`}
                    >
                      {item.status === "upcoming" && "Sắp diễn ra"}
                      {item.status === "in_progress" && "Đang diễn ra"}
                      {item.status === "finish" && "Đã hoàn thành"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </Pressable>
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
      <Text className="font-pbold text-2xl mx-2 my-4">Lịch hẹn bệnh nhân</Text>
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
