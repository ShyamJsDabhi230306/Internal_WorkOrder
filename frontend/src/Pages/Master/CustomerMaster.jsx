import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../../API/customerApi";

export default function CustomerMaster() {
  const [customers, setCustomers] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerRemark, setCustomerRemark] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const list = await getCustomers();
    setCustomers(list);
  };

  const handleSave = async () => {
    if (!customerName) {
      alert("Customer name is required");
      return;
    }

    await createCustomer({
      customerName,
      customerRemark,
    });

    resetForm();
    loadData();
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerRemark("");
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (customer) => {
    setEditMode(true);
    setEditId(customer.customerId);
    setCustomerName(customer.customerName);
    setCustomerRemark(customer.customerRemark);
  };

  const handleUpdate = async () => {
    await updateCustomer({
      customerId: editId,
      customerName,
      customerRemark,
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">Customer Master</h3>
      <p className="text-muted">Manage customer records</p>

      {/* ADD/UPDATE CUSTOMER */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>{editMode ? "Edit Customer" : "Add Customer"}</h5>

        <div className="row mt-3">

          <div className="col">
            <input
              className="form-control"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Remark (optional)"
              value={customerRemark}
              onChange={(e) => setCustomerRemark(e.target.value)}
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

      {/* CUSTOMER LIST TABLE */}
      <div className="card shadow-sm p-4">
        <h5>Customer List</h5>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c, i) => (
              <tr key={c.customerId}>
                <td>{i + 1}</td>
                <td>{c.customerName}</td>
                <td>{c.customerRemark}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(c.customerId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </Layout>
  );
}
