import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/components/HeaderBack";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useProvider } from "@/app/provider";
import { AppointmentDetail } from "@/types/appointment";
import appointmentApiRequest from "@/app/api/appointmentApi";
import { addMinutes, format } from "date-fns";
import { Patient } from "@/types/patient";
import patientApiRequest from "@/app/api/patientApi";

const DetailAppointmentScreen = () => {
  const { isFinish } = useProvider();
  const { id, packageId, patientId, date, status } = useLocalSearchParams();
  const [reportText, setReportText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<AppointmentDetail>();
  const [patientList, setPatientList] = useState<Patient>();

  async function fetchPatientList() {
    try {
      const response = await patientApiRequest.getPatient(String(patientId));
      setPatientList(response.payload.data);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }

  async function fetchAppointmentDetail() {
    try {
      const response = await appointmentApiRequest.getAppointmentDetail(
        String(packageId),
        String(date)
      );
      setAppointments(response.payload.data);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAppointmentDetail();
      if (patientId) {
        fetchPatientList();
      }
    }, [])
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          backgroundColor: "bg-amber-100",
          textColor: "text-amber-800",
          text: "Sắp tới",
        };
      case "confirmed":
        return {
          backgroundColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          text: "Đã xác nhận",
        };
      case "success":
        return {
          backgroundColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          text: "Hoàn thành",
        };
      case "waiting":
        return {
          backgroundColor: "bg-red-100",
          textColor: "text-red-800",
          text: "Chờ xác nhận",
        };
      default:
        return {
          backgroundColor: "bg-gray-100",
          textColor: "text-gray-800",
          text: "Không xác định",
        };
    }
  };

  const statusStyle = getStatusStyle(String(status));
  const formattedDate = format(new Date(String(date)), "dd/MM/yyyy");
  const formattedTime = format(new Date(String(date)), "hh:mm a");
  const totalDuration = appointments?.tasks
    ? appointments.tasks.reduce((sum, task) => sum + task["est-duration"], 0)
    : 0;

  const calculateEndTime = () => {
    const endTime = addMinutes(String(date), totalDuration);
    return format(endTime, "HH:mm a");
  };

  const handleSubmitReport = () => {
    setIsModalVisible(true);
  };

  const confirmSubmit = () => {
    setReportText("");
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView className="bg-white p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBack />

        <View className="mt-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin bệnh nhân
          </Text>
          <View className="space-y-4 gap-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Họ và tên:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.["full-name"]}
              </Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Ngày sinh:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.dob
                  ? format(new Date(patientList.dob), "dd/MM/yyyy")
                  : "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">
                Số điện thoại:
              </Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.["phone-number"]}
              </Text>
            </View>
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Địa chỉ:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.address}, {patientList?.ward},{" "}
                {patientList?.district}, {patientList?.city}
              </Text>
            </View>
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">
                Mô tả bệnh lý:
              </Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.["desc-pathology"]}
              </Text>
            </View>
            <View className="flex-col border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">
                Ghi chú cho điều dưỡng:
              </Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {patientList?.["note-for-nurse"]}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Text className="text-xl font-psemibold mb-4 text-blue-600 text-center">
            Thông tin lịch hẹn - {formattedDate}
          </Text>
          <View className="space-y-4 gap-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Thời gian:</Text>
              <Text className="text-gray-500 font-pmedium break-words">
                {formattedTime} • {calculateEndTime()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Trạng thái:</Text>
              <View
                className={`px-3 py-1 ${statusStyle.backgroundColor} rounded-full`}
              >
                <Text
                  className={`${statusStyle.textColor} font-pmedium break-words`}
                >
                  {statusStyle.text}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="font-psemibold text-gray-700">Thanh toán:</Text>
              <View
                className={`px-3 py-1 ${
                  appointments?.package["payment-status"] === "unpaid"
                    ? "bg-amber-100"
                    : "bg-emerald-100"
                } rounded-full`}
              >
                <Text
                  className={`${
                    appointments?.package["payment-status"] === "unpaid"
                      ? "text-amber-800"
                      : "text-emerald-800"
                  } font-pmedium`}
                >
                  {appointments?.package["payment-status"] === "unpaid"
                    ? "Chưa thanh toán"
                    : "Đã thanh toán"}
                </Text>
              </View>
            </View>
            <View>
              <View className="flex-col justify-between">
                <Text className="font-psemibold text-gray-700">
                  Gói dịch vụ:
                </Text>
                <Text className="text-blue-800 font-psemibold break-words">
                  {appointments?.package.name || "Chưa có dữ liệu"}
                </Text>
              </View>
              <View className="mt-2">
                {appointments?.tasks.map((service, index) => (
                  <View
                    key={service.id}
                    className="p-3 border-b border-gray-200"
                  >
                    <Text className="text-gray-700 font-pbold break-words">
                      {index + 1}. {service.name}
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      <Text className="text-gray-500 break-words">
                        Thời gian: {service["est-duration"]} phút
                      </Text>
                      <Text className="text-gray-500 break-words">
                        x{service["total-unit"]} lần
                      </Text>
                    </View>
                    <Text className="text-gray-500 break-words">
                      Ghi chú: {service["client-note"]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="mt-4">
              <Text className="font-psemibold text-gray-700">
                Tổng chi phí:{" "}
                <Text className="text-blue-600 break-words">
                  {appointments?.package["total-fee"].toLocaleString() || "0"}{" "}
                  VND
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

        <TouchableOpacity
          className={`flex-1 px-6 py-4 mt-4 rounded-lg bg-[#bd4ada]`}
          onPress={() =>
            router.push({
              pathname: "/report-appointment/[id]",
              params: {
                id: String(id),
                listTask: JSON.stringify(appointments?.tasks),
              },
            })
          }
        >
          <Text className="text-white font-pmedium text-center break-words items-center">
            Bắt đầu đến điểm hẹn
          </Text>
        </TouchableOpacity>

        <View className="mt-6 mb-20">
          <TouchableOpacity
            className={`flex-1 px-6 py-4 rounded-lg ${
              isFinish ? "bg-green-500" : "bg-[#64CBDB]"
            }`}
            onPress={() =>
              router.push({
                pathname: "/report-appointment/[id]",
                params: {
                  id: String(id),
                  listTask: JSON.stringify(appointments?.tasks),
                },
              })
            }
          >
            <Text className="text-white font-pmedium text-center break-words items-center">
              📋 Báo cáo tiến trình task
            </Text>
          </TouchableOpacity>

          {!isFinish && (
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
