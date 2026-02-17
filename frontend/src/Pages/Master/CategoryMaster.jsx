import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../API/categoryApi";

export default function CategoryMaster() {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [categoryRemark, setCategoryRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryRemark("");
    setEditMode(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!categoryName) {
      alert("Category name is required");
      return;
    }

    await createCategory({
      categoryName,
      categoryRemark,
    });

    resetForm();
    loadData();
  };

  const handleEdit = (cat) => {
    setEditMode(true);
    setEditId(cat.categoryId);
    setCategoryName(cat.categoryName);
    setCategoryRemark(cat.categoryRemark);
  };

  const handleUpdate = async () => {
    await updateCategory({
      categoryId: editId,
      categoryName,
      categoryRemark,
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">Category Master</h3>
      <p className="text-muted">Manage category master data</p>

      {/* ADD CATEGORY */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>{editMode ? "Edit Category" : "Add New Category"}</h5>

        <div className="row mt-3">
          <div className="col">
            <input
              className="form-control"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Remark (optional)"
              value={categoryRemark}
              onChange={(e) => setCategoryRemark(e.target.value)}
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

      {/* CATEGORY LIST */}
      <div className="card shadow-sm p-4">
        <h5>Category List</h5>

         <div className="card-body p-0">
          <div className="table-scroll">

        <table className="table mt-3 table table-bordered fixed-header ">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c, i) => (
              <tr key={c.categoryId}>
                <td>{i + 1}</td>
                <td>{c.categoryName}</td>
                <td>{c.categoryRemark}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(c.categoryId)}
                  >
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
