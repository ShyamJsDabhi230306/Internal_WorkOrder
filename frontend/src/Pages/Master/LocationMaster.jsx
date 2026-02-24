import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../API/locationApi";
import { getCompanies } from "../../API/companyApi";
import { toast } from "react-toastify";

export default function LocationMaster() {
  const [list, setList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [data, comp] = await Promise.all([getLocations(), getCompanies()]);
      setList(data || []);
      setCompanies(comp || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load location data.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCompanyId("");
    setName("");
    setCode("");
    setIsActive(true);
    setEditId(null);
    setShowModal(false);
  };

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId || !name) {
      return toast.warning("Please fill all mandatory fields (Company and Location Name).");
    }

    const payload = {
      locationId: editId || 0,
      companyId: parseInt(companyId),
      locationName: name,
      locationCode: code,
      isActive: isActive
    };

    setLoading(true);
    try {
      if (editId) {
        await updateLocation(editId, payload);
        toast.success("Location updated successfully");
      } else {
        await createLocation(payload);
        toast.success("Location created successfully");
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

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    setLoading(true);
    try {
      await deleteLocation(id);
      toast.success("Location deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. This location might be in use.");
    } finally {
      setLoading(false);
    }
  };

  // START EDIT
  const startEdit = (l) => {
    setEditId(l.locationId);
    setCompanyId(l.companyId);
    setName(l.locationName);
    setCode(l.locationCode || "");
    setIsActive(l.isActive);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Location Master</h3>
            <p className="text-info small mb-0">Manage organizational branch locations and HQ</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-plus-circle"></i> Add New Location
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
              <h5 className="mb-0 text-white fw-bold">{editId ? 'Edit Location' : 'Create New Location'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Company *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c.companyId} value={c.companyId}>
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Location Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Mumbai HQ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Location Code</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. MUM-01"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
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
                        editId ? 'Update Changes' : 'Save Location'
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
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="bg-transparent border-bottom border-secondary">
                  <tr>
                    <th className="ps-4 py-3">#</th>
                    <th className="py-3">Company</th>
                    <th className="py-3">Location Name</th>
                    <th className="py-3">Code</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && list.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Loading locations...</p>
                      </td>
                    </tr>
                  ) : list.length > 0 ? (
                    list.map((l, i) => (
                      <tr key={l.locationId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">
                          {companies.find((c) => c.companyId === l.companyId)?.companyName || 'N/A'}
                        </td>
                        <td className="text-white-50">{l.locationName}</td>
                        <td><code className="text-info bg-dark px-2 py-1 rounded">{l.locationCode || '---'}</code></td>
                        <td>
                          {l.isActive ? (
                            <span className="badge rounded-pill bg-success-subtle text-success border border-success px-3">
                              Active
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger px-3">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => startEdit(l)}
                            title="Edit"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(l.locationId)}
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
                        No locations found.
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