import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../../API/userApi";
import { getDivisions } from "../../API/divisionApi";
import { getUserTypes } from "../../API/userTypeApi";
import { getLocations } from "../../API/locationApi";
import { toast } from "react-toastify";
import { useAuth } from "../../API/AuthContext";

export default function UserMaster() {
  const { auth } = useAuth();
  const isAdmin = parseInt(auth?.userTypeId) === 1;

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [userFullName, setUserFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userRemark, setUserRemark] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [u, d, t, l] = await Promise.all([
        getUsers(),
        getDivisions(),
        getUserTypes(),
        getLocations()
      ]);
      setUsers(u || []);
      setDivisions(d || []);
      setUserTypes(t || []);
      setLocations(l || []);
    } catch (error) {
      console.error("Error loading UserMaster data:", error);
      setLoadError("Failed to load user management data.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setUserFullName("");
    setUserName("");
    setPassword("");
    setUserRemark("");
    setDivisionId("");
    setLocationId("");
    setUserTypeId("");
    setMobileNumber("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleDivisionChange = (e) => {
    const selectedDivId = e.target.value;
    setDivisionId(selectedDivId);

    if (selectedDivId) {
      const selectedDiv = divisions.find(
        (d) => d.divisionId === Number(selectedDivId)
      );
      if (selectedDiv?.locationId) {
        setLocationId(String(selectedDiv.locationId));
      } else {
        setLocationId("");
      }
    } else {
      setLocationId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || (!editMode && !password) || !divisionId || !userTypeId) {
      return toast.warning("Mandatory: User Name, Password, Division, and User Type.");
    }

    const payload = {
      userId: editId || 0,
      userFullName,
      userName,
      password,
      userRemark,
      divisionId: Number(divisionId),
      locationId: Number(locationId) || null,
      userTypeId: Number(userTypeId),
      mobileNumber
    };

    setLoading(true);
    try {
      if (editMode) {
        await updateUser(payload);
        toast.success("User updated successfully");
      } else {
        await createUser(payload);
        toast.success("User created successfully");
      }
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setEditMode(true);
    setEditId(u.userId);
    setUserFullName(u.userFullName || "");
    setUserName(u.userName || "");
    setPassword(""); // Keep password empty on edit start
    setUserRemark(u.userRemark || "");
    setDivisionId(String(u.divisionId || ""));
    setLocationId(String(u.locationId || ""));
    setUserTypeId(String(u.userTypeId || ""));
    setMobileNumber(u.mobileNumber || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDivLocationName = locationId
    ? locations.find((l) => l.locationId === Number(locationId))?.locationName
    : null;

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">User Master</h3>
            <p className="text-info small mb-0">System access and profile management</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-person-plus-fill"></i> Add New User
          </button>
        </div>

        {loadError && (
          <div className="alert alert-danger border-0 shadow-sm mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {loadError}
          </div>
        )}

        {showModal && (
          <div className="card bg-dark-glass border-0 mb-4 shadow-lg animate__animated animate__fadeInDown">
            <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 text-white fw-bold">{editMode ? "Edit User Profile" : "Register New User"}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">User Role *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={userTypeId}
                      onChange={(e) => setUserTypeId(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Role</option>
                      {userTypes.map((t) => (
                        <option key={t.userTypeId} value={t.userTypeId}>{t.userTypeName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">Primary Division *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={divisionId}
                      onChange={handleDivisionChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d.divisionId} value={d.divisionId}>{d.divisionName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">Location <small className="text-muted">(Auto-set)</small></label>
                    <input
                      className="form-control bg-dark border-secondary text-info fw-bold"
                      readOnly
                      value={selectedDivLocationName || "Set by Division"}
                      style={{ fontStyle: selectedDivLocationName ? "normal" : "italic" }}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">Full Name</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. John Doe"
                      value={userFullName}
                      onChange={(e) => setUserFullName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">User Name (Login) *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. jdoe123"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">
                      Password {editMode && <small className="text-warning font-monospace">(Blank = current)</small>}
                    </label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      type="text"
                      placeholder="Define security key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!editMode}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">Mobile #</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="+91 XXXXXXXXXX"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-info small fw-bold">Notes</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Internal remarks"
                      value={userRemark}
                      onChange={(e) => setUserRemark(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : (editMode ? "Update Profile" : "Create User")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card bg-dark-glass border-0 shadow-lg overflow-hidden">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="bg-transparent border-bottom border-secondary">
                  <tr>
                    <th className="ps-4 py-3">#</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Full Name</th>
                    <th className="py-3">User ID</th>
                    {isAdmin && <th className="py-3">Key</th>}
                    <th className="py-3">Branch/Div</th>
                    <th className="py-3">Mobile</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7} className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Synchronizing users...</p>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((u, i) => (
                      <tr key={u.userId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td><span className="badge bg-info-subtle text-info border border-info">{u.userTypeName}</span></td>
                        <td>{u.userFullName}</td>
                        <td className="fw-bold text-white">{u.userName}</td>
                        {isAdmin && (
                          <td>
                            <code style={{ color: "#ffffff", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                              {u.password || "-"}
                            </code>
                          </td>
                        )}
                        <td>
                          <div className="small text-white-50">{u.locationName}</div>
                          <div className="small text-info">{u.divisionName}</div>
                        </td>
                        <td className="text-white-50">{u.mobileNumber || "-"}</td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleEdit(u)}
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u.userId)}
                            disabled={loading}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7} className="text-center py-5 text-muted">
                        <i className="bi bi-person-x fs-2 d-block mb-3"></i>
                        No users registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
