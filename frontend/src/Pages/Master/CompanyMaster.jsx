import { useEffect, useState } from "react";
import { getCompanies, createCompany, deleteCompany, updateCompany } from "../../API/companyApi";
import Layout from "../../layout/Layout";

export default function CompanyMaster() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");

  // EDIT STATES
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editCity, setEditCity] = useState("");

  const loadData = async () => {
    const data = await getCompanies();
    setList(data);
  };

  // ADD COMPANY
  const handleSave = async () => {
    await createCompany({
      companyName: name || "",
      companyCode: code || "",
      companyCity: city || "",
    });

    setName("");
    setCode("");
    setCity("");
    loadData();
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteCompany(id);
    loadData();
  };

  // START EDIT
  const startEdit = (c) => {
    setEditId(c.companyId);
    setEditName(c.companyName);
    setEditCode(c.companyCode);
    setEditCity(c.companyCity);
  };

  // UPDATE
  const handleUpdate = async () => {
    await updateCompany(editId, {
      companyId: editId,
      companyName: editName,
      companyCode: editCode,
      companyCity: editCity,
    });

    setEditId(null);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <h3 className="mb-3">Company Master</h3>

      {/* ADD SECTION */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>Add New Company</h5>

        <div className="row mt-3">

          <div className="col">
            <label>Company Name</label>
            <input
              className="form-control"
              placeholder="Enter company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col">
            <label>Company Code</label>
            <input
              className="form-control"
              placeholder="Enter company code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="col">
            <label>City</label>
            <input
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="col-auto d-flex align-items-end">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>

        </div>
      </div>

      {/* EDIT SECTION */}
      {editId && (
        <div className="card shadow-sm p-4 mb-4 border-primary">
          <h5>Edit Company</h5>

          <div className="row mt-3">

            <div className="col">
              <label>Company Name</label>
              <input
                className="form-control"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="col">
              <label>Company Code</label>
              <input
                className="form-control"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
              />
            </div>

            <div className="col">
              <label>City</label>
              <input
                className="form-control"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
              />
            </div>

            <div className="col-auto d-flex align-items-end gap-2">
              <button className="btn btn-success" onClick={handleUpdate}>
                Update
              </button>
              <button className="btn btn-secondary" onClick={() => setEditId(null)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LIST */}
      <div className="card shadow-sm p-4">
        <h5>Company Master List</h5>
         <div className="card-body p-0">
          <div className="table-scroll">

        <table className="table mt-3 table table-bordered fixed-header ">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((c, i) => (
              <tr key={c.companyId}>
                <td>{i + 1}</td>
                <td>{c.companyName}</td>
                <td>{c.companyCode}</td>
                <td>{c.companyCity}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  {/* <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.companyId)}>
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
