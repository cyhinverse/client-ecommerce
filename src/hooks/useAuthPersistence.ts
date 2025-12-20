import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { authSlice } from "@/features/auth/authSlice";

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore token from localStorage on app startup
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      dispatch(authSlice.actions.setToken(savedToken));
      dispatch(authSlice.actions.setIsAuthenticated(true));

      // Optionally, you can verify the token with the server here
      // and fetch user data if needed
    }
  }, [dispatch]);
};
