// import { useAuth } from "../API/AuthContext";

// export default function Topbar() {
//   const { auth, logout } = useAuth();

//   return (
//     <div
//       className="d-flex justify-content-end align-items-center px-4 py-2 shadow-sm bg-white"
//       style={{ height: "60px" }}
//     >
//       <span className="me-3 text-muted">
//         Logged in as <strong>{auth?.userName}</strong>
//       </span>
//       <button className="btn btn-sm btn-outline-danger" onClick={logout}>
//         Logout
//       </button>
//     </div>
//   );
// }


// import { useAuth } from "../API/AuthContext";
// import '../assets/css/Topbar.css';

// export default function Topbar() {
//   const { auth, logout } = useAuth();

//   return (
//     <header className="header-main shadow-sm">
//       <div className="container-fluid h-100 d-flex align-items-center justify-content-between px-4">

//         {/* LEFT (PAGE TITLE / LOGO PLACEHOLDER) */}
//         <div className="d-flex align-items-center gap-2">
//           <i className="bi bi-grid text-primary fs-5"></i>
//           <span className="fw-semibold text-dark">Dashboard</span>
//         </div>

//         {/* RIGHT (USER INFO) */}
//         <div className="d-flex align-items-center gap-3">
//           <div className="d-flex align-items-center gap-2">
//             <div className="avatar-circle">
//               {auth?.userName?.charAt(0)?.toUpperCase()}
//             </div>
//             <span className="text-muted">
//               {auth?.userName}
//             </span>
//           </div>

//           <button
//             className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
//             onClick={logout}
//           >
//             <i className="bi bi-box-arrow-right"></i>
//             Logout
//           </button>
//         </div>

//       </div>
//     </header>
//   );
// }


import { useAuth } from "../API/AuthContext";
import "../assets/css/Topbar.css";

export default function Topbar({ toggleSidebar }) {
  const { auth, logout } = useAuth();

  return (
    <header className="header-main shadow-sm">
      <div className="container-fluid h-100 d-flex align-items-center justify-content-between px-4">

        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-grid text-primary fs-5"></i>
            <span className="fw-semibold text-dark">Dashboard</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-circle">
              {auth?.userName?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-muted">{auth?.userName}</span>
          </div>

          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}
