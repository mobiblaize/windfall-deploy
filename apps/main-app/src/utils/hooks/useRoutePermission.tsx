import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "./useStorage";
import { getRequiredPermission } from "../helper/routePermissionMapping";
import type { PermissionsByModule } from "./useStorage";

/**
 * Hook to check if the current user has permission for the current route
 * @returns Object with hasPermission boolean and permission details
 */
export function useRoutePermission() {
  const location = useLocation();
  const [user] = useAtom(userAtom);

  const permissionConfig = getRequiredPermission(location.pathname);

  if (!permissionConfig || !user) {
    return {
      hasPermission: false,
      module: permissionConfig?.module || null,
      permission: permissionConfig?.permission || null,
      user,
    };
  }

  const { module, permission } = permissionConfig;
  const modulePermissions = user.permissions_by_module?.[module as keyof PermissionsByModule] as string[] | undefined;

  const hasPermission = modulePermissions?.includes(permission) ?? false;

  return {
    hasPermission,
    module,
    permission,
    user,
  };
}

