import HeaderBack from "@/components/HeaderBack";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";
import appointmentApiRequest from "@/app/api/appointmentApi";

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
  isTaskLocked: boolean;
  lockTask: (reportId: string) => void;
}

const ReportAppointmentItem: React.FC<ReportAppointmentItemProps> = ({
  report,
  index,
  onReportUpdate,
  isPreviousTasksCompleted,
  isTaskLocked,
  lockTask,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(
    report.status === "done"
  );

  const handleToggleComplete = async () => {
    if (isTaskLocked && isCompleted) {
      Toast.show({
        type: "warning",
        text1: "Cảnh báo",
        text2: "Nhiệm vụ này đã hoàn thành và không thể bỏ chọn!",
      });
      return;
    }

    if (!isPreviousTasksCompleted && !isCompleted) {
      Toast.show({
        type: "warning",
        text1: "Cảnh báo",
        text2: "Bạn phải hoàn thành các nhiệm vụ theo thứ tự từ trên xuống!",
      });
      return;
    }

    const newValue = !isCompleted;
    if (newValue) {
      try {
        const result = await appointmentApiRequest.checkTaskDone(report.id);
        if (result) {
          setIsCompleted(newValue);
          onReportUpdate(report.id, newValue);
          lockTask(report.id);
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: `Nhiệm vụ "${report.title}" đã được hoàn thành!`,
          });
        } else {
          throw new Error("API call failed");
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể hoàn thành nhiệm vụ. Vui lòng thử lại!",
        });
      }
    } else {
      setIsCompleted(newValue);
      onReportUpdate(report.id, newValue);
    }
  };

  return (
    <View className="mb-6">
      <View
        className={`flex-row items-center justify-between p-4 rounded-lg shadow ${
          isCompleted ? "bg-green-500" : "bg-[#64CBDD]"
        }`}
      >
        <View className="flex-1 mr-3">
          <Text className="text-white text-lg font-pbold flex-wrap">
            {`${index + 1}. ${report.title}`}
          </Text>
        </View>
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

  const [lockedTasks, setLockedTasks] = useState<Set<string>>(
    new Set(
      reports
        .filter((report) => report.status === "done")
        .map((report) => report.id)
    )
  );

  const handleReportUpdate = (reportId: string, isCompleted: boolean) => {
    setReportCompletion((prev) => ({
      ...prev,
      [reportId]: isCompleted,
    }));
  };

  const lockTask = (reportId: string) => {
    setLockedTasks((prev) => new Set([...prev, reportId]));
  };

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
            isTaskLocked={lockedTasks.has(item.id)}
            lockTask={lockTask}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default ReportAppointment;
