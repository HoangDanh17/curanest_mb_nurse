import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/components/HeaderBack";

const DetailAppointmentScreen = () => {
  const services = ["Khám tổng quát", "Xét nghiệm máu", "Chụp X-quang"];
  const status = "in_progress";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          backgroundColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          text: "Sắp diễn ra",
        };
      case "in_progress":
        return {
          backgroundColor: "bg-blue-100",
          textColor: "text-blue-800",
          text: "Đang thực hiện",
        };
      case "finish":
        return {
          backgroundColor: "bg-green-100",
          textColor: "text-green-800",
          text: "Hoàn thành",
        };
      default:
        return {
          backgroundColor: "bg-gray-100",
          textColor: "text-gray-800",
          text: "Không xác định",
        };
    }
  };

  const serviceColors = [
    { backgroundColor: "bg-blue-100", textColor: "text-blue-800" },
    { backgroundColor: "bg-green-100", textColor: "text-green-800" },
    { backgroundColor: "bg-yellow-100", textColor: "text-yellow-800" },
    { backgroundColor: "bg-purple-100", textColor: "text-purple-800" },
    { backgroundColor: "bg-pink-100", textColor: "text-pink-800" },
    { backgroundColor: "bg-indigo-100", textColor: "text-indigo-800" },
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * serviceColors.length);
    return serviceColors[randomIndex];
  };
  const statusStyle = getStatusStyle(status);

  const patients = [
    {
      name: "Nguyễn Văn A",
      time: "04/01/2025",
      note: "Uống đủ nước mỗi ngày để duy trì sức khỏe tốt.",
    },
    {
      name: "Nguyễn Văn B",
      time: "07/01/2025",
      note: "Hạn chế thức khuya và ngủ đủ 7-8 tiếng mỗi đêm.",
    },
    {
      name: "Nguyễn Văn C",
      time: "08/01/2025",
      note: "Kiểm tra sức khỏe định kỳ 6 tháng một lần.",
    },
  ];

  const certificates = [
    "Chứng chỉ hành nghề điều dưỡng",
    "Chứng chỉ CPR",
    "Chứng chỉ ACLS",
    "Chứng chỉ PALS",
  ];

  return (
    <SafeAreaView>
      <ScrollView className="bg-white h-full p-4">
        <HeaderBack />
        <View className="flex-1 items-center">
          <Image
            source={{
              uri: "https://images.careerviet.vn/content/images/dieu-duong-vien-lam-cong-viec-gi-nhung-ky-nang-can-trang-bi-careerbuilder.png",
            }}
            className="w-36 h-36 border-4 border-gray-200"
            borderRadius={99999}
          />
          <View className="top-[-20] bg-white border-2 border-gray-200  shadow-lg px-4 py-1 rounded-xl">
            <Text className="text-center font-pbold text-xs">4.5 🌟</Text>
          </View>
        </View>

        <View className="mt-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin điều dưỡng
          </Text>
          <View className="space-y-4 gap-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Tên:</Text>
              <Text className="text-gray-500 font-pmedium">Nguyễn Thị A</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">
                Sô điện thoại:
              </Text>
              <Text className="text-gray-500 font-pmedium">098654752</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Kinh nghiệm:</Text>
              <Text className="text-gray-500 font-pmedium">10 năm</Text>
            </View>
            <View className="flex-col pb-2">
              <Text className="font-psemibold text-gray-700">
                Các chứng chỉ:
              </Text>
              <View className="flex-col gap-2 p-2">
                {certificates.map((certificate, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-gray-100 p-2 rounded-lg"
                  >
                    <Text className="text-gray-500 font-pmedium">
                      {certificate}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin lịch hẹn - 04/01/2025
          </Text>
          <View className="space-y-4 gap-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Thời gian:</Text>
              <Text className="text-gray-500 font-pmedium">8:00 - 9:00</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Trạng thái:</Text>
              <View
                className={`px-3 py-1 ${statusStyle.backgroundColor} rounded-full`}
              >
                <Text className={`${statusStyle.textColor} font-pmedium`}>
                  {statusStyle.text}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">
                Tổng số tiền:
              </Text>
              <Text className="text-gray-500 font-pmedium">900,000 VND</Text>
            </View>
            <View className="flex-col">
              <Text className="font-psemibold text-gray-700 mb-2">
                Dịch vụ đã đăng ký:
              </Text>
              <View className="flex-row flex-wrap gap-2 p-2">
                {services.map((service, index) => {
                  const color = getRandomColor();
                  return (
                    <View
                      key={index}
                      className={`px-3 py-1 ${color.backgroundColor} rounded-full`}
                    >
                      <Text className={`${color.textColor} font-pmedium`}>
                        {service}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6 p-6 rounded-2xl ">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 ">
            Các lưu ý từ điều dưỡng
          </Text>
          <View className="space-y-4 gap-4">
            {patients.map((patient, index) => (
              <View
                key={index}
                className="bg-teal-100 pb-4 flex flex-col gap-2 p-4 rounded-xl"
              >
                <View className="flex flex-row justify-start items-center border-b-2 gap-2">
                  <Image
                    source={{
                      uri: "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png",
                    }}
                    className="w-14 h-14 rounded-full mr-2 mb-2"
                  />
                  <View className="flex flex-col mb-2">
                    <Text className="font-psemibold text-gray-700">
                      {patient.name}
                    </Text>
                    <Text className="text-gray-500 font-pmedium">
                      {patient.time}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 font-pmedium">
                  {patient.note}
                </Text>
              </View>
            ))}
            <Pressable className="mt-4">
              <Text className=" text-center font-psemibold color-slate-400">
                Tải thêm
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="absolute bottom-12 right-4 flex flex-row gap-4">
          <TouchableOpacity className="px-6 py-2 bg-red-50 rounded-lg">
            <Text className="text-gray-700 font-pmedium">Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-6 py-2 bg-green-400 rounded-lg">
            <Text className="text-white font-pmedium">Xác nhận hoàn thành</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-36"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailAppointmentScreen;
