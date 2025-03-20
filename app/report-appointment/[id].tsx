import HeaderBack from "@/components/HeaderBack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

interface Report {
  id: number;
  date: string;
  title: string;
  nurseNote: string; // Dummy data: Note của điều dưỡng
  customerNote: string; // Dummy data: Note của khách hàng
  time: number; // Dummy data: Thời gian (phút)
  numberOfTimes: number; // Dummy data: Số lần
  nurseRemark?: string; // Lưu ý do điều dưỡng nhập (input)
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

  // Khi nurseRemark hoặc trạng thái checkbox thay đổi, thông báo cho component cha nếu cần
  useEffect(() => {
    onReportUpdate && onReportUpdate(report.id, isTitleCompleted);
  }, [nurseRemark, isTitleCompleted]);

  return (
    <View className="mb-6">
      {/* Header với tiêu đề và checkbox, background thay đổi khi tick */}
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

      {/* Nội dung báo cáo */}
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
        <Text className="font-psemibold ml-2 my-2">
          Ghi chú của điều dưỡng:{" "}
        </Text>
        <TextInput
          value={nurseRemark}
          onChangeText={setNurseRemark}
          style={{ textAlignVertical: "top", textAlign: "left" }}
          placeholder="Nhập lưu ý của điều dưỡng"
          multiline
          className="border border-gray-300  p-2 mt-2 h-24 text-base text-left font-psemibold text-gray-500 rounded-2xl"
        />
      </View>
    </View>
  );
};

const ReportAppointment: React.FC = () => {
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
    setReportCompletion((prev) => ({ ...prev, [reportId]: isCompleted }));
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
