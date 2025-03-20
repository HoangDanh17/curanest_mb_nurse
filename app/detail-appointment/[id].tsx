import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/components/HeaderBack";
import { router } from "expo-router";

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

  const statusStyle = getStatusStyle(status);

  const patient = {
    id: "01958161-2764-76ee-8f92-053330957f6f",
    fullName: "Lê Mai Đào",
    dob: "1931-09-14",
    phoneNumber: "0950485968",
    address: "64 Đường Hoa Mai",
    ward: "Phường 2",
    district: "Quận Phú Nhuận",
    city: "Hồ Chí Minh",
    descPathology: "Đau mỏi đầu gối, khó khăn trong việc di chuyển",
    noteForNurse: "Cần người dìu dắt trong việc đi lại",
  };

  const servicePackages = [
    {
      name: "Chăm sóc sức khỏe tại nhà",
      services: [
        {
          id: 1,
          name: "Chăm sóc bệnh nhân tại nhà",
          price: 200000,
          type: "basic",
          duration: 60,
          unit: 1,
        },
        {
          id: 2,
          name: "Chăm sóc sau phẫu thuật",
          price: 250000,
          type: "premium",
          duration: 90,
          unit: 2,
        },
        {
          id: 3,
          name: "Chăm sóc người cao tuổi",
          price: 180000,
          type: "basic",
          duration: 120,
          unit: 3,
        },
      ],
    },
  ];

  // Tính tổng số tiền và tổng thời gian của tất cả các dịch vụ trong gói
  const totalPrice = servicePackages.reduce(
    (sum, pkg) =>
      sum + pkg.services.reduce((pkgSum, service) => pkgSum + service.price, 0),
    0
  );

  const totalDuration = servicePackages.reduce(
    (sum, pkg) =>
      sum + pkg.services.reduce((pkgSum, service) => pkgSum + service.duration, 0),
    0
  );

  return (
    <SafeAreaView>
      <ScrollView className="bg-white h-full p-4">
        <HeaderBack />

        {/* Thông tin bệnh nhân */}
        <View className="mt-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin bệnh nhân
          </Text>
          <View className="space-y-4 gap-4">
            {/* Họ và tên */}
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Họ và tên:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.fullName}
              </Text>
            </View>
            {/* Ngày sinh */}
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Ngày sinh:</Text>
              <Text className="text-gray-500 font-pmedium break-words">{patient.dob}</Text>
            </View>
            {/* Số điện thoại */}
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Số điện thoại:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.phoneNumber}
              </Text>
            </View>
            {/* Địa chỉ */}
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Địa chỉ:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.address}, {patient.ward}, {patient.district}, {patient.city}
              </Text>
            </View>
            {/* Mô tả bệnh lý */}
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Mô tả bệnh lý:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.descPathology}
              </Text>
            </View>
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Ghi chú cho điều dưỡng:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.noteForNurse}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin lịch hẹn - 04/01/2025
          </Text>
          <View className="space-y-4 gap-4">
            {/* Thời gian */}
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Thời gian:</Text>
              <Text className="text-gray-500 font-pmedium break-words">8:00 - 9:00</Text>
            </View>
            {/* Trạng thái */}
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Trạng thái:</Text>
              <View className={`px-3 py-1 ${statusStyle.backgroundColor} rounded-full`}>
                <Text className={`${statusStyle.textColor} font-pmedium break-words`}>
                  {statusStyle.text}
                </Text>
              </View>
            </View>

            {servicePackages.map((pkg, index) => (
              <View key={index}>
                <View className="flex-col justify-between ">
                  <Text className="font-psemibold text-gray-700">Gói dịch vụ:</Text>
                  <Text className="text-blue-800 font-psemibold break-words">
                    {pkg.name}
                  </Text>
                </View>
                <View className="mt-2">
                  {pkg.services.map((service) => (
                    <View key={service.id} className="p-3 border-b border-gray-200">
                      <Text className="text-gray-700 font-pmedium break-words">
                        {service.name}
                      </Text>
                      <Text className="text-gray-500 break-words">
                        Giá: {service.price.toLocaleString()} VND
                      </Text>
                      <View className="flex-row flex-wrap justify-between">
                        <Text className="text-gray-500 break-words">
                          Thời gian: {service.duration} phút
                        </Text>
                        <Text className="text-gray-500 break-words">
                          x{service.unit} lần
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Tổng cộng */}
            <View className="mt-4">
              <Text className="font-psemibold text-gray-700">
                Tổng chi phí:{" "}
                <Text className="text-blue-600 break-words">
                  {totalPrice.toLocaleString()} VND
                </Text>
              </Text>
              <Text className="font-psemibold text-gray-700">
                Tổng thời gian:{" "}
                <Text className="text-blue-600 break-words">
                  {totalDuration} phút
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Nút Báo Cáo */}
        <View className="mt-6 mb-20">
        <TouchableOpacity
            className="flex-1 px-6 py-4 bg-[#64CBDB] rounded-lg"
            onPress={() => router.push("/report-appointment/[id]")}
          >
            <Text className="text-white font-pmedium text-center break-words items-center">
            📋 Báo cáo tiến trình task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailAppointmentScreen;
