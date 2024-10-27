import { AuthUserType } from "../types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axiosInstance from "../axios";
import refreshAccessToken from "../utils/refreshAccessToken";

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: false,
});

const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setisLoading(true)
        const response = await axiosInstance.get("/auth/user", {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        });
        setAuthUser(response.data.data);
      } catch (err: any) {
        if (err.response.status === 401) {
          try {
            await refreshAccessToken();
            const response = await axiosInstance.get("/auth/user", {
              headers: {
                Authorization: localStorage.getItem("access_token"),
              },
            });
            setAuthUser(response.data.data);
          } catch (err: any) {
            console.log("status: ", err.response.status);
            console.log("Error: ", err.response.data.message);
          }
        }
      } finally {
        setisLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export { useAuthContext };
