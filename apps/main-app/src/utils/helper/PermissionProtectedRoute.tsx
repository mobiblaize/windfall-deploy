import { useRoutePermission } from "../hooks/useRoutePermission";
import AccessDenied from "../../pages/Admin/AccessDenied/AccessDenied";
import type { PermissionsByModule } from "../hooks/useStorage";

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Optional: Override the module name for the access denied message
   * If not provided, will use the module detected from the route
   */
  moduleName?: string;
  /**
   * Optional: Override the required permission check
   * If not provided, will automatically detect from the route
   */
  requiredPermission?: string;
  /**
   * Optional: Override the required module name
   * If not provided, will automatically detect from the route
   */
  requiredModule?: string;
}

/**
 * Component that protects routes based on user permissions
 * This should be used inside AdminProtectedRoute (which handles auth)
 * 
 * Usage:
 * <PermissionProtectedRoute>
 *   <YourComponent />
 * </PermissionProtectedRoute>
 */
const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  children,
  moduleName,
  requiredPermission,
  requiredModule,
}) => {
  const { hasPermission, module, user } = useRoutePermission();
  console.log(user);
  

  // If explicit permission/module is provided, use custom check
  let shouldAllowAccess = hasPermission;
    
  if (requiredModule && requiredPermission && user) {
    const modulePermissions = user.permissions_by_module?.[requiredModule as keyof PermissionsByModule] as string[] | undefined;
    shouldAllowAccess = modulePermissions?.includes(requiredPermission) ?? false;
  }

  // If no user or permission check fails, show access denied
  if (!user || !shouldAllowAccess) {
    const displayModuleName = moduleName || module || "this page";
    return <AccessDenied moduleName={displayModuleName} />;
  }

  return <>{children}</>;
};

export default PermissionProtectedRoute;

