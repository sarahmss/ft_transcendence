import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import AuthService from "../../services/auth.service";
import {useSelector, useDispatch} from "react-redux";
import {addUser, userLog} from "../../services/reduce";

const Logout = () => {
  const users = useSelector(userLog);
	const dispatch = useDispatch();

  useEffect(() => {
    const logOut = async () => {
      try {
        await AuthService.logout();
        dispatch(addUser("logOut"));
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logOut();
  }, []);

  return <Navigate to="/" />;
};

export default Logout;
