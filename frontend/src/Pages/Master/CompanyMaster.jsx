import { useEffect, useState } from "react";
import {
  getCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
} from "../../API/companyApi";
import Layout from "../../layout/Layout";
import { toast } from "react-toastify";

export default function CompanyMaster() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Edit States
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getCompanies();
      setList(data || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load company registry.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setName("");
    setCode("");
    setCity("");
    setIsActive(true);
    setEditId(null);
    setShowModal(false);
  };

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.warning("Company Name is mandatory.");
    }

    const payload = {
      companyId: editId || 0,
      companyName: name,
      companyCode: code,
      companyCity: city,
      isActive: isActive
    };

    setLoading(true);
    try {
      if (editId) {
        await updateCompany(editId, payload);
        toast.success("Company updated successfully");
      } else {
        await createCompany(payload);
        toast.success("Company registered successfully");
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

  // START EDIT
  const startEdit = (c) => {
    setEditId(c.companyId);
    setName(c.companyName);
    setCode(c.companyCode || "");
    setCity(c.companyCity || "");
    setIsActive(c.isActive);
    setShowModal(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    setLoading(true);
    try {
      await deleteCompany(id);
      toast.success("Company deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. Company might be linked to locations/users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Company Master</h3>
            <p className="text-info small mb-0">Manage corporate entities and organizational nodes</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-building-add"></i> Register Company
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
              <h5 className="mb-0 text-white fw-bold">{editId ? 'Edit Company Entity' : 'New Company Registration'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Company Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Acme Corp"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Company Code</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. ACME-01"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Headquarter City</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Operational Status</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                      disabled={loading}
                    >
                      <option value="true">Active Entity</option>
                      <option value="false">Inactive Entity</option>
                    </select>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : (editId ? 'Update Entity' : 'Finalize Registration')}
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
                    <th className="py-3">Company Name</th>
                    <th className="py-3">Code</th>
                    <th className="py-3">HQ City</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && list.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Fetching corporate data...</p>
                      </td>
                    </tr>
                  ) : list.length > 0 ? (
                    list.map((c, i) => (
                      <tr key={c.companyId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">{c.companyName}</td>
                        <td><code className="text-info bg-dark px-2 py-1 rounded">{c.companyCode || '---'}</code></td>
                        <td className="text-white-50">{c.companyCity || '---'}</td>
                        <td>
                          {c.isActive ? (
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
                            onClick={() => startEdit(c)}
                            title="Edit"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(c.companyId)}
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
                        <i className="bi bi-buildings fs-2 d-block mb-3"></i>
                        No companies registered yet.
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
