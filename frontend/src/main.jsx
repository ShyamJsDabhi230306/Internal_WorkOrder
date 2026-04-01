import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
// import './assets/css/responsive.css';
// import "./assets/css/responsive2.css";

import './assets/css/table.css';
import './assets/css/style.css';
import './assets/css/layout.css';
/* index.css MUST be last so our white-text overrides win the cascade */
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
