import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import MenuItem from "@/components/MenuItem";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

const ProfileScreen = () => {
  return (
    <ScrollView className="bg-white">
      <View className="p-4 flex-1">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">Danh Tăng</Text>
            <Text className="text-gray-500">Tài khoản cá nhân</Text>
          </View>
          <Image
            source={{
              uri: "https://pantravel.vn/wp-content/uploads/2023/11/ngon-nui-thieng-cua-nhat-ban.jpg",
            }}
            className="w-20 h-20 rounded-full"
          />
        </View>

        <View className="mt-6 gap-6">
          <MenuItem
            iconName="person"
            title="Hồ sơ"
            handlePress={() => router.push("/(profile)/nurse-profile")}
          />
          <MenuItem
            iconName="attach-money"
            title="Lương thưởng và hoa hồng"
            handlePress={() => router.push("/(profile)/payroll")}
          />
          <MenuItem iconName="event-note" title="Lịch sử nghỉ phép" />
          <MenuItem
            iconName="event"
            title="Lịch sử lịch hẹn"
            handlePress={() => router.push("/(profile)/appointment-history")}
          />
          <MenuItem
            iconName="star"
            title="Đánh giá người dùng"
            handlePress={() => router.push("/(profile)/feedback")}
          />
        </View>

        <View className="mt-12 p-4 border border-gray-300 rounded-2xl">
          <TouchableOpacity className="flex flex-row items-center justify-between w-full p-3">
            <View className="flex flex-row items-center gap-2">
              <Entypo
                name="log-out"
                size={24}
                color="red"
                className="bg-red-100 rounded-full p-2"
              />
              <Text className="ml-2 font-pbold text-red-600">Đăng xuất</Text>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
