import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/components/HeaderBack";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  AppointmentDetail,
  GetReport,
  StartAppointment,
} from "@/types/appointment";
import appointmentApiRequest from "@/app/api/appointmentApi";
import { addMinutes, format } from "date-fns";
import { Patient } from "@/types/patient";
import patientApiRequest from "@/app/api/patientApi";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { FeedbackType } from "@/types/nurse";
import nurseApiRequest from "@/app/api/nurseApi";
import { Platform } from "react-native";

const DetailAppointmentScreen = () => {
  const { id, packageId, patientId, date, status, locationGPS } =
    useLocalSearchParams();
  const [reportText, setReportText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<AppointmentDetail>();
  const [patientList, setPatientList] = useState<Patient>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [medicalReport, setMedicalReport] = useState<GetReport>();
  const [feedbackData, setFeedbackData] = useState<FeedbackType | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false);

  const areAllTasksDone = () => {
    if (!appointments?.tasks || appointments.tasks.length === 0) {
      return false;
    }
    return appointments.tasks.every((task) => task.status === "done");
  };

  async function fetchPatientList() {
    try {
      const response = await patientApiRequest.getPatient(String(patientId));
      setPatientList(response.payload.data);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }

  async function fetchMedicalRecord() {
    try {
      const response = await appointmentApiRequest.getMedicalReport(String(id));
      setMedicalReport(response.payload.data);
    } catch (error) {}
  }

  async function fetchAppointmentDetail() {
    try {
      const response = await appointmentApiRequest.getAppointmentDetail(
        String(packageId),
        String(date)
      );
      setAppointments(response.payload.data);
    } catch (error) {
      console.error("Error fetching appointment detail:", error);
    }
  }

  async function fetchFeedback(medicalId: string) {
    try {
      setIsFeedbackLoading(true);
      const response = await nurseApiRequest.getFeedback(medicalId);
      const data = response.payload.data;
      if (Object.keys(data).length === 0) {
        setFeedbackData(null);
      } else {
        setFeedbackData(data);
      }
    } catch (error) {
      setFeedbackData(null);
    } finally {
      setIsFeedbackLoading(false);
    }
  }

  const fetchLocation = async () => {
    try {
      setIsLoading(true);

      let body: StartAppointment = {
        "appointment-id": String(id),
      };
      const result = await appointmentApiRequest.startAppointment(body);

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã bắt đầu đến điểm hẹn!",
        position: "top",
      });

      await fetchAppointmentDetail();
      if (patientId) {
        await fetchPatientList();
      }
      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể lấy vị trí hoặc bắt đầu lịch hẹn!",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointmentDetail();
      fetchMedicalRecord();
      if (patientId) {
        fetchPatientList();
      }
      if (status === "success" && medicalReport?.id) {
        fetchFeedback(String(medicalReport.id));
      }
    }, [patientId, packageId, date, status, medicalReport?.id])
  );

  const handleStartAppointment = () => {
    // const currentDate = format(new Date(), "dd/MM/yyyy");
    // const appointmentDate = format(new Date(String(date)), "dd/MM/yyyy");

    // if (currentDate !== appointmentDate) {
    //   Toast.show({
    //     type: "warning",
    //     text1: "Lỗi",
    //     text2: "Chỉ có thể bắt đầu lịch hẹn vào đúng ngày đã đặt!",
    //     position: "top",
    //   });
    //   return;
    // }

    fetchLocation();
  };

  const handleOpenGoogleMaps = async () => {
    try {
      if (!locationGPS) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không có thông tin vị trí điểm đến!",
          position: "top",
        });
        return;
      }

      const [destLat, destLng] = String(locationGPS)
        .split(",")
        .map((coord: any) => parseFloat(coord.trim()));

      if (isNaN(destLat) || isNaN(destLng)) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Định dạng vị trí điểm đến không hợp lệ!",
          position: "top",
        });
        return;
      }

      const url = Platform.select({
        ios: `comgooglemaps://?daddr=${destLat},${destLng}&directionsmode=driving`,
        android: `google.navigation:q=${destLat},${destLng}&mode=d`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`,
      });

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`
        );
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể mở Google Maps!",
        position: "top",
      });
      console.error("Error opening Google Maps:", error);
    }
  };

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
    const endTime = addMinutes(new Date(String(date)), totalDuration);
    return format(endTime, "hh:mm a");
  };

  const handleSubmitReport = () => {
    if (!areAllTasksDone()) {
      Toast.show({
        type: "info",
        text1: "Thông báo",
        text2: "Vui lòng hoàn thành tất cả các nhiệm vụ trước khi gửi báo cáo!",
        position: "top",
      });
      return;
    }
    setIsModalVisible(true);
  };

  const confirmSubmit = async () => {
    setIsModalVisible(false);
    try {
      const body = { "nursing-report": reportText };
      await appointmentApiRequest.submitMedicalReport(
        String(medicalReport?.id),
        body
      );
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Báo cáo đã được gửi!",
        position: "top",
      });
      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể gửi báo cáo!",
        position: "top",
      });
    }
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
                    : ""
                } rounded-full`}
              >
                <Text
                  className={`${
                    appointments?.package["payment-status"] === "unpaid"
                      ? "text-amber-800"
                      : "text-emerald-400"
                  } font-pmedium`}
                >
                  {appointments?.package["payment-status"] === "unpaid"
                    ? "Chưa thanh toán"
                    : "✓ Đã thanh toán"}
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
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 break-words">
                        Trạng thái:{" "}
                        {service.status === "done"
                          ? "Hoàn thành"
                          : "Chưa hoàn thành"}
                      </Text>
                      {service.status === "done" && (
                        <Text className="ml-2 text-green-500">✔</Text>
                      )}
                    </View>
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

        <View className="flex-1">
          {status === "confirmed" &&
            appointments?.package["payment-status"] === "paid" && (
              <TouchableOpacity
                className={`flex-1 py-4 mt-4 rounded-lg bg-[#bd4ada] items-center justify-center ${
                  isLoading ? "opacity-50" : ""
                }`}
                onPress={handleStartAppointment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white font-pmedium">
                    Bắt đầu đến điểm hẹn
                  </Text>
                )}
              </TouchableOpacity>
            )}

          {status !== "confirmed" && (
            <TouchableOpacity
              className="flex-1 px-auto py-4 mt-4 rounded-lg bg-[#74b2f1] items-center"
              onPress={handleOpenGoogleMaps}
            >
              <Text className="text-white font-pmedium">📍 Map</Text>
            </TouchableOpacity>
          )}

          <View className="mt-6 mb-20">
            {status !== "confirmed" && (
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg justify-center items-center ${
                  areAllTasksDone() ? "bg-green-400" : "bg-[#64CBDB]"
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
                <Text className="text-white font-pmedium">
                  📋 Báo cáo tiến trình task
                </Text>
              </TouchableOpacity>
            )}

            {status !== "confirmed" && (
              <View className="mt-6">
                <View className="flex-row items-center mb-4 gap-2">
                  <Text className="text-xl font-psemibold text-gray-700">
                    Báo cáo -
                  </Text>
                  {medicalReport?.["nursing-report"] &&
                    medicalReport.status !== "done" && (
                      <View className="bg-amber-100 rounded-2xl px-4 py-2">
                        <Text className="text-amber-500 font-psemibold">
                          Đợi staff xác nhận
                        </Text>
                      </View>
                    )}
                  {medicalReport?.["nursing-report"] &&
                    medicalReport.status === "done" && (
                      <View className="bg-emerald-100 rounded-2xl px-4 py-2">
                        <Text className="text-emerald-500 font-psemibold">
                          Hoàn thành
                        </Text>
                      </View>
                    )}
                </View>
                {!appointments?.tasks || appointments.tasks.length === 0 ? (
                  <Text className="text-gray-500 text-center">
                    Không có nhiệm vụ nào để báo cáo.
                  </Text>
                ) : medicalReport?.["nursing-report"] ? (
                  <View>
                    <Text className="text-gray-500 font-pmedium break-words border rounded-lg p-2">
                      {medicalReport["nursing-report"]}
                    </Text>
                    {status === "success" && (
                      <View className="mt-4">
                        {isFeedbackLoading ? (
                          <ActivityIndicator size="small" color="#64CBDB" />
                        ) : feedbackData ? (
                          <View className="p-4 bg-gray-100 rounded-lg">
                            <Text className="text-lg font-psemibold text-gray-700 mb-2">
                              Đánh giá của bệnh nhân
                            </Text>
                            <View className="flex-row mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Ionicons
                                  key={i}
                                  name={
                                    i < parseInt(feedbackData.star)
                                      ? "star"
                                      : "star-outline"
                                  }
                                  size={20}
                                  color={
                                    i < parseInt(feedbackData.star)
                                      ? "#FFD700"
                                      : "#A0A0A0"
                                  }
                                />
                              ))}
                            </View>
                            <Text className="text-gray-600 font-pmedium">
                              {feedbackData.content ||
                                "Không có nội dung phản hồi"}
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-gray-500 font-pmedium">
                            Không có đánh giá từ bệnh nhân.
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <>
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
                      className={`mt-4 px-6 py-4 rounded-lg ${
                        areAllTasksDone() ? "bg-emerald-400" : "bg-teal-400"
                      }`}
                      onPress={handleSubmitReport}
                      disabled={!areAllTasksDone()}
                    >
                      <Text
                        className={`${
                          areAllTasksDone() ? "text-white" : "text-white"
                        } font-pbold text-center`}
                      >
                        ✔ Xác nhận hoàn thành
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
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
                <Text className="text-gray-800 font-pmedium izol-text-center">
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
