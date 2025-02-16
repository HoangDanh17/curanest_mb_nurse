import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HeaderBack = () => {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="rounded-full mt-2"
    >
      <Ionicons name="chevron-back" size={30} color="#64C1DB" />
    </TouchableOpacity>
  );
};

export default HeaderBack;
