export interface address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  address: address[];
  avatar: string;
  isVerifiedEmail: boolean;
  createdAt: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
