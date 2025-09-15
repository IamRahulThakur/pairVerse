import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Standard practice to name it lowercase
  const userData = useSelector((store) => store.user);
 

  useEffect(() => {
    // This function is only responsible for fetching and dispatching
    const fetchUser = async () => {
      try {
        const res = await api.get("/profile");
        dispatch(addUser(res.data));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // We only call the function if we don't already have the user data.
    if (!userData) {
      fetchUser();
    }
    
    // The empty dependency array ensures this effect runs only once on mount.
  }, []); // Dependencies: none in this case, but good to be mindful

  return (
    <div>
      <NavBar />
      <Outlet />
      {/* You won't have a Footer here if Outlet renders it */}
    </div>
  );
};

export default Body;