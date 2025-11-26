import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-card p-12 text-center max-w-lg w-full relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-error/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <AlertTriangle className="w-12 h-12 text-error" />
          </div>

          <h1 className="text-6xl font-bold text-base-content mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-base-content/80 mb-4">Page Not Found</h2>
          <p className="text-base-content/60 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <button
            onClick={() => navigate("/feed")}
            className="btn-primary w-full flex items-center justify-center gap-2 group"
          >
            <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;