import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../../API/divisionApi";

import { getCompanies } from "../../API/companyApi"; // for dropdown

export default function DivisionMaster() {
  const [list, setList] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [divisionId, setDivisionId] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const [divisionName, setDivisionName] = useState("");

  // LOAD DATA
  const loadData = async () => {
    const divData = await getDivisions();
    setList(divData);

    const compData = await getCompanies();
    setCompanies(compData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setDivisionId(null);
    setCompanyId("");
    setDivisionName("");
  };

  // SAVE
  const handleSave = async () => {
    if (!companyId || !divisionName) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      divisionId,
      companyId: Number(companyId),
      divisionName,
    };

    if (divisionId) {
      await updateDivision(divisionId, payload);
    } else {
      await createDivision(payload);
    }

    resetForm();
    loadData();
  };

  // EDIT
  const handleEdit = (d) => {
    setDivisionId(d.divisionId);
    setCompanyId(d.companyId);
    setDivisionName(d.divisionName);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this division?")) return;

    await deleteDivision(id);
    loadData();
  };

  return (
    <Layout>
      <h3 className="mb-3">Division Master</h3>
      <p className="text-muted">Manage division data</p>

      {/* ADD / UPDATE FORM */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>{divisionId ? "Update Division" : "Add New Division"}</h5>

        <div className="row mt-3">

          {/* Company Dropdown */}
          <div className="col">
            <label className="form-label">Select Company</label>
            <select
              className="form-control"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Division Name */}
          <div className="col">
            <label className="form-label">Division Name</label>
            <input
              className="form-control"
              placeholder="Enter division name"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
            />
          </div>

          <div className="col-auto d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={handleSave}>
              {divisionId ? "Update" : "Save"}
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card shadow-sm p-4">
        <h5>Division List</h5>
           <div className="card-body p-0">
          <div className="table-scroll">

        <table className="table mt-3 table table-bordered fixed-header ">
       
          <thead>
            <tr>
              <th>#</th>
              <th>Division</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((d, i) => (
              <tr key={d.divisionId}>
                <td>{i + 1}</td>
                <td>{d.divisionName}</td>
                <td>
                  {
                    companies.find((c) => c.companyId === d.companyId)
                      ?.companyName
                  }
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </button>

                  {/* <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(d.divisionId)}
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
