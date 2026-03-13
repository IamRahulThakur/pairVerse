import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";

const PUBLIC_ROUTES = new Set(["/login", "/signup"]);

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const [isBootstrapping, setIsBootstrapping] = useState(
    !PUBLIC_ROUTES.has(location.pathname) && !userData
  );

  const isPublicRoute = PUBLIC_ROUTES.has(location.pathname);

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      if (userData || isPublicRoute) {
        setIsBootstrapping(false);
        return;
      }

      setIsBootstrapping(true);
      try {
        const res = await api.get("/profile");
        if (!ignore) {
          dispatch(addUser(res.data));
        }
      } catch (error) {
        if (!ignore && error.response?.status === 401) {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    };

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [dispatch, isPublicRoute, location.pathname, navigate, userData]);

  useEffect(() => {
    if (userData && isPublicRoute) {
      navigate("/feed", { replace: true });
    }
  }, [isPublicRoute, navigate, userData]);

  return (
    <div className="app-shell">
      <NavBar />
      <main
        className="mx-auto w-full max-w-[1400px] px-4 pb-28 sm:px-6 lg:px-8"
        style={{ paddingTop: "calc(var(--app-header-height, 0px) + 0.75rem)" }}
      >
        {isBootstrapping && !userData && !isPublicRoute ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="glass-panel-strong flex items-center gap-4 rounded-[28px] px-6 py-5 text-sm font-semibold text-slate-600">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8dad6] border-t-[#1f6f78]" />
              Loading your collaborator workspace...
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Body;
