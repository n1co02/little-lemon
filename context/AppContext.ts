import { createContext, useState, ReactNode, useContext } from "react";

interface AppContextType {
  user: { name: string; email: string } | null;
  setOnboardingComplete: (value: boolean) => void;
  image: string | null;
  setImage: (value: string | null) => void;
}

const defaultValue = {
  user: null,
  setOnboardingComplete: () => {},
  image: null,
  setImage: () => {},
};

export const AppContext = createContext<AppContextType>(defaultValue);
