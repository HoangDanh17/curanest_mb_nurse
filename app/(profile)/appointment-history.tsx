import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const feedbackData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    rating: 5,
    date: "12/11/2024 9:54",
    comment: "Điều dưỡng rất chu đáo và giàu kinh nghiệm.",
    avatar:
      "https://t3.ftcdn.net/jpg/04/97/68/08/360_F_497680856_nWYZ4OrUdRPAhcPYgaYDxKGV1jHqLjZL.jpg",
    services: ["Vệ sinh", "Thay băng", "Tư vấn dinh dưỡng"],
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
    rating: 4,
    date: "13/11/2024 10:30",
    comment: "Dịch vụ tốt, nhân viên nhiệt tình.",
    avatar:
      "https://t3.ftcdn.net/jpg/04/97/68/08/360_F_497680856_nWYZ4OrUdRPAhcPYgaYDxKGV1jHqLjZL.jpg",
    services: ["Phẩu thuật thẩm mĩ", "Chăm sóc da"],
  },
  {
    id: 3,
    name: "Nguyễn Văn C",
    rating: 3,
    date: "14/11/2024 11:15",
    comment: "Hài lòng với dịch vụ, nhưng giá hơi cao.",
    avatar:
      "https://t3.ftcdn.net/jpg/04/97/68/08/360_F_497680856_nWYZ4OrUdRPAhcPYgaYDxKGV1jHqLjZL.jpg",
    services: ["Vệ sinh", "Thay băng", "Tư vấn dinh dưỡng", "Chăm sóc da"],
  },
];

const AppointmentHistoryScreen = () => {
  const [dateFilter, setDateFilter] = useState<{
    label: string;
    value: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Tạo danh sách các ngày duy nhất từ feedbackData
  const uniqueDates = Array.from(
    new Set(feedbackData.map((feedback) => feedback.date.split(" ")[0]))
  );
  const dateOptions = [
    { label: "Tất cả ngày", value: null },
    ...uniqueDates.map((date) => ({ label: date, value: date })),
  ];

  // Lọc dữ liệu theo ngày
  const filteredFeedback = feedbackData.filter((feedback) => {
    const feedbackDate = feedback.date.split(" ")[0]; // Lấy phần ngày (bỏ giờ)
    return (
      dateFilter === null ||
      dateFilter.value === null ||
      feedbackDate === dateFilter.value
    );
  });

  const handleFilterChange = (item: {
    label: string;
    value: string | null;
  }) => {
    setIsLoading(true);
    setDateFilter(item);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-end mb-4">
        <Dropdown
          data={dateOptions}
          labelField="label"
          valueField="value"
          placeholder="Lọc theo ngày"
          value={dateFilter}
          onChange={handleFilterChange}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            width: "50%",
          }}
          placeholderStyle={{ color: "#999" }}
          selectedTextStyle={{ color: "#000" }}
          itemTextStyle={{ color: "#333" }}
          itemContainerStyle={{ backgroundColor: "#fff" }}
          activeColor="#e3f2fd"
          containerStyle={{ borderRadius: 8, marginTop: 8 }}
        />
      </View>

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
          {!isLoading && filteredFeedback.length === 0 ? (
            <View className="flex justify-center items-center my-4">
              <Text className="text-lg text-gray-600">
                Không có lịch sử nào phù hợp.
              </Text>
            </View>
          ) : (
            filteredFeedback.map((feedback) => (
              <View
                key={feedback.id}
                className="mb-4 border border-gray-200 rounded-xl bg-white p-4"
              >
                <View className="flex-row items-center">
                  <View className="flex-1 flex-row justify-between items-center">
                    <View>
                      <Text className="text-lg font-medium">
                        {feedback.name}
                      </Text>
                      <Text className="text-gray-600 mt-1">
                        Ngày đặt: {feedback.date}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-teal-400 px-4 py-2 rounded-lg"
                      onPress={() => {
                        router.push("/detail-appointment/[id]");
                      }}
                    >
                      <Text className="text-white font-psemibold">Chi tiết</Text>
                    </TouchableOpacity>
                  </View>
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
