import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowRight, Check, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { addUser } from "../utils/userSlice";
import { api } from "../utils/api";

const Signup = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/signup", { emailId, password });
      dispatch(addUser(response.data));
      toast.success("Account created. Let’s finish your profile.");
      navigate("/profile/edit", { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Could not create your account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-9rem)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="glass-panel-strong rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b4b19]">
            Create account
          </p>
          <h1 className="display-font mt-3 text-3xl font-bold text-slate-900">
            Start with a profile built for collaboration
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            You only need your email and password now. After that, we’ll help you shape a
            profile that makes matching useful.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSignup}>
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
                  placeholder="Create a strong password"
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm password
              </span>
              <div className="field-shell flex items-center gap-3 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
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
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#1f6f78] hover:text-[#16353b]">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-xl">
          <span className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Built for the pivot ahead
          </span>
          <h2 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            PairVerse is evolving from networking into a serious place to find your next
            collaborator.
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Shape a profile around skills, experience, and intent.",
              "Get matched with peers who overlap on real stack and goals.",
              "Move from connection request to chat without leaving the workspace.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[26px] bg-white/80 px-5 py-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="mt-1 rounded-full bg-[#18474f] p-1 text-[#fff6ea]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
