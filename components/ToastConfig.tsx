import { BaseToast, BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#f39c12", 
        borderWidth: 1,
        borderColor: "#f39c12",
        width: "90%",
        height: 70,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "600",
        color: "#d97706", 
      }}
      text2Style={{
        fontSize: 12,
        color: "#d97706",
      }}
    />
  ),
};