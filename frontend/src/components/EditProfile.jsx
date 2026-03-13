import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Github, Linkedin, Plus, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { addUser } from "../utils/userSlice";
import { getInitials } from "../utils/formatters";

const EditProfile = () => {
  const profile = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [bio, setBio] = useState("");
  const [domain, setDomain] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timezone, setTimezone] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [emailId, setEmailId] = useState("");
  const [isAgeLocked, setIsAgeLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/profile");
        dispatch(addUser(response.data));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    if (!profile) {
      fetchUser();
    }
  }, [dispatch, navigate, profile]);

  useEffect(() => {
    if (!profile) return;

    setEmailId(profile.emailId || "");
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setUsername(profile.username || "");
    setAge(profile.age || "");
    setGender(profile.gender || "");
    setPreviewUrl(profile.photourl || "");
    setBio(profile.bio || "");
    setDomain(profile.domain || "");
    setTechStack(profile.techStack || []);
    setExperienceLevel(profile.experienceLevel || "");
    setTimezone(profile.timezone || "");
    setLinkedIn(profile.linkedIn || "");
    setGithub(profile.Github || "");
    setIsAgeLocked(Boolean(profile.age));
  }, [profile]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be under 5MB");
      return;
    }

    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const updateTechValue = (index, value) => {
    setTechStack((current) => current.map((tech, techIndex) => (techIndex === index ? value : tech)));
  };

  const addTech = () => {
    setTechStack((current) => [...current, ""]);
  };

  const removeTech = (index) => {
    setTechStack((current) => current.filter((_, techIndex) => techIndex !== index));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("gender", gender);
      formData.append("bio", bio);
      formData.append("age", age);
      formData.append("domain", domain);
      formData.append("experienceLevel", experienceLevel);
      formData.append("timezone", timezone);
      formData.append("linkedIn", linkedIn);
      formData.append("Github", github);

      techStack
        .map((tech) => tech.trim())
        .filter(Boolean)
        .forEach((tech) => formData.append("techStack", tech));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await api.patch("/profile/edit", formData);
      const refreshed = await api.get("/profile");
      dispatch(addUser(refreshed.data));
      toast.success("Profile updated");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="glass-panel mesh-card rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" />
              Build your collaborator profile
            </span>
            <h1 className="display-font mt-6 text-4xl font-bold leading-tight text-[#16353b] sm:text-5xl">
              Shape the signals your future product direction will depend on.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The backend already uses parts of this data for matching. Making this screen strong
              now gives you a better current experience and a cleaner runway for the pivot.
            </p>
          </div>
          <Link
            to="/profile"
            className="rounded-full border border-[#e8dccb] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            Back to profile
          </Link>
        </div>
      </section>

      <form className="space-y-6" onSubmit={handleUpdate}>
        <section className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <div className="rounded-[30px] bg-[#f8f3ea] p-5 text-center">
                <label className="group block cursor-pointer">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="mx-auto h-40 w-40 rounded-[28px] object-cover shadow-[0_18px_45px_rgba(24,71,79,0.14)]"
                    />
                  ) : (
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-[28px] bg-[#d7ebe6] text-4xl font-bold text-[#18474f] shadow-[0_18px_45px_rgba(24,71,79,0.14)]">
                      {getInitials(firstName, lastName)}
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <span className="mt-4 block text-sm font-semibold text-[#1f6f78]">
                    Upload profile photo
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Recommended for stronger trust during matching
                  </span>
                </label>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="First name">
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="field-shell w-full px-4 py-3"
                  required
                />
              </Field>
              <Field label="Last name">
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="field-shell w-full px-4 py-3"
                  required
                />
              </Field>
              <Field label="Username">
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="field-shell w-full px-4 py-3"
                  required
                />
              </Field>
              <Field label="Email">
                <input value={emailId} disabled className="field-shell w-full px-4 py-3 opacity-70" />
              </Field>
              <Field label="Age">
                <input
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  disabled={isAgeLocked}
                  className="field-shell w-full px-4 py-3 disabled:opacity-70"
                />
              </Field>
              <Field label="Gender">
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="field-shell w-full px-4 py-3"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>
          </div>
        </section>

        <section className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Domain">
              <input
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="Frontend, AI tools, full-stack, mobile..."
                className="field-shell w-full px-4 py-3"
              />
            </Field>
            <Field label="Experience level">
              <select
                value={experienceLevel}
                onChange={(event) => setExperienceLevel(event.target.value)}
                className="field-shell w-full px-4 py-3"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Timezone">
              <input
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                placeholder="Asia/Kolkata"
                className="field-shell w-full px-4 py-3"
              />
            </Field>
            <Field label="Bio" className="md:col-span-2">
              <textarea
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="What are you building, what are you good at, and what kind of collaborators do you work well with?"
                className="field-shell w-full px-4 py-3"
              />
            </Field>
          </div>
        </section>

        <section className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="display-font text-2xl font-bold text-slate-900">Tech stack</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                These tags directly influence the current matching experience.
              </p>
            </div>
            <button
              type="button"
              onClick={addTech}
              className="rounded-full border border-[#e8dccb] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add tech
              </span>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {techStack.length > 0 ? (
              techStack.map((tech, index) => (
                <div key={`${index}-${tech}`} className="flex gap-3">
                  <input
                    value={tech}
                    onChange={(event) => updateTechValue(index, event.target.value)}
                    placeholder="React, Node.js, MongoDB..."
                    className="field-shell w-full px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => removeTech(index)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#e1d5c5] bg-[#faf6ee] px-4 py-5 text-sm text-slate-500">
                Add at least a few technologies so your matches become more meaningful.
              </div>
            )}
          </div>
        </section>

        <section className="glass-panel-strong rounded-[32px] px-5 py-6 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="LinkedIn">
              <div className="field-shell flex items-center gap-3 px-4 py-3">
                <Linkedin className="h-4 w-4 text-slate-400" />
                <input
                  value={linkedIn}
                  onChange={(event) => setLinkedIn(event.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="GitHub">
              <div className="field-shell flex items-center gap-3 px-4 py-3">
                <Github className="h-4 w-4 text-slate-400" />
                <input
                  value={github}
                  onChange={(event) => setGithub(event.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to="/profile"
            className="rounded-full border border-[#e8dccb] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f5efe4]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-[#18474f] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#143d43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    {children}
  </label>
);

export default EditProfile;
