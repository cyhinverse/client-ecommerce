export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  orderId?: { orderCode: string; totalAmount: number; status: string } | string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}
