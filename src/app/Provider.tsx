"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAuthPersistence } from "@/hooks/useAuthPersistence";
import { Toaster } from "@/components/ui/sonner";

function AppInitializer({ children }: { children: React.ReactNode }) {
  useAuthPersistence();
  return <>{children}</>;
}

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AppInitializer>
        {children}
        <Toaster position="top-right" richColors />
      </AppInitializer>
    </Provider>
  );
};

export default ReduxProvider;
