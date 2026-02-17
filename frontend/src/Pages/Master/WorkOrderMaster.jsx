import { NavLink, Outlet } from "react-router-dom";
import Layout from "../../layout/Layout";


export default function WorkOrderPage() {
  return (
    <Layout>
      <div className="container-fluid py-3">

        <h3 className="fw-bold mb-3">Work Order</h3>
      
        
        <Outlet />
      </div>
    </Layout>
  );
}
