import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../../API/userApi";

import { getDivisions } from "../../API/divisionApi";
import { getUserTypes } from "../../API/userTypeApi";
import { getVendors } from "../../API/vendorApi";   // ⭐ REQUIRED

export default function UserMaster() {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [vendors, setVendors] = useState([]); // ⭐ Vendor list

  const [userFullName, setUserFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userRemark, setUserRemark] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");
  const [vendorId, setVendorId] = useState(""); // ⭐ New field

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    setUsers(await getUsers());
    setDivisions(await getDivisions());
    setUserTypes(await getUserTypes());
    setVendors(await getVendors()); // ⭐ Load vendors
  };

  const resetForm = () => {
    setUserFullName("");
    setUserName("");
    setPassword("");
    setUserRemark("");
    setDivisionId("");
    setUserTypeId("");
    setVendorId("");
    setEditMode(false);
    setEditId(null);
  };

  // const handleSave = async () => {
  //   if (!userFullName || !userName || !password || !divisionId || !userTypeId) {
  //     alert("All fields except remark are required!");
  //     return;
  //   }

  //   // ⭐ Vendor user must select vendor
  //   if (userTypeId == "3" && !vendorId) {
  //     alert("Vendor user must select Vendor!");
  //     return;
  //   }

  //   await createUser({
  //     userFullName,
  //     userName,
  //     password,
  //     userRemark,
  //     divisionId,
  //     userTypeId,
  //     vendorId: userTypeId == "3" ? vendorId : null
  //   });

  //   resetForm();
  //   loadData();
  // };
  const handleSave = async () => {
    // Common required fields
    if (!userName || !password || !divisionId || !userTypeId) {
      alert("All required fields must be filled!");
      return;
    }

    // Full Name required ONLY for non-vendor users
    if (userTypeId !== "3" && !userFullName) {
      alert("Full Name is required!");
      return;
    }

    // Vendor required ONLY for vendor users
    if (userTypeId === "3" && !vendorId) {
      alert("Vendor user must select Vendor!");
      return;
    }

    await createUser({
      userFullName: userTypeId === "3" ? 'Vendor-User' : userFullName, // ✅ NULL for vendor
      userName,
      password,
      userRemark,
      divisionId,
      userTypeId,
      vendorId: userTypeId === "3" ? vendorId : null
    });

    resetForm();
    loadData();
  };


  const handleUserTypeChange = (value) => {
    setUserTypeId(value);

    if (value === "3") {
      // Vendor user → hide full name & clear it
      setUserFullName("");
    } else {
      // Non-vendor user → clear vendor
      setVendorId("");
    }
  };






  const handleEdit = (u) => {
    setEditMode(true);
    setEditId(u.userId);

    setUserFullName(u.userFullName);
    setUserName(u.userName);
    setPassword("");

    setUserRemark(u.userRemark);
    setDivisionId(u.divisionId);
    setUserTypeId(u.userTypeId);
    setVendorId(u.vendorId ?? "");
  };

  const handleUpdate = async () => {
    await updateUser({
      userId: editId,
      userFullName,
      userName,
      password,
      userRemark,
      divisionId,
      userTypeId,
      vendorId: userTypeId == "3" ? vendorId : null
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await deleteUser(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">User Master</h3>

      <div className="card shadow-sm p-4 mb-4">
        <h5>{editMode ? "Edit User" : "Add New User"}</h5>

        <div className="row mt-3">

          <div className="col">
            <select
              className="form-control"
              value={userTypeId}
              // onChange={(e) => setUserTypeId(e.target.value)}
              onChange={(e) => handleUserTypeChange(e.target.value)}

            >
              <option value="">Select User Type</option>
              {userTypes.map((t) => (
                <option key={t.userTypeId} value={t.userTypeId}>
                  {t.userTypeName}
                </option>
              ))}
            </select>
          </div>
          {/* ⭐ Show Vendor dropdown ONLY when userType=Vendor */}
          {userTypeId == "3" && (
            <div className="col">
              <select
                className="form-control"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.vendorId} value={v.vendorId}>
                    {v.vendorName}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* <div className="col">
            <input
              className="form-control"
              placeholder="Full Name"
              value={userFullName}
              onChange={(e) => setUserFullName(e.target.value)}
            />
          </div> */}
          {/* ⭐ Show Full Name ONLY when NOT Vendor */}
          {userTypeId !== "3" && (
            <div className="col">
              <input
                className="form-control"
                placeholder="Full Name"
                value={userFullName}
                onChange={(e) => setUserFullName(e.target.value)}
              />
            </div>
          )}

          <div className="col">
            <input
              className="form-control"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <select
              className="form-control"
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
            >
              <option value="">Select Division</option>
              {divisions.map((d) => (
                <option key={d.divisionId} value={d.divisionId}>
                  {d.divisionName}
                </option>
              ))}
            </select>
          </div>





          <div className="col">
            <input
              className="form-control"
              placeholder="Remark"
              value={userRemark}
              onChange={(e) => setUserRemark(e.target.value)}
            />
          </div>

          <div className="col-auto d-flex">
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

      {/* ===================== USER LIST ===================== */}
      <div className="card shadow-sm p-4">
        <h5>User List</h5>

        <div className="card-body p-0">
          <div className="table-scroll">

            <table className="table mt-3 table table-bordered fixed-header ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Type</th>
                  <th>Full Name</th>
                  <th>User Name</th>
                  <th>Division</th>
                  <th>Vendor</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr key={u.userId}>
                    <td>{i + 1}</td>
                    <td>{userTypes.find(t => t.userTypeId === u.userTypeId)?.userTypeName}</td>
                    {/* <td>{u.userFullName}</td> */}
                    <td>
  {u.userTypeId === 3
    ? u.vendor?.vendorName || "-"
    : u.userFullName}
</td>

                    <td>{u.userName}</td>
                    <td>{divisions.find(d => d.divisionId === u.divisionId)?.divisionName}</td>
                    <td>{u.vendor?.vendorName ?? "-"}</td>

                    <td>{u.userRemark}</td>

                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(u)}>
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
