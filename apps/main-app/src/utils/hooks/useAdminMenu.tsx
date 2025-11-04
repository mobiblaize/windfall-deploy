import { useMemo } from "react";
import { useAtom } from "jotai";
import { userAtom } from "./useStorage";
import { adminMenuConfig, type AdminMenuSection } from "../config/adminMenuConfig";
import type { PermissionsByModule } from "./useStorage";

/**
 * Hook to filter admin menu items based on user permissions
 * Returns filtered menu sections with only items the user has access to
 */
export function useAdminMenu(): AdminMenuSection[] {
  const [user] = useAtom(userAtom);

  return useMemo(() => {
    if (!user || !user.permissions_by_module) {
      return [];
    }

    const filteredSections: AdminMenuSection[] = adminMenuConfig
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          const modulePermissions = user.permissions_by_module?.[
            item.requiredModule as keyof PermissionsByModule
          ] as string[] | undefined;

          return modulePermissions?.includes(item.requiredPermission) ?? false;
        });

        // Only include sections that have at least one item
        if (filteredItems.length === 0) {
          return null;
        }

        return {
          title: section.title,
          items: filteredItems,
        };
      })
      .filter((section): section is AdminMenuSection => section !== null);

    return filteredSections;
  }, [user]);
}

