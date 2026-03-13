import { useNavigate } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="glass-panel-strong max-w-xl rounded-[38px] px-8 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4f1] text-[#1f6f78]">
          <Compass className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.26em] text-[#8b4b19]">
          Lost in PairVerse
        </p>
        <h1 className="display-font mt-4 text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          This route does not exist. Head back to your collaborator workspace and keep building.
        </p>
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="mt-8 rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43]"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to workspace
          </span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
