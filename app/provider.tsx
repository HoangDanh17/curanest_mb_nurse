import { UserData } from "@/app/(auth)/login";
import React, { createContext, useState, useContext, ReactNode } from "react";

type ProviderContextType = {
  userData: UserData | undefined;
  setUserData: (data: UserData | undefined) => void;
};

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | undefined>();

  return (
    <ProviderContext.Provider value={{ userData, setUserData }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = (): ProviderContextType => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error("useProvider must be used within a Provider");
  }
  return context;
};

export default Provider;