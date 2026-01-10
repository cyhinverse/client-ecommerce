"use client";

import { usePermissions } from "@/context/PermissionContext";
import { useMemo } from "react";

/**
 * Hook to check if user has a specific permission
 * @param permission - Permission string to check
 * @returns boolean indicating if user has the permission
 */
export const useHasPermission = (permission: string): boolean => {
  const { hasPermission } = usePermissions();
  return useMemo(() => hasPermission(permission), [hasPermission, permission]);
};

/**
 * Hook to check if user has any of the specified permissions (OR logic)
 * @param permissions - Array of permission strings to check
 * @returns boolean indicating if user has at least one permission
 */
export const useHasAnyPermission = (permissions: string[]): boolean => {
  const { hasAnyPermission } = usePermissions();
  return useMemo(
    () => hasAnyPermission(permissions),
    [hasAnyPermission, permissions]
  );
};

/**
 * Hook to check if user has all specified permissions (AND logic)
 * @param permissions - Array of permission strings to check
 * @returns boolean indicating if user has all permissions
 */
export const useHasAllPermissions = (permissions: string[]): boolean => {
  const { hasAllPermissions } = usePermissions();
  return useMemo(
    () => hasAllPermissions(permissions),
    [hasAllPermissions, permissions]
  );
};

/**
 * Hook to check if user can access a resource with specific action
 * @param resource - Resource name (e.g., 'product', 'order')
 * @param action - Action name (e.g., 'create', 'read', 'update', 'delete')
 * @returns boolean indicating if user can access
 */
export const useCanAccess = (resource: string, action: string): boolean => {
  const { canAccess } = usePermissions();
  return useMemo(
    () => canAccess(resource, action),
    [canAccess, resource, action]
  );
};

/**
 * Hook to check if user is admin
 * @returns boolean indicating if user is admin
 */
export const useIsAdmin = (): boolean => {
  const { isAdmin } = usePermissions();
  return isAdmin;
};

/**
 * Hook to check if user is seller
 * @returns boolean indicating if user is seller
 */
export const useIsSeller = (): boolean => {
  const { isSeller } = usePermissions();
  return isSeller;
};

/**
 * Hook to get all user permissions
 * @returns Array of permission strings
 */
export const useUserPermissions = (): string[] => {
  const { permissions } = usePermissions();
  return permissions;
};

/**
 * Hook to get user role
 * @returns User role string or null
 */
export const useUserRole = (): string | null => {
  const { role } = usePermissions();
  return role;
};

// Re-export usePermissions for convenience
export { usePermissions } from "@/context/PermissionContext";
