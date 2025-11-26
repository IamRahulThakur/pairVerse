import Body from "./components/Body";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import EditProfile from "./components/EditProfile";
import ConnectionRequests from "./components/ConnectionRequests";
import Connection from "./components/Connection";
import CreatePost from "./components/CreatePost";
import ChangePassword from "./components/ChangePassword";
import Chat from "./components/Chat";
import NotFound from "./components/NotFound";
import FindFriends from "./components/MatchingPeers";
import SearchUsers from "./components/SearchUsers";
import UserProfile from "./components/UserProfile";
import MatchingPeers from "./components/MatchingPeers";
import Notifications from "./components/Notifications";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/connection/requests" element={<ConnectionRequests />} />
              <Route path="/connection" element={<Connection />} />
              <Route path="/user/createpost" element={<CreatePost />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/matchingpeers" element={<MatchingPeers />} />
              <Route path="/search" element={<SearchUsers />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/footer" element={<Footer />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
