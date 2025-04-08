import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/components/HeaderBack";
import { router } from "expo-router";
import { useProvider } from "@/app/provider";

const DetailAppointmentScreen = () => {
  const { isFinish } = useProvider();
  const [reportText, setReportText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State cho modal

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

  const totalPrice = servicePackages.reduce(
    (sum, pkg) =>
      sum + pkg.services.reduce((pkgSum, service) => pkgSum + service.price, 0),
    0
  );

  const totalDuration = servicePackages.reduce(
    (sum, pkg) =>
      sum +
      pkg.services.reduce((pkgSum, service) => pkgSum + service.duration, 0),
    0
  );

  // Hàm xử lý khi nhấn nút Submit (Xác nhận hoàn thành)
  const handleSubmitReport = () => {
    setIsModalVisible(true); // Hiển thị modal xác nhận
  };

  // Hàm xác nhận trong modal
  const confirmSubmit = () => {
    console.log("Báo cáo đã được gửi:", reportText);
    setReportText(""); // Reset ô input sau khi xác nhận
    setIsModalVisible(false); // Đóng modal
    // Bạn có thể thêm logic gửi báo cáo lên server ở đây
  };

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
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Họ và tên:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.fullName}
              </Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Ngày sinh:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.dob}
              </Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Số điện thoại:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.phoneNumber}
              </Text>
            </View>
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Địa chỉ:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patient.address}, {patient.ward}, {patient.district}, {patient.city}
              </Text>
            </View>
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
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Thời gian:</Text>
              <Text className="text-gray-500 font-pmedium break-words">8:00 - 9:00</Text>
            </View>
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
                <View className="flex-col justify-between">
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
            className={`flex-1 px-6 py-4 rounded-lg ${
              isFinish ? "bg-green-500" : "bg-[#64CBDB]"
            }`}
            onPress={() => router.push("/report-appointment/[id]")}
          >
            <Text className="text-white font-pmedium text-center break-words items-center">
              📋 Báo cáo tiến trình task
            </Text>
          </TouchableOpacity>

          {isFinish && (
            <View className="mt-6">
              <Text className="text-lg font-psemibold text-gray-700 mb-2">
                Báo cáo
              </Text>
              <TextInput
                placeholder="Nhập nội dung báo cáo..."
                value={reportText}
                onChangeText={setReportText}
                multiline
                numberOfLines={4}
                className="border rounded-lg p-2 mt-2 h-32 font-psemibold text-gray-500"
                style={{ textAlignVertical: "top", textAlign: "left" }}
              />
              <TouchableOpacity
                className="mt-4 px-6 py-4 bg-green-400 rounded-lg"
                onPress={handleSubmitReport}
              >
                <Text className="text-white font-pbold text-center">
                  ✔ Xác nhận hoàn thành
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-800/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-psemibold text-gray-800 mb-4 text-center">
              Xác nhận hoàn thành báo cáo
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Bạn có chắc chắn muốn gửi báo cáo này không?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg mr-2"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-gray-800 font-pmedium text-center">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 px-4 py-2 bg-green-500 rounded-lg ml-2"
                onPress={confirmSubmit}
              >
                <Text className="text-white font-pmedium text-center">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DetailAppointmentScreen;