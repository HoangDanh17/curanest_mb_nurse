import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import LogoApp from "@/assets/images/logo-app.png";
import authApiRequest from "@/app/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const AnimatedIcon = Reanimated.createAnimatedComponent(MaterialIcons);
const AnimatedView = Reanimated.createAnimatedComponent(View);

interface InputProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  value: string;
  onChangeText: (text: string) => void;
  isSubmitting: boolean;
  animatedValue: Reanimated.SharedValue<number>;
  error?: string;
  isPassword?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export type UserData = {
  id: string;
  "full-name": string;
  email: string;
  "phone-number": string;
  role: string;
};

const Input: React.FC<InputProps> = ({
  icon,
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
  isSubmitting,
  animatedValue,
  error,
  isPassword,
  onTogglePassword,
  showPassword,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    animatedValue.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    animatedValue.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animatedValue.value,
            [0, 1],
            [1, 1.02],
            Extrapolate.CLAMP
          ),
        },
      ],
      borderColor: error ? "#FF0000" : isFocused ? "#64DBDD" : "#E2E8F0",
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedValue.value,
        [0, 1],
        [0.5, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <View className="mb-6">
      <AnimatedView style={[containerStyle]} className={`border-2 rounded-2xl`}>
        <View className="flex-row items-center bg-white rounded-2xl p-2">
          <AnimatedIcon
            name={icon}
            size={24}
            color={error ? "#FF0000" : isFocused ? "#64DBDD" : "#A0AEC0"}
            style={iconStyle}
          />
          <TextInput
            className="flex-1 ml-3 font-psemibold text-gray-800 py-4"
            placeholder={placeholder}
            placeholderTextColor={error ? "#ff0000ae" : "#A0AEC0"}
            secureTextEntry={isPassword ? !showPassword : secureTextEntry}
            keyboardType={keyboardType as any}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!isSubmitting}
          />
          {isPassword && (
            <TouchableOpacity onPress={onTogglePassword} className="px-2">
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color={isFocused ? "#64DBDD" : "#A0AEC0"}
              />
            </TouchableOpacity>
          )}
        </View>
      </AnimatedView>
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-pmedium">{error}</Text>
      )}
    </View>
  );
};

const LoginScreen: React.FC = () => {
  const fadeIn = useSharedValue(0);
  const slideIn = useSharedValue(width);
  const scale = useSharedValue(0.95);
  const pulse = useSharedValue(1);
  const phoneAnimation = useSharedValue(0);
  const passwordAnimation = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);
  const tooltipScale = useSharedValue(0.8);

  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );
  const [token1, setToken] = useState<string>();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleGetToken = async () => {
    const pushToken = await AsyncStorage.getItem("expoPushToken");
    setToken(String(pushToken));
  };

  useEffect(() => {
    handleGetToken();
    fadeIn.value = withTiming(1, { duration: 1000 });
    slideIn.value = withTiming(0, { duration: 800 });
    scale.value = withSpring(1, { damping: 15 });

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const handleLongPress = () => {
    setShowTooltip(true);
    tooltipOpacity.value = withTiming(1, { duration: 200 });
    tooltipScale.value = withSpring(1, { damping: 15 });
  };

  const handlePressOut = () => {
    setShowTooltip(false);
    tooltipOpacity.value = withTiming(0, { duration: 200 });
    tooltipScale.value = withSpring(0.8, { damping: 15 });
  };

  const validateForm = () => {
    const newErrors: { phone?: string; password?: string } = {};

    if (!phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = useCallback(async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try {
      setIsSubmitting(true);
      const form = {
        password: password,
        "phone-number": phone,
        "push-token": token1,
      };
      const response = await authApiRequest.login(form);

      const userRole = response.payload.data["account-info"].role;
      if (userRole === "relatives") {
        Alert.alert(
          "Không được phép truy cập",
          "Ứng dụng này chỉ dành cho điều dưỡng."
        );
        return;
      }

      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify(response.payload.data["account-info"])
      );

      const token = response.payload.data.token["access_token"];
      await AsyncStorage.setItem("accessToken", token);
      router.push("/(tabs)/home");
    } catch (error: any) {
      if (error.payload.error.reason_field) {
        Alert.alert("Đăng nhập thất bại", error.payload.error.reason_field);
      } else {
        Alert.alert("Đăng nhập thất bại", "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [phone, password]);

  const mainContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateX: slideIn.value }, { scale: scale.value }],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  const tooltipStyle = useAnimatedStyle(() => {
    return {
      opacity: tooltipOpacity.value,
      transform: [{ scale: tooltipScale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <AnimatedView
          className="flex-1 justify-center items-center p-6"
          style={mainContainerStyle}
        >
          <View className="w-full max-w-md bg-white rounded-[40px] shadow-lg p-8 relative">
            {/* Icon and Tooltip in Top-Left Corner of Logo */}
            <View className="absolute top-4 left-4 z-10">
              <TouchableOpacity
                onLongPress={handleLongPress}
                onPressOut={handlePressOut}
                activeOpacity={0.7}
              >
                <MaterialIcons name="info" size={24} color="#2D3748" />
              </TouchableOpacity>
              {showTooltip && (
                <AnimatedView
                  style={[tooltipStyle]}
                  className="absolute top-0 left-8 bg-[#2D3748] rounded-lg p-2 min-w-[200px]"
                >
                  <Text className="text-white text-sm font-pmedium">
                    {token1 || "No token available"}
                  </Text>
                </AnimatedView>
              )}
            </View>

            <AnimatedView className="items-center mb-10" style={logoStyle}>
              <Image
                source={LogoApp}
                className="w-60 h-60 absolute top-[-60]"
                resizeMode="contain"
              />
              <Text className="text-4xl font-pbold text-[#2D3748] mt-24">
                Curanest
              </Text>
              <Text className="text-sm text-[#718096] mt-2 font-psemibold">
                Hệ thống quản lý điều dưỡng
              </Text>
            </AnimatedView>
            <Input
              icon="phone"
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              isSubmitting={isSubmitting}
              animatedValue={phoneAnimation}
              error={errors.phone}
            />
            <Input
              icon="lock"
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              isSubmitting={isSubmitting}
              animatedValue={passwordAnimation}
              error={errors.password}
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            <TouchableOpacity
              className="w-full py-4 rounded-2xl items-center bg-[#64DBDD] mt-4"
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-center font-pbold text-lg">
                  Đăng Nhập
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </AnimatedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
