import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../API/categoryApi";
import { toast } from "react-toastify";

export default function CategoryMaster() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryRemark, setCategoryRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load categories.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCategoryName("");
    setCategoryRemark("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      return toast.warning("Category name is required.");
    }

    setLoading(true);
    try {
      await createCategory({
        categoryName,
        categoryRemark,
      });
      toast.success("Category created successfully");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCategory({
        categoryId: editId,
        categoryName,
        categoryRemark,
      });
      toast.success("Category updated successfully");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditMode(true);
    setEditId(cat.categoryId);
    setCategoryName(cat.categoryName);
    setCategoryRemark(cat.categoryRemark);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. Category might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Category Master</h3>
            <p className="text-info small mb-0">Manage product and service categories</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-plus-circle"></i> Add Category
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
              <h5 className="mb-0 text-white fw-bold">{editMode ? "Edit Category" : "Add New Category"}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={editMode ? handleUpdate : handleSave}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-info small fw-bold">Category Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-info small fw-bold">Remark (Optional)</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Additional notes"
                      value={categoryRemark}
                      onChange={(e) => setCategoryRemark(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm"></span> : (editMode ? "Update Changes" : "Save Category")}
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
                    <th className="py-3">Category Name</th>
                    <th className="py-3">Remark</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Loading categories...</p>
                      </td>
                    </tr>
                  ) : categories.length > 0 ? (
                    categories.map((c, i) => (
                      <tr key={c.categoryId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="fw-bold text-white">{c.categoryName}</td>
                        <td className="text-white-50">{c.categoryRemark || '---'}</td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleEdit(c)}
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(c.categoryId)}
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
                        <i className="bi bi-inbox fs-2 d-block mb-3"></i>
                        No categories found.
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
