

// import { useEffect, useState } from "react";
// import { getUsers } from "../API/userApi";
// import axiosClient from "../API/axiosClient";
// import {
//   getUserMenuPermissions,
//   saveUserMenuPermissions
// } from "../API/userMenuPermissionApi";

// export default function UserMenuRights() {
//   const [users, setUsers] = useState([]);
//   const [menus, setMenus] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [rights, setRights] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // LOAD USERS + MENUS
//   useEffect(() => {
//     const loadInit = async () => {
//       const usersData = await getUsers();
//       const menusRes = await axiosClient.get("/menus");

//       setUsers(usersData || []);
//       setMenus(menusRes.data || []);
//     };

//     loadInit();
//   }, []);

//   // LOAD USER PERMISSIONS
//   const loadRights = async (userId) => {
//     setSelectedUser(userId);

//     if (!userId) {
//       setRights([]);
//       return;
//     }

//     setLoading(true);
//     const data = await getUserMenuPermissions(userId);

//     const mapped = menus.map(m => {
//       const found = data.find(p => p.menuId === m.menuId);
//       return {
//         menuId: m.menuId,
//         menuName: m.menuName,
//         canView: found?.canView || false,
//         canCreate: found?.canCreate || false,
//         canEdit: found?.canEdit || false,
//         canDelete: found?.canDelete || false
//       };
//     });

//     setRights(mapped);
//     setLoading(false);
//   };

//   // TOGGLE CHECKBOX
//   const toggle = (menuId, key) => {
//     setRights(prev =>
//       prev.map(r =>
//         r.menuId === menuId ? { ...r, [key]: !r[key] } : r
//       )
//     );
//   };

//   // SAVE PERMISSIONS
//   const save = async () => {
//     if (!selectedUser) {
//       alert("Select user first");
//       return;
//     }

//     const payload = rights
//       .filter(r => r.menuId > 0)
//       .map(r => ({
//         menuId: r.menuId,
//         canView: r.canView,
//         canCreate: r.canCreate,
//         canEdit: r.canEdit,
//         canDelete: r.canDelete
//       }));

//     await saveUserMenuPermissions(selectedUser, payload);
//     alert("Permissions saved");
//   };

//   return (
//     <div className="card p-3">
//       <h4>User Menu Rights</h4>

//       <select
//         className="form-select mb-3"
//         value={selectedUser}
//         onChange={e => loadRights(e.target.value)}
//       >
//         <option value="">Select User</option>
//         {users.map(u => (
//           <option key={u.userId} value={u.userId}>
//             {u.userFullName}
//           </option>
//         ))}
//       </select>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Page</th>
//               <th>View</th>
//               <th>Create</th>
//               <th>Edit</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rights.map(r => (
//               <tr key={r.menuId}>
//                 <td>{r.menuName}</td>
//                 {["canView", "canCreate", "canEdit", "canDelete"].map(k => (
//                   <td key={k} className="text-center">
//                     <input
//                       type="checkbox"
//                       checked={r[k]}
//                       onChange={() => toggle(r.menuId, k)}
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button className="btn btn-primary w-100" onClick={save}>
//         SAVE
//       </button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axiosClient from "../API/axiosClient";
import {
  getUserMenuPermissions,
  saveUserMenuPermissions
} from "../API/userMenuPermissionApi";
import { getUsers } from "../API/userApi";
import { useAuth } from "../API/AuthContext";
// import { usePermission } from "../context/PermissionContext";
import { usePermission } from "../routes/PermissionContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UserMenuRights() {
  const { auth } = useAuth();
  const { refresh } = usePermission();

  const [users, setUsers] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [rights, setRights] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD USERS + MENUS =================
  useEffect(() => {
    const loadInit = async () => {
      const usersData = await getUsers();
      const menusRes = await axiosClient.get("/menus");

      setUsers(usersData || []);
      setMenus(menusRes.data || []);
    };

    loadInit();
  }, []);

  // ================= LOAD USER RIGHTS =================
  const loadRights = async (userId) => {
    setSelectedUser(userId);

    if (!userId) {
      setRights([]);
      return;
    }

    setLoading(true);
    const data = await getUserMenuPermissions(userId);

    const mapped = menus.map(m => {
      const found = data.find(p => p.menuId === m.menuId);
      return {
        menuId: m.menuId,
        menuName: m.menuName,
        canView: found?.canView || false,
        canCreate: found?.canCreate || false,
        canEdit: found?.canEdit || false,
        canDelete: found?.canDelete || false
      };
    });

    setRights(mapped);
    setLoading(false);
  };

  // ================= TOGGLE =================
  const toggle = (menuId, key) => {
    setRights(prev =>
      prev.map(r =>
        r.menuId === menuId ? { ...r, [key]: !r[key] } : r
      )
    );
  };

  // ================= SAVE =================
  const save = async () => {
    if (!selectedUser) {
      toast.warning("Please select a user")
      return;
    }

    const payload = rights
      .filter(r => r.menuId > 0)
      .map(r => ({
        menuId: r.menuId,
        canView: r.canView,
        canCreate: r.canCreate,
        canEdit: r.canEdit,
        canDelete: r.canDelete
      }));

    await saveUserMenuPermissions(selectedUser, payload);

    // 🔥 IMPORTANT: refresh permissions if admin edited SELF
    if (Number(selectedUser) === auth?.userId) {
      refresh(auth.userId);
    }

    // alert("Permissions saved successfully");
    toast.success("Permissions saved successfully")
  };
const navigate = useNavigate();
  return (

    
    <div className="card p-3">

      {/* <button
  className="btn btn-secondary w-25 mt-4 mb-4"
  onClick={() => navigate(-1)}
>
   Back
</button> */}

<button
  className="btn btn-secondary  btn-sm mt-4 mb-4"
  onClick={() => navigate(-1)}
>
  Back
</button>
      <h4>User Menu Rights</h4>

      <select
        className="form-select mb-3"
        value={selectedUser}
        onChange={e => loadRights(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(u => (
          <option key={u.userId} value={u.userId}>
            {u.userFullName}
          </option>
        ))}
      </select>

      {loading ? (
        <div>Loading permissions...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Page</th>
              <th>View</th>
              <th>Create</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {rights.map(r => (
              <tr key={r.menuId}>
                <td>{r.menuName}</td>
                {["canView", "canCreate", "canEdit", "canDelete"].map(k => (
                  <td key={k} className="text-center">
                    <input
                      type="checkbox"
                      checked={r[k]}
                      onChange={() => toggle(r.menuId, k)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-primary w-100 mt-2" onClick={save}>
        SAVE
      </button>
    </div>
  );
}
