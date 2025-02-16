import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Calendar, DateData } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";

interface LeaveType {
  id: number;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
  };
}

const LEAVE_TYPES: LeaveType[] = [
  { id: 1, name: "Nghỉ phép năm", icon: "beach-access" },
  { id: 2, name: "Nghỉ ốm", icon: "local-hospital" },
  { id: 3, name: "Nghỉ cá nhân", icon: "person" },
  { id: 4, name: "Làm việc từ xa", icon: "home" },
];

const LeaveScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [cause, setCause] = useState<string>("");
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);
  const [showStartDateCalendar, setShowStartDateCalendar] =
    useState<boolean>(false);
  const [showEndDateCalendar, setShowEndDateCalendar] =
    useState<boolean>(false);

  // Hàm kiểm tra ngày hợp lệ (lớn hơn hoặc bằng ngày hiện tại)
  const isValidDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Bỏ qua giờ phút giây
    return selectedDate >= currentDate;
  };

  // Hàm kiểm tra ngày bắt đầu có cách ngày hiện tại ít nhất 3 ngày
  const isStartDateValid = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Bỏ qua giờ phút giây
    const diffTime = selectedDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const calculateDays = (): number => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleStartDatePress = (day: DateData): void => {
    if (!isValidDate(day.dateString)) {
      Alert.alert("Lỗi", "Không thể chọn ngày trong quá khứ");
      return;
    }
    if (!isStartDateValid(day.dateString)) {
      Alert.alert("Lỗi", "Ngày bắt đầu phải cách ngày hiện tại ít nhất 3 ngày");
      return;
    }
    setSelectedStartDate(day.dateString);
    setShowStartDateCalendar(false);
  };

  const handleEndDatePress = (day: DateData): void => {
    if (!isValidDate(day.dateString)) {
      Alert.alert("Lỗi", "Không thể chọn ngày trong quá khứ");
      return;
    }

    const startDate = new Date(selectedStartDate);
    const endDate = new Date(day.dateString);
    if (endDate < startDate) {
      Alert.alert("Lỗi", "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
      return;
    }
    setSelectedEndDate(day.dateString);
    setShowEndDateCalendar(false);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Chọn ngày";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = (): void => {
    if (!selectedType) {
      Alert.alert("Lỗi", "Vui lòng chọn loại nghỉ phép");
      return;
    }
    if (!selectedStartDate || !selectedEndDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (!cause.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do nghỉ phép");
      return;
    }
    if (!isStartDateValid(selectedStartDate)) {
      Alert.alert("Lỗi", "Ngày bắt đầu phải cách ngày hiện tại ít nhất 3 ngày");
      return;
    }

    const leaveData = {
      type: selectedType,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      reason: cause,
      duration: calculateDays(),
    };

    console.log("Gửi đơn xin nghỉ phép:", leaveData);
  };

  const getMarkedDates = (): MarkedDates => {
    const markedDates: MarkedDates = {};

    if (selectedStartDate) {
      markedDates[selectedStartDate] = {
        selected: true,
        startingDay: true,
        color: "#14B8A6", // Màu teal
      };
    }

    if (selectedEndDate) {
      markedDates[selectedEndDate] = {
        selected: true,
        endingDay: true,
        color: "#14B8A6", // Màu teal
      };
    }

    return markedDates;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-4">
          <Text className="text-2xl font-pbold mb-6 text-center text-teal-600">
            Đơn Xin Nghỉ Phép
          </Text>

          {/* Thông báo đăng ký trước 3 ngày */}
          <Text className="text-sm text-gray-500 mb-4 text-center">
            Lịch nghỉ phép phải được đăng ký trước ít nhất 3 ngày.
          </Text>

          {/* Chọn loại nghỉ phép */}
          <TouchableOpacity
            className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-4"
            onPress={() => setShowTypeSelector(!showTypeSelector)}
          >
            <View className="w-6 h-6 bg-teal-500 rounded-md items-center justify-center mr-3">
              {selectedType ? (
                <MaterialIcons
                  name={selectedType.icon}
                  size={20}
                  color="white"
                />
              ) : (
                <MaterialIcons name="list" size={20} color="white" />
              )}
            </View>
            <Text className="text-base">
              {selectedType?.name || "Chọn loại nghỉ phép"}
            </Text>
          </TouchableOpacity>

          {showTypeSelector && (
            <View className="bg-white rounded-xl mb-4 shadow-sm border border-gray-100">
              {LEAVE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => {
                    setSelectedType(type);
                    setShowTypeSelector(false);
                  }}
                >
                  <MaterialIcons
                    name={type.icon}
                    size={20}
                    color="#14B8A6"
                    className="mr-3"
                  />
                  <Text className="text-base">{type.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Nhập lý do */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-teal-500 rounded-md items-center justify-center mr-3">
                <MaterialIcons name="edit" size={20} color="white" />
              </View>
              <TextInput
                className="flex-1 text-base"
                placeholder="Nhập lý do nghỉ phép"
                value={cause}
                onChangeText={setCause}
              />
            </View>
          </View>

          {/* Chọn ngày bắt đầu */}
          <TouchableOpacity
            onPress={() => setShowStartDateCalendar(!showStartDateCalendar)}
            className="bg-gray-50 rounded-xl p-4 mb-4"
          >
            <View className="flex-row">
              <View className="w-6 h-6 bg-teal-500 rounded-md items-center justify-center mr-3">
                <MaterialIcons name="event" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Từ ngày</Text>

                <Text className="text-base font-pmedium">
                  {formatDate(selectedStartDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {showStartDateCalendar && (
            <Calendar
              className="mb-4 rounded-xl border border-gray-200"
              markedDates={getMarkedDates()}
              onDayPress={handleStartDatePress}
              minDate={new Date().toISOString().split("T")[0]} //
              theme={{
                selectedDayBackgroundColor: "#14B8A6", // Màu teal
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#14B8A6", // Màu teal
                arrowColor: "#14B8A6", // Màu teal
              }}
            />
          )}

          {/* Chọn ngày kết thúc */}
          <TouchableOpacity
            onPress={() => setShowEndDateCalendar(!showEndDateCalendar)}
            className="bg-gray-50 rounded-xl p-4 mb-4"
          >
            <View className="flex-row">
              <View className="w-6 h-6 bg-teal-500 rounded-md items-center justify-center mr-3">
                <MaterialIcons name="event" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">Đến ngày</Text>
                <Text className="text-base font-pmedium">
                  {formatDate(selectedEndDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Lịch chọn ngày kết thúc */}
          {showEndDateCalendar && (
            <Calendar
              className="mb-4 rounded-xl border border-gray-200"
              markedDates={getMarkedDates()}
              onDayPress={handleEndDatePress}
              minDate={
                selectedStartDate || new Date().toISOString().split("T")[0]
              } // Chỉ cho phép chọn ngày từ ngày bắt đầu hoặc hôm nay trở đi
              theme={{
                selectedDayBackgroundColor: "#14B8A6", // Màu teal
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#14B8A6", // Màu teal
                arrowColor: "#14B8A6", // Màu teal
              }}
            />
          )}

          {/* Nút gửi đơn */}
          <TouchableOpacity
            className="bg-teal-500 p-4 rounded-xl mt-auto"
            onPress={handleSubmit}
          >
            <Text className="text-white text-base font-psemibold text-center">
              Gửi đơn xin nghỉ {calculateDays()} ngày
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveScreen;
