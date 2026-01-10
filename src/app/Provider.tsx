"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthPersistence } from "@/hooks/useAuthPersistence";
import { store, persistor } from "@/store/configStore";
import { PermissionProvider } from "@/context/PermissionContext";

function AppInitializer({ children }: { children: React.ReactNode }) {
  useAuthPersistence();
  return <>{children}</>;
}

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PermissionProvider>
          <AppInitializer>{children}</AppInitializer>
        </PermissionProvider>
        <Toaster position="top-right" richColors />
      </PersistGate>
    </Provider>
  );
};
