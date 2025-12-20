"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configStore";

export default function AdminPage() {
  const router = useRouter();
  const { data } = useSelector((state: RootState) => state.auth);

  console.log("check data from admin::" + data);

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <SpinnerLoading />
        <p className="text-muted-foreground mt-4">Redirecting...</p>
      </div>
    </div>
  );
}
