import React from "react";

export default function LayoutCategories({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {children}
    </div>
  );
}
