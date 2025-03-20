import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const feedbackData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    rating: 5,
    date: "12/11/2024 9:54",
    comment: "Điều dưỡng rất chu đáo và giàu kinh nghiệm.",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
    services: ["Vệ sinh", "Thay băng", "Tư vấn dinh dưỡng"],
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
    rating: 4,
    date: "13/11/2024 10:30",
    comment: "Dịch vụ tốt, nhân viên nhiệt tình.",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
    services: ["Phẩu thuật thẩm mĩ", "Chăm sóc da"],
  },
  {
    id: 3,
    name: "Nguyễn Văn C",
    rating: 3,
    date: "14/11/2024 11:15",
    comment: "Hài lòng với dịch vụ, nhưng giá hơi cao.",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
    services: ["Vệ sinh", "Thay băng", "Tư vấn dinh dưỡng", "Chăm sóc da"],
  },
];

const AppointmentHistoryScreen = () => {
  const [ratingFilter, setRatingFilter] = useState<{
    label: string;
    value: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredFeedback = feedbackData.filter((feedback) => {
    return (
      ratingFilter === null ||
      ratingFilter.value === null ||
      feedback.rating === ratingFilter.value
    );
  });

  const ratingOptions = [
    { label: "All Ratings", value: null },
    { label: "★ 1", value: 1 },
    { label: "★ 2", value: 2 },
    { label: "★ 3", value: 3 },
    { label: "★ 4", value: 4 },
    { label: "★ 5", value: 5 },
  ];

  const handleFilterChange = (item: {
    label: string;
    value: number | null;
  }) => {
    setIsLoading(true);
    setRatingFilter(item);
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
          data={ratingOptions}
          labelField="label"
          valueField="value"
          placeholder="Lọc theo ★"
          value={ratingFilter}
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
                Không có đánh giá nào phù hợp.
              </Text>
            </View>
          ) : (
            filteredFeedback.map((feedback) => (
              <View
                key={feedback.id}
                className="mb-4 border border-pink-100 rounded-xl bg-white"
              >
                <View className="p-4 flex-row justify-between items-start">
                  <View className="w-16 h-16 bg-pink-100 rounded-xl mr-4 items-center justify-center">
                    <Text className="text-2xl">A</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-lg font-medium">
                        {feedback.name}
                      </Text>
                      <View className="bg-green-100 px-2 py-1 rounded-xl">
                        <Text className="text-green-700 text-sm font-psemibold">
                          Hoàn thành
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-500 text-sm mt-1">
                      098575456
                    </Text>
                  </View>
                </View>

                <View className="px-4 py-3 border-t border-gray-200">
                  <View className="flex-col justify-between gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-600 flex-shrink-0">
                        Lịch đặt ngày:{" "}
                      </Text>
                      <Text className="text-gray-800 flex-1 text-right">
                        {feedback.date}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-600 flex-shrink-0">
                        Giá tiền:{" "}
                      </Text>
                      <Text className="text-orange-500 font-medium flex-1 text-right">
                        500,000 VND
                      </Text>
                    </View>
                  </View>

                  <View className="mt-2">
                    <Text className="text-gray-600 mb-2">Dịch vụ:</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {feedback.services.map((service, index) => (
                        <View
                          key={index}
                          className={`px-3 py-1 rounded-full ${
                            index % 2 === 0 ? "bg-pink-100" : "bg-orange-100"
                          }`}
                        >
                          <Text
                            className={
                              index % 2 === 0
                                ? "text-pink-700"
                                : "text-orange-700"
                            }
                          >
                            {service}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Rating section */}
                <View className="p-4 border-t border-gray-200">
                  <Text className="text-gray-700 flex-row items-center">
                    Đánh giá:{" "}
                    <Text className="text-yellow-400 text-lg">
                      {"★".repeat(feedback.rating)}
                      {"☆".repeat(5 - feedback.rating)}
                    </Text>
                  </Text>
                  <View className="mt-1">
                    <Text className="text-gray-600">{feedback.comment}</Text>
                  </View>
                </View>

                {/* Button section */}
                <View className="p-4 border-t border-gray-200 flex items-center">
                  <TouchableOpacity
                    className="bg-orange-100 px-4 py-2 rounded-lg"
                    onPress={() => {
                      router.push("/detail-appointment/[id]");
                    }}
                  >
                    <Text className="text-orange-700">Xem chi tiết lịch</Text>
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
