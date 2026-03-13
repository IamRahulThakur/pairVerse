import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Compass,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { api } from "../utils/api";
import { removeUser } from "../utils/userSlice";
import UserSearchInput from "./UserSearchInput";
import { getInitials } from "../utils/formatters";

const navItems = [
  { path: "/feed", label: "Workspace", icon: LayoutGrid },
  { path: "/matchingpeers", label: "Matches", icon: Compass },
  { path: "/connection/requests", label: "Requests", icon: Users },
  { path: "/chat", label: "Messages", icon: MessageSquare },
  { path: "/notifications", label: "Alerts", icon: Bell },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hideMobileBottomNav = location.pathname.startsWith("/chat/");
  const headerRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--app-header-height", `${height}px`);
    };

    updateHeaderHeight();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateHeaderHeight())
        : null;

    if (observer && headerRef.current) {
      observer.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      observer?.disconnect();
    };
  }, [isMobileMenuOpen, user]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(removeUser());
      navigate("/login", { replace: true });
    }
  };

  const isActiveRoute = (path) => {
    if (path === "/chat") {
      return location.pathname.startsWith("/chat");
    }

    return location.pathname === path;
  };

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-5 sm:pt-3">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-[28px] border border-white/70 bg-[#fffaf2]/92 px-4 py-3 shadow-[0_18px_45px_rgba(36,28,16,0.08)] backdrop-blur-xl sm:px-5">
          <Link to={user ? "/feed" : "/login"} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#245b76] text-sm font-black uppercase tracking-[0.24em] text-white shadow-[0_10px_28px_rgba(36,91,118,0.22)]">
              PV
            </div>
            <div>
              <p className="display-font text-lg font-bold leading-none text-[#16353b]">
                PairVerse
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Match by skills
              </p>
            </div>
          </Link>

          {user ? (
            <>
              <div className="hidden min-w-0 flex-1 items-center gap-3 px-3 lg:flex xl:px-5">
                <nav className="flex min-w-0 items-center gap-1 xl:gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`rounded-full px-3 py-2 text-sm font-semibold transition xl:px-4 ${
                          active
                            ? "bg-[#245b76] text-white"
                            : "text-slate-600 hover:bg-[#f2ece1] hover:text-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
                <UserSearchInput
                  className="hidden xl:block xl:w-[240px] 2xl:w-[280px] flex-shrink-0"
                  compact
                  placeholder="Search collaborators"
                />
              </div>

              <div className="hidden items-center gap-2 lg:flex xl:gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-black/5 transition hover:bg-white"
                >
                  {user.photourl ? (
                    <img
                      src={user.photourl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d7ebe6] font-bold text-[#18474f]">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                  <div className="hidden text-left 2xl:block">
                    <p className="text-sm font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {user.domain || "Complete your collaborator profile"}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-[#eadfd0] px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#e9c6ab] hover:bg-[#fff3ea] hover:text-[#9d5421] xl:px-4"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden 2xl:inline">Logout</span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="rounded-2xl p-3 text-slate-700 transition hover:bg-[#f4ede2] lg:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ede2]"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#18474f] px-4 py-2 text-sm font-semibold text-[#fff6ea] shadow-[0_12px_28px_rgba(24,71,79,0.22)] transition hover:bg-[#143e44]"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      </header>

      {user && isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 z-40 mx-3 rounded-[28px] border border-white/70 bg-[#fffaf2]/95 p-4 shadow-[0_20px_45px_rgba(30,24,14,0.14)] backdrop-blur-xl lg:hidden"
          style={{ top: "calc(var(--app-header-height, 0px) + 0.35rem)" }}
        >
          <UserSearchInput
            className="mb-4"
            onResultClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#245b76] text-white"
                      : "bg-white/70 text-slate-700 hover:bg-[#f4ede2]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f4ede2]"
            >
              <UserRound className="h-4 w-4" />
              My profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl bg-[#fff0ea] px-4 py-3 text-sm font-semibold text-[#b34b2d]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {user && !hideMobileBottomNav && (
        <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between rounded-full border border-white/70 bg-[#fffaf2]/92 px-4 py-2 shadow-[0_18px_40px_rgba(29,23,13,0.14)] backdrop-blur-xl lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full p-3 transition ${
                  active ? "bg-[#245b76] text-white" : "text-slate-500 hover:bg-[#f4ede2]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
};

export default NavBar;
