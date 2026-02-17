import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

import { getProducts, createProduct, updateProduct, deleteProduct } from "../../API/productApi";
import { getCategories } from "../../API/categoryApi";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productRemark, setProductRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load Product + Category
  const loadData = async () => {
    setProducts(await getProducts());
    setCategories(await getCategories());
  };

  const resetForm = () => {
    setProductName("");
    setProductRemark("");
    setCategoryId("");
    setEditMode(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!productName || !categoryId) {
      alert("Category & Product Name are required!");
      return;
    }

    await createProduct({
      productName,
      categoryId,
      productRemark,
    });

    resetForm();
    loadData();
  };

  const handleEdit = (p) => {
    setEditMode(true);
    setEditId(p.productId);
    setProductName(p.productName);
    setCategoryId(p.categoryId);
    setProductRemark(p.productRemark);
  };

  const handleUpdate = async () => {
    await updateProduct({
      productId: editId,
      productName,
      categoryId,
      productRemark,
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">Product Master</h3>
      <p className="text-muted">Manage product master data</p>

      {/* FORM */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>{editMode ? "Edit Product" : "Add New Product"}</h5>

        <div className="row mt-3">

          {/* CATEGORY DROPDOWN */}
          <div className="col">
            <select
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT NAME */}
          <div className="col">
            <input
              className="form-control"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* REMARK */}
          <div className="col">
            <input
              className="form-control"
              placeholder="Remark (optional)"
              value={productRemark}
              onChange={(e) => setProductRemark(e.target.value)}
            />
          </div>

          <div className="col-auto">
            {editMode ? (
              <>
                <button className="btn btn-warning me-2" onClick={handleUpdate}>
                  Update
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="card shadow-sm p-4">
        <h5>Product List</h5>

           <div className="card-body p-0">
          <div className="table-scroll">

        <table className="table mt-3 table table-bordered fixed-header ">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Product Name</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={p.productId}>
                <td>{i + 1}</td>
                <td>
                  {categories.find((c) => c.categoryId === p.categoryId)?.categoryName}
                </td>
                <td>{p.productName}</td>
                <td>{p.productRemark}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  {/* <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.productId)}>
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
      </div>
    </Layout>
  );
}
