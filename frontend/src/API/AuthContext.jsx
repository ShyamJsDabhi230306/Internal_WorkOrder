// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   // const [auth, setAuth] = useState(() => {
//   //   const storedUser = localStorage.getItem("user");
//   //   return storedUser ? JSON.parse(storedUser) : null;
//   // });


//   const [auth, setAuth] = useState(() => {
//   const storedAuth = localStorage.getItem("auth");
//   return storedAuth ? JSON.parse(storedAuth) : null;
// });


// const login = (user, permissions = []) => {
//   const authData = {
//     ...user,
//     permissions
//   };

//   localStorage.setItem("auth", JSON.stringify(authData));
//   setAuth(authData);
// };


// const logout = () => {
//   localStorage.removeItem("auth");
//   setAuth(null);
//   navigate("/newlogin", { replace: true });
// };
//   // const login = (user) => {
//   //   localStorage.setItem("user", JSON.stringify(user));
//   //   setAuth(user);
//   // };

//   // const logout = () => {
//   //   localStorage.removeItem("user");
//   //   setAuth(null);
//   //   navigate("/newlogin", { replace: true });
//   // };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (authData) => {
    localStorage.setItem("auth", JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    navigate("/newlogin", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
