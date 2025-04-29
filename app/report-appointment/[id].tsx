import HeaderBack from "@/components/HeaderBack";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";

interface Report {
  id: string;
  date: string;
  title: string;
  nurseNote: string;
  customerNote: string;
  time: number;
  numberOfTimes: number;
  status: "done" | "not_done";
  taskOrder: number;
}

interface ReportAppointmentItemProps {
  report: Report;
  index: number;
  onReportUpdate: (reportId: string, isCompleted: boolean) => void;
  isPreviousTasksCompleted: boolean;
}

const ReportAppointmentItem: React.FC<ReportAppointmentItemProps> = ({
  report,
  index,
  onReportUpdate,
  isPreviousTasksCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(
    report.status === "done"
  );

  const handleToggleComplete = () => {
    if (!isPreviousTasksCompleted && !isCompleted) {
      Toast.show({
        type: "warning",
        text1: "Cảnh báo",
        text2: "Bạn phải hoàn thành các nhiệm vụ theo thứ tự từ trên xuống!",
      });
      return;
    }

    setIsCompleted((prev) => {
      const newValue = !prev;
      onReportUpdate(report.id, newValue);
      return newValue;
    });
  };

  return (
    <View className="mb-6">
      <View
        className={`flex-row items-center justify-between p-4 rounded-lg shadow ${
          isCompleted ? "bg-green-500" : "bg-[#64CBDD]"
        }`}
      >
        <Text className="text-white text-lg font-pbold">
          {`${index + 1}. ${report.title}`}
        </Text>
        <TouchableOpacity
          onPress={handleToggleComplete}
          className="w-8 h-8 border-2 rounded flex items-center justify-center bg-white"
        >
          {isCompleted && <Text className="text-green-500 font-pbold">✔</Text>}
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
  const { listTask } = useLocalSearchParams();
  const parsedlistTask: any[] = listTask ? JSON.parse(String(listTask)) : [];

  // Map and sort tasks by task-order
  const reports: Report[] = parsedlistTask
    .map((task) => ({
      id: task.id,
      date: format(new Date(task["est-date"]), "dd/MM/yyyy"),
      title: task.name,
      nurseNote: task["staff-advice"] || "Chưa có ghi chú",
      customerNote: task["client-note"] || "Chưa có ghi chú",
      time: task["est-duration"],
      numberOfTimes: task["total-unit"],
      status: task.status as "done" | "not_done",
      taskOrder: task["task-order"],
    }))
    .sort((a, b) => a.taskOrder - b.taskOrder);

  const [reportCompletion, setReportCompletion] = useState<
    Record<string, boolean>
  >(
    reports.reduce((acc, report) => {
      acc[report.id] = report.status === "done";
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleReportUpdate = (reportId: string, isCompleted: boolean) => {
    setReportCompletion((prev) => ({
      ...prev,
      [reportId]: isCompleted,
    }));
  };

  // Check if previous tasks are completed for a given index
  const isPreviousTasksCompleted = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (!reportCompletion[reports[i].id]) {
        return false;
      }
    }
    return true;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={reports}
        removeClippedSubviews={false}
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
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReportAppointmentItem
            report={item}
            index={index}
            onReportUpdate={handleReportUpdate}
            isPreviousTasksCompleted={isPreviousTasksCompleted(index)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <Toast config={toastConfig} />
    </View>
  );
};

export default ReportAppointment;