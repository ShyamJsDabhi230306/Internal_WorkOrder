

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
import Layout from "../layout/Layout";

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
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="m-0 text-white">User Menu Rights</h3>
        <button
          className="btn btn-secondary btn-sm d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-4">
            <label className="form-label text-white small uppercase letter-spacing-1">Select User To Manage Permissions</label>
            <select
              className="form-control"
              value={selectedUser}
              onChange={e => loadRights(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {users.map(u => (
                <option key={u.userId} value={u.userId}>
                  {u.userFullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-0 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-5 text-center">
              <div className="spinner-border text-primary mb-2" role="status"></div>
              <div className="text-white-50">Loading permissions...</div>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table table-bordered align-middle table-single-line m-0">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingLeft: '24px' }}>Page / Module</th>
                    <th>View</th>
                    <th>Create</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {rights.map(r => (
                    <tr key={r.menuId}>
                      <td style={{ textAlign: 'left', paddingLeft: '24px' }} className="fw-bold text-white">{r.menuName}</td>
                      {["canView", "canCreate", "canEdit", "canDelete"].map(k => (
                        <td key={k} className="text-center">
                          <div className="form-check d-flex justify-content-center m-0">
                            <input
                              className="form-check-input custom-checkbox"
                              type="checkbox"
                              checked={r[k]}
                              onChange={() => toggle(r.menuId, k)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && rights.length > 0 && (
          <div className="card-footer p-3 bg-transparent border-top border-white border-opacity-10">
            <button className="btn btn-primary w-100 py-2 fw-bold shadow-lg" onClick={save}>
              <i className="bi bi-shield-check me-2"></i> SAVE PERMISSIONS
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
