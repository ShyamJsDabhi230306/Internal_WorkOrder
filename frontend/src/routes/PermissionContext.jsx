import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../API/AuthContext";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { auth } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [ready, setReady] = useState(false); // 🔑 Tracks when permissions are actually loaded

  useEffect(() => {
    setReady(false); // Reset while auth changes
    if (auth?.permissions) {
      setPermissions(auth.permissions);
    } else {
      setPermissions([]);
    }
    setReady(true); // ✅ Mark as ready after setting
  }, [auth]);

  const canView = (menuKey) => {
    // 👑 SuperAdmin always has full access
    if (auth?.userTypeId === 1) return true;

    if (!menuKey || !permissions || permissions.length === 0) return false;

    const key = menuKey.toLowerCase();

    // Alias map so sub-routes map to parent permission keys
    const aliasMap = {
      "workorder-create": "workorder",
      "workorder-list": "workorder",
      "workorder-edit": "workorder",
      "workorder-manage": "workordermanage",
      "workordermanage": "workordermanage",
      "accept": "workordermanage",
      "accepted": "workordermanage",
      "dispatch": "workordermanage",
    };

    const resolvedKey = aliasMap[key] || key;

    return permissions.some((p) => {
      // Handle both camelCase (JS) and PascalCase (C# JSON)
      const dbKey = (p.menuKey || p.MenuKey || p.menu?.menuKey)?.toLowerCase();
      if (!dbKey) return false;

      const hasAnyRight =
        p.canView || p.CanView ||
        p.canCreate || p.CanCreate ||
        p.canEdit || p.CanEdit ||
        p.canDelete || p.CanDelete;

      return dbKey === resolvedKey && hasAnyRight;
    });
  };

  return (
    <PermissionContext.Provider value={{ permissions, canView, ready }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);
