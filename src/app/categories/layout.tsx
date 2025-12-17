import React from "react";

export default function LayoutCategories({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen bg-white dark:bg-black">
      {children}
    </main>
  );
}
