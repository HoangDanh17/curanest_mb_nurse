import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface MenuItemProps {
  iconName: MaterialIconName;
  title: string;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
  handlePress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  iconName,
  title,
  iconColor = "white",
  bgColor = "#64CBCD",
  textColor = "black",
  handlePress,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex flex-row items-center justify-between w-full p-3 border-b border-gray-200"
    >
      <View className="flex flex-row items-center gap-2">
        <View
          style={{ backgroundColor: bgColor, borderRadius: 9999, padding: 8 }}
        >
          <MaterialIcons name={iconName} size={24} color={iconColor} />
        </View>
        <Text style={{ color: textColor, marginLeft: 8, fontWeight: "bold" }}>
          {title}
        </Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default MenuItem;
