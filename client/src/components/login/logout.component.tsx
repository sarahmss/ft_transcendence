import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import AuthService from "../../services/auth.service";

const Logout = () => {
  console.log("Entrou antes Useeffect 1")
  useEffect(() => {
    const logOut = async () => {
      try {
        console.log("entrou no try logOut 2")
        await AuthService.logout();

      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logOut();
  }, []);

  return <Navigate to="/" />;
};

export default Logout;
