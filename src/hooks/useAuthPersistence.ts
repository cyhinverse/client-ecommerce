import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { authSlice } from "@/features/auth/authSlice";
import { getProfile } from "@/features/user/userAction";

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch profile. If cookies are valid, this will succeed.
        const result = await dispatch(getProfile()).unwrap();

        if (result) {
          dispatch(authSlice.actions.setIsAuthenticated(true));
          // Note: userData is handled by userSlice via getProfile.fulfilled
          // But we might want to sync basic user info to authSlice if needed
          if (result.data) {
            dispatch(authSlice.actions.setUserData(result.data));
          }
        }
      } catch (error) {
        // If 401/403 or network error, assume not authenticated via cookies
        dispatch(authSlice.actions.setIsAuthenticated(false));
        // We don't check localStorage anymore
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};
