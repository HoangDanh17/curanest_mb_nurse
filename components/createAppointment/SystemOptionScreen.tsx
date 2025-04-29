import { Appointment } from "@/app/(tabs)/schedule";
import React from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
const { height } = Dimensions.get("window");
interface SystemOptionScreenProps {
  currentMonthYear: string;
  dates: Date[];
  selectedDate: Date | null;
  selectedTime: string | null;
  loadingTime: string | null;
  flatListRef: React.RefObject<FlatList>;
  onViewableItemsChanged: any;
  viewabilityConfig: any;
  handleDateSelect: (date: Date) => void;
  handleTimeSelect: (time: string) => void;
  getTimes: (selectedDate: Date | null) => Appointment[];
  renderDateItem: ({ item }: { item: Date }) => JSX.Element;
  renderTimeItem: ({ item }: { item: Appointment }) => JSX.Element;
  translateY: any;
  isLoading: boolean;
}

const SystemOptionScreen: React.FC<SystemOptionScreenProps> = ({
  currentMonthYear,
  dates,
  selectedDate,
  selectedTime,
  loadingTime,
  flatListRef,
  onViewableItemsChanged,
  viewabilityConfig,
  handleDateSelect,
  handleTimeSelect,
  getTimes,
  renderDateItem,
  renderTimeItem,
  translateY,
  isLoading,
}) => {
  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="flex-1"
    >
      <Text className="text-lg mb-4 ml-4 my-4 text-gray-700 font-psemibold">
        {currentMonthYear ||
          dates[0].toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
      </Text>
      <View className="mb-2">
        <FlatList
          ref={flatListRef}
          data={dates}
          renderItem={renderDateItem}
          removeClippedSubviews={false}
          keyExtractor={(item) => item.toDateString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
      {selectedDate && (
        <>
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#64C1DB" />
            </View>
          ) : getTimes(selectedDate).length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Image
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/schedule-appointment-illustration-download-in-svg-png-gif-file-formats--meeting-agenda-planner-employment-pack-business-illustrations-3757143.png",
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
            <Animated.View style={[scrollViewStyle, { flex: 1 }]}>
              <FlatList
                data={getTimes(selectedDate)}
                renderItem={renderTimeItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 4,
                  paddingBottom: 20,
                }}
              />
            </Animated.View>
          )}
        </>
      )}
    </Animated.View>
  );
};

export default SystemOptionScreen;
