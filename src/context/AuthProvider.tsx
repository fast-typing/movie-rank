import { createContext, useState } from "react";

type AuthContextType = {
  isAuth: boolean;
  setAuth: (auth: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuth: !!localStorage.getItem("token")?.length,
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [isAuth, setAuth] = useState<boolean>(!!localStorage.getItem("token")?.length);

  return <AuthContext.Provider value={{ isAuth, setAuth }}>{children}</AuthContext.Provider>;
};
