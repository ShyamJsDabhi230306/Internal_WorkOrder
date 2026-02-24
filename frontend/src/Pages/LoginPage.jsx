




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../API/AuthContext";
import axiosClient from "../API/axiosClient";
import { toast } from "react-toastify";
import "../assets/css/LoginPage.css";

import logoUrl from "../assets/images/aira.png";

const API = "/Auth/login";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const { data } = await axiosClient.post(API, {
        UserName: username,
        Password: password,
      });

      toast.success("Login successful!");
      localStorage.setItem("token", data.token);

      const authObj = {
        userId: data.user.userId || data.user.UserId,
        userName: data.user.userName || data.user.UserName,
        fullName: data.user.userFullName || data.user.UserFullName,
        userTypeId: data.user.userTypeId || data.user.UserTypeId,
        locationId: data.user.locationId || data.user.LocationId,
        locationName: data.user.locationName || data.user.LocationName,
        divisionId: data.user.divisionId || data.user.DivisionId,
        divisionName: data.user.divisionName || data.user.DivisionName,
        permissions: data.user.permissions || data.user.Permissions || [],
      };

      login(authObj);

      if (authObj.userTypeId === 1) {
        navigate("/company");
        return;
      }

      const allowedMenus = authObj.permissions.filter((p) => p.canView || p.CanView);

      // 🗺️ Robust Route Mapping (Using Keys is better than IDs)
      const routeMap = {
        "company": "/company",
        "division": "/division",
        "vendor": "/vendor",
        "category": "/category",
        "product": "/product",
        "user": "/user",
        "usertype": "/usertype",
        "workorder": "/workorder",
        "workordermanage": "/workordermanage",
        "reports": "/reports",
        "location": "/location",
        "user-menu-rights": "/user-menu-rights"
      };

      if (allowedMenus.length > 0) {
        // Find first allowed route
        let redirectRoute = null;
        for (const p of allowedMenus) {
          const key = (p.menuKey || p.MenuKey || p.menu?.menuKey)?.toLowerCase();
          if (key && routeMap[key]) {
            redirectRoute = routeMap[key];
            break;
          }
        }

        if (redirectRoute) {
          navigate(redirectRoute);
        } else {
          // Fallback to ID map if keys fail
          const idMap = {
            1: "/company", 2: "/division", 3: "/vendor", 4: "/category",
            5: "/product", 6: "/user", 7: "/usertype", 8: "/workorder",
            9: "/workordermanage", 10: "/reports", 11: "/location"
          };
          const firstId = allowedMenus[0].menuId || allowedMenus[0].MenuId;
          const fallbackRoute = idMap[firstId];

          if (fallbackRoute) {
            navigate(fallbackRoute);
          } else {
            toast.error("No route mapping found for your permissions.");
          }
        }
      } else {
        toast.error("No permission assigned to this user.");
      }

    } catch (err) {
      setMsg("Invalid username or password");
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoUrl} alt="Aira Logo" />
        </div>

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to your Work Order Management account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {msg && <div className="text-danger">{msg}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control text-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Aira Euro Automation Pvt Ltd.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
