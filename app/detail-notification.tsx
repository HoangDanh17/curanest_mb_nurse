import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { RelativePathString, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderBack from "@/components/HeaderBack";
import { useProvider } from "@/app/provider";
import { NotiListType } from "@/types/noti";
import notiApiRequest from "@/app/api/notiApi";

const NotificationsScreen = () => {
  const { userData } = useProvider();
  const [notiList, setNotiList] = useState<NotiListType[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchNoti() {
    try {
      setLoading(true);
      const response = await notiApiRequest.getNotiList(String(userData?.id));
      setNotiList(response.payload.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (id: string, route: RelativePathString) => {
    try {
      await notiApiRequest.updateNoti(id);
      setNotiList((prev) =>
        prev.map((noti) =>
          noti.id === id
            ? { ...noti, "read-at": new Date().toISOString() }
            : noti
        )
      );
      if (route) {
        router.push(route);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderNotificationItem = ({ item }: { item: NotiListType }) => {
    return (
      <Pressable
        onPress={() => markAsRead(item.id, item.route)}
        className="mx-4 my-2 p-4 bg-white rounded-lg shadow-md flex-row items-center"
      >
        <View className="mr-4">
          <Ionicons
            name={item["read-at"] ? "mail-open-outline" : "mail-outline"}
            size={24}
            color={item["read-at"] ? "#6B7280" : "#374151"}
          />
        </View>
        <View className="flex-1">
          <View className="flex-col justify-start ">
            <Text
              className={`text-lg font-pbold ${
                item["read-at"] ? "text-gray-500" : "text-gray-800"
              }`}
            >
              {"Thông báo"}
            </Text>
            <Text className="text-xs font-psemibold text-gray-400">
              {format(new Date(item["created-at"]), "dd/MM/yyyy")}
            </Text>
          </View>
          <Text
            className={`text-md font-psemibold flex-wrap ${
              item["read-at"] ? "text-gray-400" : "text-gray-600"
            } mt-1`}
          >
            {item.content}
          </Text>
        </View>
      </Pressable>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          await fetchNoti();
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-4 py-4 flex-row items-center">
        <HeaderBack />
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-2xl font-pbold text-teal-400">Thông báo</Text>
        </View>
      </View>
      {notiList.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/023/570/826/small_2x/still-empty-no-notification-yet-concept-illustration-line-icon-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg",
            }}
            className="w-full h-64"
            resizeMode="contain"
          />
          <Text className="text-lg font-psemibold text-gray-500 mt-4">
            Không có thông báo nào
          </Text>
        </View>
      ) : (
        <FlatList
          data={notiList}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          removeClippedSubviews={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={() => (
            <Text className="text-center text-3xl text-gray-200 font-pbold">
              ⦿
            </Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
