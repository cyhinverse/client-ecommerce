import { User } from "./user";

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  editingAddress: Address | null;
  onSuccess: () => void;
  user?: User;
}

export interface AddressTabProps {
  user: User;
}

export interface ProfileTabProps {
  user: User;
}
