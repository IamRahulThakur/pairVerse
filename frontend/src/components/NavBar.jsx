import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      Navigate("/login");
      dispatch(removeUser())
    }
    catch (error) {
      console.error("Error during logout:", error);
    } 
  }

  return (
    <>
      <div className="navbar bg-base-200 shadow-sm">
        <div className="flex-1">
          <Link to="feed" className="btn btn-ghost text-xl">PairVerse</Link>
        </div>
        {user && 
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div> Welcome {user.firstName} </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost bt n-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User photo"
                  src={user?.photourl || "https://placeimg.com/80/80/people"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between" >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleLogout} >Logout</button>
              </li>
            </ul>
          </div>
        </div>}
      </div>
    </>
  );
};
export default NavBar;
