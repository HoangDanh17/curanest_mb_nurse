import { useProvider } from "@/app/provider";
import HeaderBack from "@/components/HeaderBack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { router } from "expo-router"; // Đảm bảo import router

interface Report {
  id: number;
  date: string;
  title: string;
  nurseNote: string;
  customerNote: string;
  time: number;
  numberOfTimes: number;
  nurseRemark?: string;
}

interface ReportAppointmentItemProps {
  report: Report;
  index: number;
  onReportUpdate?: (reportId: number, isCompleted: boolean) => void;
}

const ReportAppointmentItem: React.FC<ReportAppointmentItemProps> = ({
  report,
  index,
  onReportUpdate,
}) => {
  const [nurseRemark, setNurseRemark] = useState<string>(
    report.nurseRemark || ""
  );
  const [isTitleCompleted, setIsTitleCompleted] = useState<boolean>(false);

  useEffect(() => {
    onReportUpdate && onReportUpdate(report.id, isTitleCompleted);
  }, [nurseRemark, isTitleCompleted]);

  return (
    <View className="mb-6">
      <View
        className={`flex-row items-center justify-between p-4 rounded-lg shadow ${
          isTitleCompleted ? "bg-green-500" : "bg-[#64CBDD]"
        }`}
      >
        <Text className="text-white text-lg font-pbold">
          {`${index + 1}. ${report.title}`}
        </Text>
        <TouchableOpacity
          onPress={() => setIsTitleCompleted(!isTitleCompleted)}
          className="w-8 h-8 border-2 rounded flex items-center justify-center bg-white"
        >
          {isTitleCompleted && (
            <Text className="text-green-500 font-pbold">✔</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg shadow p-4">
        <View className="flex-row flex-wrap justify-between p-2 gap-4">
          <View className="gap-1">
            <Text className="font-psemibold">Ghi chú của khách hàng: </Text>
            <Text className="text-base text-gray-400 font-pmedium">
              {report.customerNote}
            </Text>
          </View>
          <View className="gap-1">
            <Text className="font-psemibold">Ghi chú của staff: </Text>
            <Text className="text-base text-gray-400 font-pmedium">
              {report.nurseNote}
            </Text>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between p-2">
          <View>
            <Text className="text-base text-gray-400 font-pmedium">
              <Text className="font-psemibold text-gray-800">Thời gian: </Text>
              {report.time} phút
            </Text>
          </View>
          <View>
            <Text className="text-base text-gray-400 font-pmedium">
              <Text className="font-psemibold text-gray-800">Số lần: </Text>
              {report.numberOfTimes}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const ReportAppointment: React.FC = () => {
  const { isFinish, setIsFinish } = useProvider();

  const reports: Report[] = [
    {
      id: 1,
      date: "08/03/2025",
      title: "Chăm sóc trẻ em",
      nurseNote: "Điều dưỡng ghi chú: Kiểm tra nhiệt độ định kỳ.",
      customerNote: "Khách hàng báo nhiệt độ ổn định.",
      time: 5,
      numberOfTimes: 1,
      nurseRemark: "",
    },
    {
      id: 2,
      date: "09/03/2025",
      title: "Chăm sóc người cao tuổi",
      nurseNote: "Điều dưỡng ghi chú: Theo dõi huyết áp định kỳ.",
      customerNote: "Khách hàng cảm thấy tốt.",
      time: 10,
      numberOfTimes: 1,
      nurseRemark: "",
    },
    {
      id: 3,
      date: "10/03/2025",
      title: "Chăm sóc bệnh nhân",
      nurseNote: "Điều dưỡng ghi chú: Đo nhiệt độ và ghi nhận triệu chứng.",
      customerNote: "Khách hàng cho biết cảm giác ổn định.",
      time: 5,
      numberOfTimes: 2,
      nurseRemark: "",
    },
  ];

  const [reportCompletion, setReportCompletion] = useState<
    Record<number, boolean>
  >({});

  const handleReportUpdate = (reportId: number, isCompleted: boolean) => {
    setReportCompletion((prev) => {
      const newCompletion = { ...prev, [reportId]: isCompleted };

      const allCompleted = reports.every(
        (report) => newCompletion[report.id] === true
      );

      setIsFinish(allCompleted);

      return newCompletion;
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={reports}
        ListHeaderComponent={
          <View className="m-4 ml-0 mt-2">
            <HeaderBack />
          </View>
        }
        ListFooterComponent={
          <View className="flex-row justify-end mb-6">
            <TouchableOpacity
              className="px-6 py-3 bg-[#64CBDD] rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white font-pmedium">Quay lại</Text>
            </TouchableOpacity>
          </View>
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ReportAppointmentItem
            report={item}
            index={index}
            onReportUpdate={handleReportUpdate}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default ReportAppointment;