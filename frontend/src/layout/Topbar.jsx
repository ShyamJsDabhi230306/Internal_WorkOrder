import { useAuth } from "../API/AuthContext";
import "../assets/css/Topbar.css";

export default function Topbar({ toggleSidebar }) {
  const { auth, logout } = useAuth();

  return (
    <header className="header-main">
      <div className="container-fluid h-100 d-flex align-items-center justify-content-between px-4">

        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-light border-0 fs-4 p-0"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            <i className="bi bi-list text-white"></i>
          </button>

          <div className="d-flex align-items-center gap-2 ms-2">
            {/* <div className="p-2 bg-primary bg-opacity-10 rounded-3">
              <i className="bi bi-grid-fill text-primary"></i>
            </div> */}
            <span className="fw-bold text-white letter-spacing-1 h5 m-0 d-none d-md-block">Aira Euro Automation Pvt Ltd  <span className="text-primary"></span></span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-3 pe-3 border-end border-white border-opacity-10">
            <div className="text-end d-none d-sm-block">
              <div className="text-white fw-bold small mb-0 lh-1">{auth?.fullName || auth?.userName}</div>
              <small className="text-primary small uppercase fw-bold" style={{ fontSize: '10px' }}>{auth?.userTypeId === 1 ? 'Administrator' : 'System User'}</small>
            </div>

            <div className="avatar-wrapper position-relative">
              <div className="avatar-circle shadow-lg border border-primary border-opacity-50">
                {auth?.userName?.charAt(0)?.toUpperCase()}
              </div>
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-dark rounded-circle" style={{ width: '10px', height: '10px' }}></span>
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 py-1 px-3"
            onClick={logout}
            style={{ borderRadius: '20px' }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-md-block fw-bold small">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
