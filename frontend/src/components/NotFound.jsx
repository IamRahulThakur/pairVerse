import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg w-full relative overflow-hidden shadow-2xl shadow-indigo-100 border border-slate-100">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce border border-rose-100">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>

          <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <button
            onClick={() => navigate("/feed")}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
          >
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;