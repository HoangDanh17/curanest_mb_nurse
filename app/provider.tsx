import React, { createContext, useState, useContext, ReactNode } from "react";

type ProviderContextType = {
  isFinish: boolean;
  setIsFinish: (value: boolean) => void;
};

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [isFinish, setIsFinish] = useState<boolean>(false);

  return (
    <ProviderContext.Provider value={{ isFinish, setIsFinish }}>
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