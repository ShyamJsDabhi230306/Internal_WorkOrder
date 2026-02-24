import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../API/productApi";
import { getCategories } from "../../API/categoryApi";
import { toast } from "react-toastify";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productRemark, setProductRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load Product + Category
  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodData || []);
      setCategories(catData || []);
    } catch (error) {
      console.error("Load Error:", error);
      setLoadError("Failed to load product data.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setProductName("");
    setProductRemark("");
    setCategoryId("");
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!productName || !categoryId) {
      return toast.warning("Category & Product Name are required!");
    }

    setLoading(true);
    try {
      await createProduct({
        productName,
        categoryId: Number(categoryId),
        productRemark,
      });
      toast.success("Product created successfully");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct({
        productId: editId,
        productName,
        categoryId: Number(categoryId),
        productRemark,
      });
      toast.success("Product updated successfully");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditMode(true);
    setEditId(p.productId);
    setProductName(p.productName);
    setCategoryId(p.categoryId);
    setProductRemark(p.productRemark);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed. Product might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0 text-white fw-bold">Product Master</h3>
            <p className="text-info small mb-0">Manage items and SKU definitions</p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow"
            onClick={() => { resetForm(); setShowModal(true); }}
            disabled={loading}
          >
            <i className="bi bi-plus-circle"></i> Add Product
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
              <h5 className="mb-0 text-white fw-bold">{editMode ? "Edit Product" : "Add New Product"}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={editMode ? handleUpdate : handleSave}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Category *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Product Name *</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Enter product name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-info small fw-bold">Remark (Optional)</label>
                    <input
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Additional notes"
                      value={productRemark}
                      onChange={(e) => setProductRemark(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 shadow" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm"></span> : (editMode ? "Update Changes" : "Save Product")}
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
                    <th className="py-3">Category</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Remark</th>
                    <th className="py-3 pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="spinner-border text-info"></div>
                        <p className="mt-2 text-white-50">Loading products...</p>
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((p, i) => (
                      <tr key={p.productId} className="border-bottom border-secondary">
                        <td className="ps-4 text-white-50">{i + 1}</td>
                        <td className="text-info small fw-bold">
                          {categories.find((c) => c.categoryId === p.categoryId)?.categoryName || 'N/A'}
                        </td>
                        <td className="fw-bold text-white">{p.productName}</td>
                        <td className="text-white-50">{p.productRemark || '---'}</td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleEdit(p)}
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p.productId)}
                            disabled={loading}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-3"></i>
                        No products found.
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
