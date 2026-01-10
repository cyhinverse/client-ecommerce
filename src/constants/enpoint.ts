export const enpoint_auth = {
  login: "/auth/login",
  register: "/auth/register",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
};

export const endpoint_permission = {
  getAll: "/permissions",
  getRolePermissions: "/permissions/roles",
  getMyPermissions: "/permissions/me",
  getUserPermissions: (userId: string) => `/permissions/user/${userId}`,
  updateUserPermissions: (userId: string) => `/permissions/user/${userId}`,
  grantPermission: (userId: string) => `/permissions/user/${userId}/grant`,
  revokePermission: (userId: string) => `/permissions/user/${userId}/revoke`,
  getAuditLogs: "/permissions/audit",
};
