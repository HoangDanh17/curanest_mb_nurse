import nurseApiRequest from "@/app/api/nurseApi";
import { useProvider } from "@/app/provider";
import { FeedbackType } from "@/types/nurse";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const FeedbackScreen = () => {
  const [ratingFilter, setRatingFilter] = useState<{
    label: string;
    value: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const { userData } = useProvider();

  async function fetchFeedbackList() {
    try {
      setIsLoading(true);
      const response = await nurseApiRequest.getFeedbackList(
        String(userData?.id)
      );
      setFeedbackList(response.payload.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbackList();
  }, []);

  const filteredFeedback = feedbackList.filter((feedback) => {
    const starRating = parseInt(feedback.star, 10);
    return (
      ratingFilter === null ||
      ratingFilter.value === null ||
      starRating >= ratingFilter.value
    );
  });

  const ratingOptions = [
    { label: "All Ratings", value: null },
    { label: "★ 1+", value: 1 },
    { label: "★ 2+", value: 2 },
    { label: "★ 3+", value: 3 },
    { label: "★ 4+", value: 4 },
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

  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbVRDSofQ4TEhITHvhKmeGoZ5yN2r2qzn7oEuRuxzgu3LaN2pM1cTZVFPVFGiW7Lgb83s&usqp=CAU";

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
                key={feedback["medical-record-id"]}
                className="mb-4 p-4 border border-gray-200 rounded-xl"
              >
                <View className="flex-row items-start">
                  <Image
                    source={{ uri: defaultAvatar }}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center mt-1 gap-2">
                      <Text className="text-lg font-pbold">
                        {feedback["patient-name"]} - 
                      </Text>
                      <Text className="text-yellow-400 text-lg font-pmedium">
                        {"★".repeat(parseInt(feedback.star, 10))}
                        {"☆".repeat(5 - parseInt(feedback.star, 10))}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600 font-psemibold mt-2">
                      Dịch vụ: {feedback.service}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-md font-pmedium text-gray-800">
                    Đánh giá: {feedback.content || "Không có bình luận."}{" "}
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
