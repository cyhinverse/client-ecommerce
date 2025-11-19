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
    user?: any;
}



export interface AddressTabProps {
    user: any;
}


export interface ProfileTabProps {
  user: any;
}