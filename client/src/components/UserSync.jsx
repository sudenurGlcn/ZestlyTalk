import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { selectUser as selectAuthUser } from "../store/authSlice";

const UserSync = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  useEffect(() => {
    if (authUser && authUser.id) {
      dispatch(setUser(authUser));
    }
  }, [authUser, dispatch]);

  return null;
};

export default UserSync;