import { Appointment } from "@/app/(tabs)/appointment";
import React from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

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
              <Text className="text-xl text-gray-500 font-psemibold">
                Không có lịch hẹn hôm nay
              </Text>
            </View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(500)}
              style={scrollViewStyle}
            >
              <ScrollView contentContainerStyle={{ paddingHorizontal: 4 }}>
                <View className="flex-col w-full">
                  {getTimes(selectedDate).map((time) => (
                    <View key={time.id} className="w-full p-2">
                      {renderTimeItem({ item: time })}
                    </View>
                  ))}
                </View>
                <Text className="text-center text-3xl text-gray-200 font-pbold">
                  ⦿
                </Text>
              </ScrollView>
            </Animated.View>
          )}
        </>
      )}
    </Animated.View>
  );
};

export default SystemOptionScreen;
