/**
 * Settings React Query Hooks (Admin)
 * Hooks for managing system settings
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData } from "@/api";
import { STALE_TIME } from "@/constants/cache";
import { settingsKeys } from "@/lib/queryKeys";
import { Settings, UpdateSettingsPayload } from "@/types/settings";

const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await instance.get("/settings");
    return extractApiData(response);
  },

  updateSettings: async (data: UpdateSettingsPayload): Promise<Settings> => {
    const response = await instance.put("/settings", data);
    return extractApiData(response);
  },


};

/**
 * Update settings (partial update)
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.current(), data);
    },
  });
}




/**
 * Update settings (partial update)
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.current(), data);
    },
  });
}


