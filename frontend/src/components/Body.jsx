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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <NavBar />
      <main className="pt-20 pb-12 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;