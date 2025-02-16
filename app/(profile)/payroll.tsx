import React, { useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';

// Data mẫu
const salaryData = [
  {
    id: 1,
    month: 1,
    year: 2025,
    datetime: '8:00 08/01/2025',
    amount: 15000000,
    iconBgColor: '#e3f2fd'
  },
  {
    id: 2,
    month: 12,
    year: 2024,
    datetime: '8:00 05/12/2024',
    amount: 15000000,
    iconBgColor: '#f3e5f5'
  },
  {
    id: 3,
    month: 11,
    year: 2024,
    datetime: '8:00 05/11/2024',
    amount: 14500000,
    iconBgColor: '#e8f5e9'
  }
];

// Tạo options cho dropdown
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear; i++) {
    years.push({ label: `Năm ${i}`, value: i });
  }
  return [{ label: 'Tất cả các năm', value: null }, ...years];
};

const monthOptions = [
  { label: 'Tất cả các tháng', value: null },
  { label: 'Tháng 1', value: 1 },
  { label: 'Tháng 2', value: 2 },
  { label: 'Tháng 3', value: 3 },
  { label: 'Tháng 4', value: 4 },
  { label: 'Tháng 5', value: 5 },
  { label: 'Tháng 6', value: 6 },
  { label: 'Tháng 7', value: 7 },
  { label: 'Tháng 8', value: 8 },
  { label: 'Tháng 9', value: 9 },
  { label: 'Tháng 10', value: 10 },
  { label: 'Tháng 11', value: 11 },
  { label: 'Tháng 12', value: 12 },
];

const SalaryScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState<{ label: string; value: number | null } | null>(null);
  const [selectedYear, setSelectedYear] = useState<{ label: string; value: number | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleFilter = (type: 'month' | 'year', item: { label: string; value: number | null }) => {
    setIsLoading(true);
    if (type === 'month') {
      setSelectedMonth(item);
    } else {
      setSelectedYear(item);
    }
    
    // Giả lập delay khi lọc
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Lọc data dựa trên month và year được chọn
  const filteredData = salaryData.filter((item) => {
    const monthMatch = !selectedMonth?.value || item.month === selectedMonth.value;
    const yearMatch = !selectedYear?.value || item.year === selectedYear.value;
    return monthMatch && yearMatch;
  });

  // Style chung cho dropdown
  const dropdownStyle = {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Filter Section */}
      <View className="p-4 flex-row justify-between">
        <View className="w-[48%]">
          <Dropdown
            data={monthOptions}
            labelField="label"
            valueField="value"
            placeholder="Tháng"
            value={selectedMonth}
            onChange={(item) => handleFilter('month', item)}
            style={dropdownStyle}
            placeholderStyle={{ color: '#999' }}
            selectedTextStyle={{ color: '#000' }}
            containerStyle={{ borderRadius: 8 }}
            renderLeftIcon={() => (
              <MaterialIcons 
                name="date-range" 
                size={20} 
                color="#666"
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>
        
        <View className="w-[48%]">
          <Dropdown
            data={getYearOptions()}
            labelField="label"
            valueField="value"
            placeholder="Năm"
            value={selectedYear}
            onChange={(item) => handleFilter('year', item)}
            style={dropdownStyle}
            placeholderStyle={{ color: '#999' }}
            selectedTextStyle={{ color: '#000' }}
            containerStyle={{ borderRadius: 8 }}
            renderLeftIcon={() => (
              <MaterialIcons 
                name="calendar-today" 
                size={20} 
                color="#666"
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      ) : (
        <ScrollView className="p-4">
          {filteredData.length === 0 ? (
            <View className="flex justify-center items-center py-8">
              <MaterialIcons name="search-off" size={48} color="#666" />
              <Text className="text-gray-500 text-lg mt-2">
                Không có dữ liệu lương cho thời gian đã chọn
              </Text>
            </View>
          ) : (
            filteredData.map((salary) => (
              <View 
                key={salary.id} 
                className="bg-white rounded-xl p-4 mb-4 shadow-sm"
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full justify-center items-center mr-4"
                    style={{ backgroundColor: salary.iconBgColor }}
                  >
                    <MaterialIcons name="attach-money" size={24} color="#1976d2" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-md font-bold text-gray-800">
                      Tháng {salary.month}/{salary.year}
                    </Text>
                    
                    <View className="flex-row items-center mt-1">
                      <MaterialIcons name="access-time" size={16} color="#666" />
                      <Text className="ml-2 text-gray-600 text-sm">
                        {salary.datetime}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text className="text-md font-bold text-blue-600">
                      + {formatCurrency(salary.amount)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default SalaryScreen;