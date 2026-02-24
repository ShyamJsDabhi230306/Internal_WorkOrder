import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor
} from "../../API/vendorApi";
import { toast } from "react-toastify";

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [vendorName, setVendorName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonNo, setContactPersonNo] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getVendors();
      setVendors(data || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load vendor directory.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setVendorName("");
    setAddress("");
    setContactPersonName("");
    setContactPersonNo("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s+/g, "") + "_vendor";
  };

  const defaultPassword = "123456";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorName) {
      return toast.warning("Vendor Name is mandatory.");
    }

    const payload = {
      vendorId: editId || 0,
      vendorName,
      address,
      contactPersonName,
      contactPersonNo,
      userName: generateUsername(vendorName),
      password: defaultPassword,
    };

    setLoading(true);
    try {
      if (editMode) {
        await updateVendor(payload);
        toast.success("Vendor updated successfully");
      } else {
        await createVendor(payload);
        toast.success("Vendor registered successfully");
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

  const handleEdit = (v) => {
    setEditMode(true);
    setEditId(v.vendorId);
    setVendorName(v.vendorName);
    setAddress(v.address || "");
    setContactPersonName(v.contactPersonName || "");
    setContactPersonNo(v.contactPersonNo || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    setLoading(true);
    try {
      await deleteVendor(id);
      toast.success("Vendor deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. Vendor might have associated work orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Vendor Master</h3>
            <p className="text-info small mb-0">Manage service providers and external workshop partners</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-person-plus"></i> Register Vendor
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
              <h5 className="mb-0 text-white fw-bold">{editMode ? "Edit Vendor Profile" : "New Vendor Registration"}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Vendor/Company Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Reliance Workshop"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label text-info small fw-bold">Full Address</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Building, Street, Area, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Contact Person</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Mukesh Ambani"
                      value={contactPersonName}
                      onChange={(e) => setContactPersonName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Mobile/WhatsApp No</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. +91 9999999999"
                      value={contactPersonNo}
                      onChange={(e) => setContactPersonNo(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="small text-white-50 p-2 border border-secondary rounded w-100 bg-black-subtle">
                      <i className="bi bi-info-circle me-1 animate__animated animate__pulse animate__infinite"></i>
                      Login credentials will be auto-generated.
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm"></span> : (editMode ? "Save Changes" : "Register Vendor")}
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
                    <th className="py-3">Vendor Name</th>
                    <th className="py-3">Contact Person</th>
                    <th className="py-3">Address</th>
                    <th className="py-3">Mobile</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && vendors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Fetching vendor data...</p>
                      </td>
                    </tr>
                  ) : vendors.length > 0 ? (
                    vendors.map((v, i) => (
                      <tr key={v.vendorId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">{v.vendorName}</td>
                        <td className="text-white small fw-bold">{v.contactPersonName || '---'}</td>
                        <td className="text-white-50 small" style={{ maxWidth: '250px' }}>
                          <span className="text-truncate d-inline-block w-100">{v.address || '---'}</span>
                        </td>
                        <td className="text-white-50 font-monospace small">{v.contactPersonNo || '---'}</td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleEdit(v)}
                            title="Edit"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(v.vendorId)}
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
                        <i className="bi bi-people fs-2 d-block mb-3"></i>
                        No vendors found in the directory.
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
