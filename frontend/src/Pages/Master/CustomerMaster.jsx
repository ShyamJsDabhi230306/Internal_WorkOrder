import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../../API/customerApi";
import { toast } from "react-toastify";

export default function CustomerMaster() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [customerRemark, setCustomerRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await getCustomers();
      setCustomers(list || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load customer list.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCustomerName("");
    setCustomerRemark("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName) {
      return toast.warning("Customer Name is required.");
    }

    const payload = {
      customerId: editId || 0,
      customerName,
      customerRemark,
    };

    setLoading(true);
    try {
      if (editMode) {
        await updateCustomer(payload);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(payload);
        toast.success("Customer registered successfully");
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

  const handleEdit = (customer) => {
    setEditMode(true);
    setEditId(customer.customerId);
    setCustomerName(customer.customerName);
    setCustomerRemark(customer.customerRemark || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. Customer might have active work orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Customer Master</h3>
            <p className="text-info small mb-0">Record and manage client database</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-person-plus-fill"></i> Add Customer
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
              <h5 className="mb-0 text-white fw-bold">{editMode ? 'Edit Customer' : 'Add New Customer'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-info small fw-bold">Full Name / Business Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Reliance Industries"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-info small fw-bold">Customer Remarks</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Special instructions or notes"
                      value={customerRemark}
                      onChange={(e) => setCustomerRemark(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : (editMode ? 'Update Customer' : 'Register Customer')}
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
                    <th className="py-3">Customer Name</th>
                    <th className="py-3">Remarks / Notes</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && customers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Syncing customers...</p>
                      </td>
                    </tr>
                  ) : customers.length > 0 ? (
                    customers.map((c, i) => (
                      <tr key={c.customerId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">{c.customerName}</td>
                        <td className="text-white-50">{c.customerRemark || '---'}</td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleEdit(c)}
                            title="Edit"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(c.customerId)}
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
                      <td colSpan="4" className="text-center py-5 text-muted">
                        <i className="bi bi-person-badge fs-2 d-block mb-3"></i>
                        No customer records available.
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
