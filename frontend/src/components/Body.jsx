// Body.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
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

    if (!userData) {
      fetchUser();
    }
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;