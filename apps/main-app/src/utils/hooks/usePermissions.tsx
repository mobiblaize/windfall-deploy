import { useMemo } from "react";
import { useSessionStorage } from "./useStorage";

export const usePermissions = () => {
  const { user } = useSessionStorage();

  const permissions = useMemo(() => {
    const userPermissions = user?.permissions || [];

    return {
      canUnlockDraw: userPermissions.includes("draw-management-unlock"),
      canApproveDraw: userPermissions.includes("draw-management-approve"),
      canApprovePrizeClaim: userPermissions.includes("prize-claim-management-approve"),
      canEditPrizeClaim: userPermissions.includes("prize-claim-management-edit"),
      canViewPrizeClaim: userPermissions.includes("prize-claim-management-view"),
      canApproveGame: userPermissions.includes("game-management-approve"),
      canApprovePromoCode: userPermissions.includes(
        "promo-code-management-approve"
      ),
    };
  }, [user?.permissions]);

  return permissions;
};
