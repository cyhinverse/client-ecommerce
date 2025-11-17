"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressAddButtonProps {
  onClick: () => void;
}

export default function AddressAddButton({ onClick }: AddressAddButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4 mr-2" />
      Thêm địa chỉ mới
    </Button>
  );
}