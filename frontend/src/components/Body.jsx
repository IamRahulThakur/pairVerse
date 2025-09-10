import React, { useEffect } from 'react'
import { Outlet , useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { api } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import {addUser} from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      dispatch(addUser(res.data));
    } catch (error) {
      if(error.status === 401) {
        Navigate("/login");
      }
      else {
        console.error("Error fetching user data:", error);
      }
    }

  }

  useEffect(() => {
    if(!userData)
      fetchUser();
  }, []);

  return (
    <div>
      <NavBar/>
      <Outlet/>
    </div>
  )
}

export default Body
