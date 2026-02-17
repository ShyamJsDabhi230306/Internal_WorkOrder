// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../API/AuthContext";
// // import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosClient from "../API/axiosClient";

// const API = `/Auth/login`;
// const imgLogoUrl = new URL('../assets/images/aira.png', import.meta.url).href
// const ImgsidebarUrl = new URL('../assets/images/SUZIK .jpg', import.meta.url).href

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");
//   const [msgColor, setMsgColor] = useState("text-danger");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     try {
//       const { data } = await axiosClient.post(API, {
//         UserName: username,
//         Password: password,
//       });



//       // Save token
//       localStorage.setItem("token", data.token);

//       // Extract user details
//       const userObj = {
//         userId: data.user.userId,
//         userName: data.user.userName,
//         fullName: data.user.userFullName,
//         userTypeId: data.user.userTypeId,
//         divisionId: data.user.divisionId,
//         vendorId: data.user.vendorId,
//       };

//       login(userObj);
//       localStorage.setItem("user", JSON.stringify(userObj));

//       // Redirect based on role
//       if (userObj.userTypeId === 1) navigate("/company", { replace: true });
//       else if (userObj.userTypeId === 2) navigate("/workorder", { replace: true });
//       else if (userObj.userTypeId === 3) navigate("/workordermanage", { replace: true });
//       else navigate("/company");

//     } catch (err) {
//       setMsgColor("text-danger");
//       setMsg("Invalid username or password.");
//       toast.error("Invalid username or password");
//     }
//   };

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">

//         <div
//           className="col-md-3 d-none d-md-block p-0"
//           style={{
//             // backgroundImage: `url(${ImgsidebarUrl})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         />

//         <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white">
//           <div className="p-4 w-75">
//             <div className="text-center mb-4">
//               <img src={imgLogoUrl} alt="Logo" style={{ width: "110px" }} />
//             </div>

//             <h2 className="text-center mb-3">Welcome Back</h2>

//             <form onSubmit={handleSubmit} autoComplete="off">
//               <div className="mb-3">
//                 <label>Username</label>
//                 <input
//                   className="form-control"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   autoComplete="new-username"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="new-password"
//                   required
//                 />
//               </div>

//               {msg && <p className={`${msgColor}`}>{msg}</p>}

//               <button className="btn btn-primary w-100">Login</button>
//             </form>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../API/AuthContext";
import axiosClient from "../API/axiosClient";
import { toast } from "react-toastify";
const ImgsidebarUrl = new URL('/src/assets/images/04.png', import.meta.url).href
const API = "/Auth/login";
// ✅ YOUR IMAGE METHOD (WORKING)

export default function LoginPage() {
  const navigate = useNavigate();
  // const { login } = useAuth();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showError, setShowError] = useState(false);

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setMsg("");
  //  // ✅ SUCCESS TOAST
  //  try {
  //    const { data } = await axiosClient.post(API, {
  //      UserName: username,
  //      Password: password,
  //     });
  //     toast.success("Login successful!");

  //       // Save token
  //       localStorage.setItem("token", data.token);

  //       const userObj = {
  //         userId: data.user.userId, 
  //         userName: data.user.userName,
  //         fullName: data.user.userFullName,
  //         userTypeId: data.user.userTypeId,
  //         divisionId: data.user.divisionId,
  //         vendorId: data.user.vendorId,
  //       };

  //       login(userObj);
  //       localStorage.setItem("user", JSON.stringify(userObj));

  //       // Redirect
  //       if (userObj.userTypeId === 1) navigate("/company");
  //       else if (userObj.userTypeId === 2) navigate("/workorder");
  //       else if (userObj.userTypeId === 3)
  //         navigate("/workordermanage", { replace: true });

  //     } catch (err) {
  //     setMsg("Invalid username or password");
  //       // ✅ ERROR TOAST
  //     toast.error("Invalid username or password");
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const { data } = await axiosClient.post(API, {
        UserName: username,
        Password: password,
      });

      // ✅ SUCCESS TOAST ONLY AFTER API SUCCESS
      toast.success("Login successful!");

      localStorage.setItem("token", data.token);

      const userObj = {
        userId: data.user.userId,
        userName: data.user.userName,
        fullName: data.user.userFullName,
        userTypeId: data.user.userTypeId,
        divisionId: data.user.divisionId,
        vendorId: data.user.vendorId,
      };

      login(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      if (userObj.userTypeId === 1) navigate("/company");
      else if (userObj.userTypeId === 2) navigate("/workorder");
      else if (userObj.userTypeId === 3)
        navigate("/workordermanage", { replace: true });

    } catch (err) {
      setMsg("Invalid username or password");

      // ✅ ERROR TOAST
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="sign-in-bg">
      <div className="app-wrapper d-block">
        <div className="main-container">
          <div className="container">
            <div className="row sign-in-content-bg">

              {/* LEFT IMAGE */}
              {/* <div className="col-lg-6 image-contentbox d-none d-lg-block">
                <div className="form-container">
                  <div className="signup-bg-img">
                    <img
                      src="ImgsidebarUrl"
                      alt="login"
                      className="img-fluid"
                    />

                    
                  </div>
                </div>
              </div> */}

              {/* LEFT IMAGE */}
              <div className="col-lg-6 image-contentbox d-none d-lg-block">
                <div className="form-container">
                  <div className="signup-bg-img">
                    <img
                      src={ImgsidebarUrl}
                      alt="login"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>

              {/* LOGIN FORM */}
              <div className="col-lg-6 form-contentbox">
                <div className="form-container">
                  <form className="app-form" onSubmit={handleSubmit}>
                    <div className="row">

                      <div className="col-12 mb-5">
                        <h2 className="text-primary f-w-600">
                          <span className="text-warning">Welcome </span> <span className="small">Aira Euro Automation Pvt Ltd</span>
                        </h2>
                        <p>
                          Sign in with your data that you entered during your registration
                        </p>
                      </div>

                      <div className="col-12 mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          id="username"
                          className="form-control"
                          placeholder="Enter Your Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoComplete="off"
                          required

                        />
                      </div>

                      <div className="col-12 mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          className="form-control"
                          placeholder="Enter Your Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="off"
                          required
                        />
                      </div>

                      {msg && (
                        <div className="col-12 text-danger mb-2">
                          {msg}
                        </div>
                      )}

                      <div className="col-12 mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Sign In
                        </button>
                      </div>

                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
