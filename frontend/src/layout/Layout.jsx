// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// export default function Layout({ children }) {
//   return (
//     <div className="app-wrapper ltr">
//       <Sidebar />

//       <div className="app-content">
//         <Topbar />

//         <main className="page-content">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`app-wrapper ltr ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      
      {sidebarOpen && <Sidebar />}

      <div className="app-content">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
