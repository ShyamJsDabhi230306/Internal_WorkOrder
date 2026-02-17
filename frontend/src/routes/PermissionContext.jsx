// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "../API/AuthContext";
// import { getUserMenuPermissions } from "../API/userMenuPermissionApi";

// const PermissionContext = createContext();

// export const PermissionProvider = ({ children }) => {
//   const { auth } = useAuth();
//   const [permissions, setPermissions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadPermissions = async (userId) => {
//     if (!userId) return;

//     setLoading(true);
//     const data = await getUserMenuPermissions(userId);
//     setPermissions(data || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (auth?.userId) {
//       loadPermissions(auth.userId);
//     } else {
//       setPermissions([]);
//     }
//   }, [auth?.userId]);

//   const canView = (menuKey) => {
//     if (auth?.userTypeId === 1) return true;

//     return permissions.some(
//       p => p.menu?.menuKey === menuKey && p.canView
//     );
//   };

//   return (
//     <PermissionContext.Provider value={{ canView, refresh: loadPermissions }}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => useContext(PermissionContext);

import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../API/axiosClient";
import { useAuth } from "../API/AuthContext";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { auth } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Load permissions from API
  const loadPermissions = async (userId) => {
    try {
      setLoading(true);
      console.log("✅ Loading permissions for user:", userId);

      const res = await axiosClient.get(
        `/UserMenuPermissions/${userId}`
      );

      console.log("📦 Permissions API response:", res.data);

      setPermissions(res.data || []);
    } catch (err) {
      console.error("❌ Permission load failed", err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reload when user changes
  useEffect(() => {
    if (auth?.userId) {
      loadPermissions(auth.userId);
    } else {
      setPermissions([]);
      setLoading(false);
    }
  }, [auth?.userId]);



// const canView = (menuKey) => {
//   // 👑 Admin full access
//   if (auth?.userTypeId === 1) return true;

//   if (!menuKey || !permissions || permissions.length === 0) return false;

//   const key = menuKey.toLowerCase();

//   // 🔁 ALIAS MAP (VERY IMPORTANT)
//   const aliasMap = {
//     "workorder-create": "workorder",
//     "workorder-list": "workorder",
//     "workorder-edit": "workorder",


//  // WorkOrderManage children
//     "workorder-manage": "workordermanage",
//     "workordermanage": "workordermanage",
//     // "workorder-accept": "workordermanage",
//     // "workorder-dispatch": "workordermanage",
//     "accept": "workordermanage",
//     "dispatch": "workordermanage",



//     // "accepted": "workordermanage",


//       // Child pages
//   "accept": auth?.userTypeId === 3
//     ? "vendor-accept"
//     : "workordermanage",

//   "accepted": auth?.userTypeId === 3
//     ? "vendor-accepted"
//     : "workordermanage",

//   "dispatch": auth?.userTypeId === 3
//     ? "vendor-dispatch"
//     : "workordermanage"

 

//   };

//   const resolvedKey = aliasMap[key] || key;

//   const allowed = permissions.some(p => {
//     const dbKey = p.menu?.menuKey?.toLowerCase();
//     if (!dbKey) return false;

//     return (
//       dbKey === resolvedKey &&
//       (p.canView || p.canCreate || p.canEdit || p.canDelete)
//     );
//   });

//   console.log(`🔐 canView("${menuKey}") → ${allowed} (via "${resolvedKey}")`);
//   return allowed;
// };
const canView = (menuKey) => {
  // 👑 Admin full access
  if (auth?.userTypeId === 1) return true;

  if (!menuKey) return false;
  if (!permissions) return false;

  // ⏳ Permissions not loaded yet → DON'T BLOCK
  if (permissions.length === 0) return true;

  const key = menuKey.toLowerCase();

  // ✅ Vendor override for manage pages
  if (auth?.userTypeId === 3 && key === "workordermanage") {
    return true;
  }

  const aliasMap = {
    "workorder-create": "workorder",
    "workorder-list": "workorder",
    "workorder-edit": "workorder",

    "workorder-manage": "workordermanage",
    "workordermanage": "workordermanage",

    "accept":
      auth?.userTypeId === 3 ? "vendor-accept" : "workordermanage",

    "accepted":
      auth?.userTypeId === 3 ? "vendor-accepted" : "workordermanage",

    "dispatch":
      auth?.userTypeId === 3 ? "vendor-dispatch" : "workordermanage"
  };

  const resolvedKey = aliasMap[key] || key;

  const allowed = permissions.some((p) => {
    const dbKey = p.menu?.menuKey?.toLowerCase();
    if (!dbKey) return false;

    return (
      dbKey === resolvedKey &&
      (p.canView || p.canCreate || p.canEdit || p.canDelete)
    );
  });

  return allowed;
};


  return (
    <PermissionContext.Provider
      value={{
        permissions,
        canView,
        loading
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);
