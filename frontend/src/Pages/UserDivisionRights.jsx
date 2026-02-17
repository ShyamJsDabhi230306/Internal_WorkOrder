// import { useEffect, useState } from "react";
// import {
//   getAllUsers,
//   getAllDivisions,
//   getUserDivisionRights,
//   saveUserDivisionRights
// } from "../API/userDivisionApi";

// export default function UserDivisionRights() {
//   const [users, setUsers] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [allowedDivisions, setAllowedDivisions] = useState(new Set());
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD USERS & DIVISIONS ================= */
// useEffect(() => {
//   getAllUsers().then(setUsers);
//   getAllDivisions().then(setDivisions);
// }, []);

// const handleUserChange = async (userId) => {
//   if (!userId) {
//     setSelectedUser("");
//     setAllowedDivisions(new Set());
//     return;
//   }

//   setSelectedUser(userId);
//   setLoading(true);

//   const data = await getUserDivisionRights(userId);
//   const ids = data.map(x => x.divisionId);

//   setAllowedDivisions(new Set(ids));
//   setLoading(false);
// };

//   /* ================= LOAD USER DIVISION RIGHTS ================= */
// //   const handleUserChange = async (userId) => {
// //     if (!userId) {
// //       setSelectedUser("");
// //       setAllowedDivisions(new Set());
// //       return;
// //     }

// //     setSelectedUser(userId);
// //     setLoading(true);

// //     const res = await getUserDivisionRights(userId);
// //     const ids = res.data.map(x => x.divisionId);

// //     setAllowedDivisions(new Set(ids));
// //     setLoading(false);
// //   };

//   /* ================= TOGGLE DIVISION ================= */
//   const toggleDivision = (divisionId) => {
//     setAllowedDivisions(prev => {
//       const copy = new Set(prev);
//       copy.has(divisionId)
//         ? copy.delete(divisionId)
//         : copy.add(divisionId);
//       return copy;
//     });
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!selectedUser) return;

//     await saveUserDivisionRights(
//       selectedUser,
//       Array.from(allowedDivisions)
//     );

//     alert("Division rights saved successfully");
//   };

//   return (
//     <div className="card">
//       <div className="card-body">

//         <h4 className="mb-3">User Division Rights</h4>

//         {/* ================= USER SELECT ================= */}
//         <div className="mb-3">
//           <label className="form-label">Select User</label>
//           <select
//             className="form-select"
//             value={selectedUser}
//             onChange={e => handleUserChange(e.target.value)}
//           >
//             <option value="">-- Select User --</option>
//             {users.map(u => (
//               <option key={u.userId} value={u.userId}>
//                 {u.userFullName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ================= DIVISION TABLE ================= */}
//         {selectedUser && (
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Division</th>
//                 <th style={{ width: "120px" }}>Allow</th>
//               </tr>
//             </thead>
//             <tbody>
//               {divisions.map(d => (
//                 <tr key={d.divisionId}>
//                   <td>{d.divisionName}</td>
//                   <td className="text-center">
//                     <input
//                       type="checkbox"
//                       checked={allowedDivisions.has(d.divisionId)}
//                       onChange={() => toggleDivision(d.divisionId)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {/* ================= ACTION BUTTONS ================= */}
//         {selectedUser && (
//           <div className="text-center mt-3">
//             <button
//               className="btn btn-primary me-2"
//               onClick={handleSave}
//               disabled={loading}
//             >
//               SAVE
//             </button>
//             <button
//               className="btn btn-warning"
//               onClick={() => handleUserChange("")}
//             >
//               CANCEL
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
