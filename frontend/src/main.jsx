import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './assets/css/style.css';
// import './assets/css/responsive.css';
import "./assets/css/responsive2.css";

import './assets/css/layout.css';
import './assets/css/table.css';
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
