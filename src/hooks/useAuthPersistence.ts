import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { authSlice } from "@/features/auth/authSlice";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queryKeys";
import instance from "@/api/api";

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch profile. If cookies are valid, this will succeed.
        const response = await instance.get("/users/profile");
        const result = response?.data?.data;

        if (result) {
          dispatch(authSlice.actions.setIsAuthenticated(true));
          dispatch(authSlice.actions.setUserData(result));
          // Pre-populate React Query cache
          queryClient.setQueryData(userKeys.profile(), result);
        }
      } catch {
        // If 401/403 or network error, assume not authenticated via cookies
        dispatch(authSlice.actions.setIsAuthenticated(false));
        // We don't check localStorage anymore
      }
    };

    checkAuthStatus();
  }, [dispatch, queryClient]);
};
