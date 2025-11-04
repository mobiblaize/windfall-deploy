/**
 * Maps admin route paths to their corresponding permission modules and required permissions
 */

export type PermissionType = 'view' | 'edit';

export interface RoutePermissionConfig {
  module: string;
  permission: string;
}

/**
 * Route path patterns mapped to their module names
 * The key is a route pattern, the value is the module name from PermissionsByModule
 */
const routeModuleMap: Record<string, string> = {
  '/admin/users': 'User Management',
  '/admin/roles': 'User Management',
  '/admin/raffles': 'Game Management',
  '/admin/instant-raffles': 'Game Management',
  '/admin/draws': 'Draw Management',
  '/admin/customers': 'Customer Management',
  '/admin/transactions': 'Transaction Management',
  '/admin/prizes': 'Prize Management',
  '/admin/prize-claims': 'Prize Management',
  '/admin/notifications': 'Notification',
  '/admin/support': 'Customer Support',
  '/admin/referrals': 'Referral Management',
  '/admin/promo-codes': 'Promo Code Management',
  '/admin/reports': 'Report Management',
  '/admin/audit': 'User Management', // Audit trail is typically under User Management
};

/**
 * Determines if a route path requires edit permission based on URL patterns
 */
function requiresEditPermission(pathname: string): boolean {
  const editPatterns = ['/create', '/edit'];
  return editPatterns.some(pattern => pathname.includes(pattern));
}

/**
 * Gets the module name for a given route path
 */
function getModuleForRoute(pathname: string): string | null {
  // Remove trailing slash and normalize
  const normalizedPath = pathname.replace(/\/$/, '');
  
  // Check exact matches first
  if (routeModuleMap[normalizedPath]) {
    return routeModuleMap[normalizedPath];
  }
  
  // Check prefix matches (for nested routes)
  for (const [routePattern, module] of Object.entries(routeModuleMap)) {
    if (normalizedPath.startsWith(routePattern)) {
      return module;
    }
  }
  
  return null;
}

/**
 * Converts module name to permission string format
 * Example: "Game Management" -> "game-management"
 */
function moduleToPermissionPrefix(module: string): string {
  return module
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Gets the required permission configuration for a given route path
 * @param pathname - The current route pathname
 * @returns RoutePermissionConfig with module name and permission string, or null if no mapping exists
 */
export function getRequiredPermission(pathname: string): RoutePermissionConfig | null {
  const module = getModuleForRoute(pathname);
  
  if (!module) {
    return null;
  }
  
  const permissionType: PermissionType = requiresEditPermission(pathname) ? 'edit' : 'view';
  const permissionPrefix = moduleToPermissionPrefix(module);
  const permission = `${permissionPrefix}-${permissionType}`;
  
  return {
    module,
    permission,
  };
}

/**
 * Gets all possible route patterns for a given module
 */
export function getRoutesForModule(module: string): string[] {
  return Object.entries(routeModuleMap)
    .filter(([, moduleName]) => moduleName === module)
    .map(([route]) => route);
}

