import { useAuth } from "../API/AuthContext";

export default function usePermission() {
  const { auth } = useAuth();

  const canView = (menuKey) => {
    // ADMIN → full access
    if (auth?.userTypeId === 1) return true;

    return auth?.permissions?.some(
      p => p.menuKey === menuKey && p.canView
    );
  };

  return { canView };
}
