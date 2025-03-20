import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import nurseApiRequest from "@/app/api/nurseApi";
import { NurseProfile } from "@/types/nurse";

const NurseProfileScreen = () => {
  const [nurseData, setNurseData] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchNurseProfile() {
    try {
      const result = await nurseApiRequest.nurseProfile();
      setNurseData(result.payload.data);
    } catch (error) {
      console.error("Error fetching nurse profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNurseProfile();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View className="flex-row py-2 border-b border-gray-200 items-center">
      <View className="w-[40%] flex-row items-center">
        <Text className="text-xs font-pbold text-gray-600">{label}</Text>
      </View>
      <Text className="flex-1 text-xs font-pregular text-gray-800">
        {value}
      </Text>
    </View>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="bg-white/90 rounded-xl my-3 p-4 shadow-sm gap-4">
      <Text className="text-base font-pbold text-gray-800 mb-2">{title}</Text>
      {children}
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#E0F2FE", "#EEF2FF", "#FAF5FF"]}
        className="flex-1 justify-center items-center"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E0F2FE", "#EEF2FF", "#FAF5FF"]}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white/90 rounded-xl shadow-sm overflow-hidden">
          <LinearGradient
            colors={["rgba(240,245,255,0.9)", "rgba(255,255,255,0.8)"]}
            className="items-center p-6 gap-4"
          >
            <View className="rounded-full p-1 bg-white shadow-md">
              <Image
                source={{ uri: nurseData?.["nurse-picture"] }}
                className="w-36 h-36 rounded-full"
              />
            </View>
            <View className="items-center">
              <Text className="text-xl font-pbold text-gray-800">
                {nurseData?.["full-name"]}
              </Text>
              <Text className="text-xs italic text-gray-600 text-center px-4 leading-5">
                "{nurseData?.slogan}"
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Thông tin cá nhân */}
        <SectionCard title="Thông tin cá nhân">
          <InfoItem
            label="Số điện thoại"
            value={nurseData?.["phone-number"] || ""}
          />
          <InfoItem label="Email" value={nurseData?.email || ""} />
          <InfoItem
            label="Ngày sinh"
            value={formatDate(nurseData?.dob || "")}
          />
          <InfoItem
            label="Giới tính"
            value={nurseData?.gender === true ? "Nam" : "Nữ"}
          />
        </SectionCard>

        {/* Địa chỉ */}
        <SectionCard title="Địa chỉ">
          <InfoItem label="Địa chỉ" value={nurseData?.address || ""} />
          <InfoItem label="Phường" value={nurseData?.ward || ""} />
          <InfoItem label="Quận" value={nurseData?.district || ""} />
          <InfoItem label="Thành phố" value={nurseData?.city || ""} />
        </SectionCard>

        {/* Thông tin nghề nghiệp */}
        <SectionCard title="Thông tin nghề nghiệp">
          <InfoItem
            label="Nơi làm việc"
            value={nurseData?.["current-work-place"] || ""}
          />
          <InfoItem label="Kinh nghiệm" value={nurseData?.experience || ""} />
          <InfoItem
            label="Trình độ học vấn"
            value={nurseData?.["education-level"] || ""}
          />
        </SectionCard>

        {/* Chứng chỉ */}
        <SectionCard title="Chứng chỉ">
          <View className="space-y-2">
            <View className="flex-row items-center bg-blue-50 p-3 rounded-md">
              <Text className="text-sm mr-2 text-blue-500">•</Text>
              <Text className="flex-1 text-xs text-gray-700">
                {nurseData?.certificate}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Google Drive */}
        {nurseData?.["google-drive-url"] && (
          <SectionCard title="Google Drive">
            <Text
              onPress={() => Linking.openURL(nurseData["google-drive-url"])}
              className="text-blue-500 text-xs underline"
            >
              Mở link google drive của điều dưỡng
            </Text>
          </SectionCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default NurseProfileScreen;
