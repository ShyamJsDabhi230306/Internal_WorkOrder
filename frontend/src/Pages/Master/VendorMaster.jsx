import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor
} from "../../API/vendorApi";

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);

  const [vendorName, setVendorName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonNo, setContactPersonNo] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const data = await getVendors();
    setVendors(data);
  };

  const resetForm = () => {
    setVendorName("");
    setAddress("");
    setContactPersonName("");
    setContactPersonNo("");
    setEditMode(false);
    setEditId(null);
  };

  // ⭐ AUTO GENERATE USERNAME + PASSWORD
  const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s+/g, "") + "_vendor";
  };

  const defaultPassword = "123456"; // ⭐ Your default password

  const handleSave = async () => {
    if (!vendorName) {
      alert("Vendor Name is required!");
      return;
    }

    await createVendor({
      vendorId: 0,
      vendorName,
      address,
      contactPersonName,
      contactPersonNo,

      // ⭐ AUTO GENERATED USERNAME & PASSWORD
      userName: generateUsername(vendorName),
      password: defaultPassword,
    });

    resetForm();
    loadData();
  };

  const handleEdit = (v) => {
    setEditMode(true);
    setEditId(v.vendorId);

    setVendorName(v.vendorName);
    setAddress(v.address);
    setContactPersonName(v.contactPersonName);
    setContactPersonNo(v.contactPersonNo);
  };

  const handleUpdate = async () => {
    await updateVendor({
      vendorId: editId,
      vendorName,
      address,
      contactPersonName,
      contactPersonNo,

      // ⭐ Still keep username & password on update
      userName: generateUsername(vendorName),
      password: defaultPassword,
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await deleteVendor(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">Vendor Master</h3>
      <p className="text-muted">Manage vendor details</p>

      <div className="card shadow-sm p-4 mb-4">
        <h5>{editMode ? "Edit Vendor" : "Add New Vendor"}</h5>

        <div className="row mt-3">
          <div className="col-md-4 mb-3">
            <input
              className="form-control"
              placeholder="Vendor Name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              className="form-control"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              className="form-control"
              placeholder="Contact Person Name"
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              className="form-control"
              placeholder="Contact Number"
              value={contactPersonNo}
              onChange={(e) => setContactPersonNo(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3">
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

      {/* Vendor List */}
      <div className="card shadow-sm p-4">
        <h5>Vendor List</h5>

           <div className="card-body p-0">
          <div className="table-scroll">

        <table className="table mt-3 table table-bordered fixed-header ">
          <thead>
            <tr>
              <th>#</th>
              <th>Vendor Name</th>
              <th>Address</th>
              <th>Contact Person</th>
              <th>Contact No</th>
              <th>Action</th>
              {/* <th>Username</th> */}
            </tr>
          </thead>

          <tbody>
            {vendors.map((v, i) => (
              <tr key={v.vendorId}>
                <td>{i + 1}</td>
                <td>{v.vendorName}</td>
                <td>{v.address}</td>
                <td>{v.contactPersonName}</td>
                <td>{v.contactPersonNo}</td>
                {/* <td>{v.userName}</td> */}

                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleEdit(v)}
                  >
                    Edit
                  </button>
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
