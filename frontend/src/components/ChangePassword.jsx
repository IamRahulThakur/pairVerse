import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!password || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation must match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.patch("/profile/updatePassword", {
        password,
        newPassword,
        confirmPassword,
      });

      toast.success(response.data.message || "Password updated");
      navigate("/profile");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8dccb] bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </button>

      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-2xl">
          <span className="section-kicker">Account safety</span>
          <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
            Keep your collaborator identity secure.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Since PairVerse is evolving into a more serious collaboration product, account trust and
            session safety matter even more.
          </p>
        </div>
      </section>

      <form onSubmit={handleChangePassword} className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#eef6f4] p-3 text-[#1f6f78]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="display-font text-2xl font-bold text-slate-900">Change password</h2>
            <p className="mt-1 text-sm text-slate-600">
              Use a strong password that you do not reuse elsewhere.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <Field label="Current password">
            <InputWithIcon
              value={password}
              onChange={setPassword}
              placeholder="Enter current password"
            />
          </Field>

          <Field label="New password">
            <InputWithIcon
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Create a stronger password"
            />
          </Field>

          <Field label="Confirm new password">
            <InputWithIcon
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter new password"
            />
          </Field>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Link
            to="/profile"
            className="rounded-full border border-[#e8dccb] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    {children}
  </label>
);

const InputWithIcon = ({ value, onChange, placeholder }) => (
  <div className="field-shell flex items-center gap-3 px-4 py-3">
    <LockKeyhole className="h-4 w-4 text-slate-400" />
    <input
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none placeholder:text-slate-400"
    />
  </div>
);

export default ChangePassword;
