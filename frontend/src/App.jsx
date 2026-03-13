import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ConnectionRequests from "./components/ConnectionRequests";
import Connection from "./components/Connection";
import CreatePost from "./components/CreatePost";
import ChangePassword from "./components/ChangePassword";
import Chat from "./components/Chat";
import NotFound from "./components/NotFound";
import MatchingPeers from "./components/MatchingPeers";
import SearchUsers from "./components/SearchUsers";
import UserProfile from "./components/UserProfile";
import Notifications from "./components/Notifications";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: "18px",
            background: "#18474f",
            color: "#fff8f0",
            boxShadow: "0 18px 40px rgba(24, 71, 79, 0.18)",
          },
          success: {
            style: {
              background: "#1f6f78",
            },
          },
          error: {
            style: {
              background: "#b33939",
            },
          },
        }}
      />
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Navigate to="/feed" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/connection/requests" element={<ConnectionRequests />} />
              <Route path="/connection" element={<Connection />} />
              <Route path="/user/createpost" element={<CreatePost />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/matchingpeers" element={<MatchingPeers />} />
              <Route path="/search" element={<SearchUsers />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
