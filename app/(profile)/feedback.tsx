import React, { useState } from "react";
import { View, ScrollView, Image, Text, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const feedbackData = [
  {
    id: 1,
    name: "Nguyễn Văn B",
    rating: 5,
    date: "12/11/2024 9:54",
    comment: "Điều dưỡng ăn cần, đáo, giàu kinh nghiệm",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
  },
  {
    id: 2,
    name: "Nguyễn Văn C",
    rating: 4,
    date: "12/11/2024 9:54",
    comment: "Điều dưỡng ăn cần, đáo, giàu kinh nghiệm",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
  },
  {
    id: 3,
    name: "Nguyễn Văn D",
    rating: 3,
    date: "12/11/2024 9:54",
    comment: "Điều dưỡng ăn cần, đáo, giàu kinh nghiệm",
    avatar: "https://i.ytimg.com/vi/SzpzF5PKb3c/maxresdefault.jpg",
  },
];

const FeedbackScreen = () => {
  const [ratingFilter, setRatingFilter] = useState<{
    label: string;
    value: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true); // Bắt đầu hiệu ứng loading
    setRatingFilter(item);

    // Giả lập quá trình lọc mất thời gian (ví dụ: 1 giây)
    setTimeout(() => {
      setIsLoading(false); // Kết thúc hiệu ứng loading
    }, 1000);
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
            width: "50%", // Điều chỉnh độ rộng của dropdown
          }}
          placeholderStyle={{ color: "#999" }}
          selectedTextStyle={{ color: "#000" }}
          itemTextStyle={{ color: "#333" }}
          itemContainerStyle={{ backgroundColor: "#fff" }}
          activeColor="#e3f2fd"
          containerStyle={{ borderRadius: 8, marginTop: 8 }}
        />
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <View className="flex justify-center items-center my-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView>
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
                className="mb-4 p-4 border border-gray-200 rounded-xl "
              >
                <View className="flex-row items-start">
                  <Image
                    source={{ uri: feedback.avatar }}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-bold">{feedback.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-yellow-400 text-lg">
                        {"★".repeat(feedback.rating)}
                        {"☆".repeat(5 - feedback.rating)}
                      </Text>
                      <Text className="text-sm text-gray-600 ml-2 mt-1">
                        - {feedback.date}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-sm text-gray-800">
                    {feedback.comment}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default FeedbackScreen;
