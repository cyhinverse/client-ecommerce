"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddressAddButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export default function AddressAddButton({ onClick, className, variant = "default" }: AddressAddButtonProps) {
  return (
    <Button onClick={onClick} className={cn("rounded-full", className)} variant={variant}>
      <Plus className="h-4 w-4 mr-2" />
      Add New Address
    </Button>
  );
}