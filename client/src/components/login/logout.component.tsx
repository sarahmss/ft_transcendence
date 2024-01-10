import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import AuthService from "../../services/auth.service";

const Logout = () => {
  useEffect(() => {
    logOut();
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return <Navigate to={'/'} />;
};

export default Logout;
