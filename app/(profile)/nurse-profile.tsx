import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';

const NurseProfileScreen = () => {
  const nurseData = {
    avatar:
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_12_26_638392165484016514_nganh-dieu-duong-0.jpg",
    firstName: "Nguyễn",
    lastName: "Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
    dateOfBirth: "01/01/1990",
    identityCard: "001099123456",
    address: "123 Đường ABC",
    ward: "Phường XYZ",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    gender: "Nam",
    slogan: "Chăm sóc bệnh nhân bằng cả trái tim",
    currentWorkplace: "Bệnh viện Chợ Rẫy",
    specialization: "Điều dưỡng khoa chỉnh hình",
    education: "12/12",
    certificates: [
      "Chứng chỉ hành nghề điều dưỡng",
      "Chứng chỉ cấp cứu nâng cao",
      "Chứng chỉ chăm sóc đặc biệt ICU",
      "Chứng chỉ tiêm chủng",
    ],
  };

  const InfoItem = ({ label, value }: any) => (
    <View className="flex-row py-4 border-b border-gray-100 items-center">
      <View className="w-[40%]">
        <Text className="text-md font-pregular text-gray-500">{label}</Text>
      </View>
      <Text className="flex-1 text-md font-pmedium text-gray-800">
        {value}
      </Text>
    </View>
  );

  const SectionCard = ({ title, children }:any) => (
    <View className="bg-white/80 backdrop-blur-md mt-4 rounded-2xl overflow-hidden shadow-sm">
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
        className="p-5 gap-3"
      >
        <Text className="text-lg font-pbold text-gray-800">
          {title}
        </Text>
        {children}
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={['#E0F2FE', '#EEF2FF', '#FAF5FF']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Header Profile Section */}
        <View className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
          <LinearGradient
            colors={['rgba(240,245,255,0.9)', 'rgba(255,255,255,0.8)']}
            className="items-center p-8 gap-4"
          >
            <View className="rounded-full p-1.5 bg-white/80 shadow-lg">
              <Image
                source={{ uri: nurseData.avatar }}
                className="w-[150px] h-[150px] rounded-full"
              />
            </View>
            <View className="items-center gap-2">
              <Text className="text-2xl font-pbold text-gray-800">
                {nurseData.lastName} {nurseData.firstName}
              </Text>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="px-4 py-1.5 rounded-full"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-sm font-pmedium text-white">
                  {nurseData.specialization}
                </Text>
              </LinearGradient>
              <Text className="text-base font-pitalic text-gray-600 text-center px-6 leading-6">
                "{nurseData.slogan}"
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Personal Information Section */}
        <SectionCard title="Thông tin cá nhân">
          <View className="gap-1">
            <InfoItem label="Số điện thoại" value={nurseData.phone} />
            <InfoItem label="Email" value={nurseData.email} />
            <InfoItem label="Ngày sinh" value={nurseData.dateOfBirth} />
            <InfoItem label="CCCD" value={nurseData.identityCard} />
            <InfoItem label="Giới tính" value={nurseData.gender} />
          </View>
        </SectionCard>

        {/* Address Section */}
        <SectionCard title="Địa chỉ">
          <View className="gap-1">
            <InfoItem label="Địa chỉ" value={nurseData.address} />
            <InfoItem label="Phường" value={nurseData.ward} />
            <InfoItem label="Quận" value={nurseData.district} />
            <InfoItem label="Thành phố" value={nurseData.city} />
          </View>
        </SectionCard>

        {/* Professional Information Section */}
        <SectionCard title="Thông tin nghề nghiệp">
          <View className="gap-1">
            <InfoItem label="Nơi làm việc" value={nurseData.currentWorkplace} />
            <InfoItem label="Chuyên môn" value={nurseData.specialization} />
            <InfoItem label="Trình độ học vấn" value={nurseData.education} />
          </View>
        </SectionCard>

        {/* Certificates Section */}
        <SectionCard title="Chứng chỉ">
          <View className="gap-3">
            {nurseData.certificates.map((certificate, index) => (
              <View key={index} className="flex-row items-center bg-blue-50/50 p-4 rounded-xl">
                <Text className="text-xl mr-3 text-blue-500">•</Text>
                <Text className="flex-1 text-xs font-pmedium text-gray-700">
                  {certificate}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>
      </ScrollView>
    </LinearGradient>
  );
};

export default NurseProfileScreen;