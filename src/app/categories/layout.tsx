import React from "react";

export default function LayoutCategories({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 min-h-screen">
      {children}
    </main>
  );
}
