import React, { useState, ReactNode, useContext } from "react";
import { AppContext } from "./AppContext";

interface Props {
  children?: ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [image, setImage] = useState<string | null>(null);

  const setOnboardingComplete = (value: boolean) => {
    if (value) setUser({ name: "User Name", email: "user@example.com" }); // Placeholder values
  };

  return (
    <AppContext.Provider
      value={{ user, setOnboardingComplete, image, setImage }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
