import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../../API/divisionApi";
import { getLocations } from "../../API/locationApi";
import { toast } from "react-toastify";

export default function DivisionMaster() {
  const [list, setList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [locationId, setLocationId] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [divisionCode, setDivisionCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [divData, locData] = await Promise.all([getDivisions(), getLocations()]);
      setList(divData || []);
      setLocations(locData || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load division data.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setLocationId("");
    setDivisionName("");
    setDivisionCode("");
    setIsActive(true);
    setEditId(null);
    setShowModal(false);
  };

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationId || !divisionName) {
      return toast.warning("Please fill all mandatory fields (Location and Division Name).");
    }

    const payload = {
      divisionId: editId || 0,
      locationId: Number(locationId),
      divisionName,
      divisionCode,
      isActive,
    };

    setLoading(true);
    try {
      if (editId) {
        await updateDivision(editId, payload);
        toast.success("Division updated successfully");
      } else {
        await createDivision(payload);
        toast.success("Division created successfully");
      }
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Operation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const startEdit = (d) => {
    setEditId(d.divisionId);
    setLocationId(d.locationId);
    setDivisionName(d.divisionName);
    setDivisionCode(d.divisionCode || "");
    setIsActive(d.isActive);
    setShowModal(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this division?")) return;
    setLoading(true);
    try {
      await deleteDivision(id);
      toast.success("Division deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. This division might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Division Master</h3>
            <p className="text-info small mb-0">Manage organizational divisions and departments</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-plus-circle"></i> Add New Division
          </button>
        </div>

        {/* LOADING & ERROR INDICATORS */}
        {loadError && (
          <div className="alert alert-danger shadow-sm border-0 mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {loadError}
          </div>
        )}

        {/* MODAL FORM */}
        {showModal && (
          <div className="card bg-dark-glass border-0 mb-4 shadow-lg animate__animated animate__fadeInDown">
            <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 text-white fw-bold">{editId ? 'Edit Division' : 'Create New Division'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Location *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Location</option>
                      {locations.map((l) => (
                        <option key={l.locationId} value={l.locationId}>
                          {l.locationName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Division Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Quality Control"
                      value={divisionName}
                      onChange={(e) => setDivisionName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Division Code</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. QC-01"
                      value={divisionCode}
                      onChange={(e) => setDivisionCode(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Status</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                      disabled={loading}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        editId ? 'Update Changes' : 'Save Division'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LIST SECTION */}
        <div className="card bg-dark-glass border-0 shadow-lg overflow-hidden">
          <div className="card-body p-0">
            <div 
  className="table-responsive"
  style={{ 
    maxHeight: "500px", 
    overflowY: "auto" 
  }}
>
              <table className="table table-dark table-hover align-middle mb-0">
               <thead 
  className="bg-dark border-bottom border-secondary"
  style={{ 
    position: "sticky", 
    top: 0, 
    zIndex: 2 
  }}
>
                  <tr>
                    <th className="ps-4 py-3">#</th>
                    <th className="py-3">Division Name</th>
                    <th className="py-3">Code</th>
                    <th className="py-3">Location</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && list.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Loading divisions...</p>
                      </td>
                    </tr>
                  ) : list.length > 0 ? (
                    list.map((d, i) => (
                      <tr key={d.divisionId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">{d.divisionName}</td>
                        <td><code className="text-info bg-dark px-2 py-1 rounded">{d.divisionCode || '---'}</code></td>
                        <td className="text-white-50">
                          {locations.find((l) => l.locationId === d.locationId)?.locationName || 'N/A'}
                        </td>
                        <td>
                          {d.isActive ? (
                            <span className="badge bg-primary text-white border border-info px-2 py-1">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-primary text-white border border-info px-2 py-1">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => startEdit(d)}
                            title="Edit"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(d.divisionId)}
                            title="Delete"
                            disabled={loading}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-3"></i>
                        No divisions found.
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