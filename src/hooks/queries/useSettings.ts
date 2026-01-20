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

  getSection: async (section: string): Promise<unknown> => {
    const response = await instance.get(`/settings/${section}`);
    return extractApiData(response);
  },

  updateSection: async (params: {
    section: string;
    data: unknown;
  }): Promise<Settings> => {
    const response = await instance.put(
      `/settings/${params.section}`,
      params.data,
    );
    return extractApiData(response);
  },

  resetSettings: async (): Promise<Settings> => {
    const response = await instance.post("/settings/reset");
    return extractApiData(response);
  },
};

/**
 * Get all settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.current(),
    queryFn: settingsApi.getSettings,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get specific settings section
 */
export function useSettingsSection(section: string) {
  return useQuery({
    queryKey: settingsKeys.section(section),
    queryFn: () => settingsApi.getSection(section),
    staleTime: STALE_TIME.STATIC,
    enabled: !!section,
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

/**
 * Update specific settings section
 */
export function useUpdateSettingsSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateSection,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.current(), data);
    },
  });
}

/**
 * Reset settings to default
 */
export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.resetSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.current(), data);
    },
  });
}
