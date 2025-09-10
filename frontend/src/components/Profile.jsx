import  { useSelector } from "react-redux"
import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {

  const user = useSelector((store) => (store.user));
  const dispatch = useDispatch();

  const fetchUser = async () => {
      if(user) return;
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
      if(!user)
        fetchUser();
    }, []);
  
  return (
    <div className="flex" >
        <ProfileCard user={user} />
    </div>
  )
}

export default Profile
