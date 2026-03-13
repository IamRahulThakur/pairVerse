import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowRight, LockKeyhole, Mail, Sparkles, Users2 } from "lucide-react";
import toast from "react-hot-toast";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", { emailId, password });
      dispatch(addUser(response.data));
      toast.success("Welcome back to PairVerse");
      navigate(location.state?.from || "/feed", { replace: true });
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        setErrorMessage("Invalid email or password. Try again.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("We could not sign you in right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-9rem)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-panel mesh-card relative overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-xl">
          <span className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Real collaborators, not vanity metrics
          </span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Find your next build partner through shared skills and momentum.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
            PairVerse already gives you matching peers, connection requests, chat, and build
            updates. Sign in to keep shaping the stronger collaborator-first version.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white/78 p-5 shadow-sm ring-1 ring-black/5">
              <Users2 className="h-5 w-5 text-[#1f6f78]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Match signals
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Shared tech stack, experience, and profile depth already power discovery today.
              </p>
            </div>
            <div className="rounded-[28px] bg-[#18474f] p-5 text-[#fff6ea] shadow-[0_18px_40px_rgba(24,71,79,0.2)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6ece8]">
                Next up
              </p>
              <p className="mt-3 text-base font-semibold">
                Project listings, availability, and deeper matching can slide into this UI cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel-strong rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b4b19]">
            Sign in
          </p>
          <h2 className="display-font mt-3 text-3xl font-bold text-slate-900">
            Return to your collaborator workspace
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your profile, matches, requests, and conversations are waiting.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="field-shell flex items-center gap-3 px-4 py-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={emailId}
                  onChange={(event) => setEmailId(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <div className="field-shell flex items-center gap-3 px-4 py-3">
                <LockKeyhole className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </label>

            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#18474f] px-5 py-3.5 text-sm font-bold text-[#fff6ea] shadow-[0_18px_40px_rgba(24,71,79,0.18)] transition hover:bg-[#143d43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d6ece8] border-t-transparent" />
              ) : (
                <>
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            New here?{" "}
            <Link to="/signup" className="font-bold text-[#1f6f78] hover:text-[#16353b]">
              Build your collaborator profile
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
