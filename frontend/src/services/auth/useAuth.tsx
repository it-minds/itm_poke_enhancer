import { createContext, FC, useContext } from "react";

import { useAuthContextValue } from "./useAuthContextValue";

const AuthContext = createContext<ReturnType<typeof useAuthContextValue>>(null);

export const AuthContextProvider: FC = ({ children }) => {
  const value = useAuthContextValue();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
