import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  User,
  Mail,
  Briefcase,
  Code,
  Globe,
  Linkedin,
  Github,
  Save,
  X,
  ChevronLeft,
  Clock
} from "lucide-react";

// Moved Section component outside to prevent re-renders losing focus
// eslint-disable-next-line no-unused-vars
const Section = ({ title, Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      {title}
    </h3>
    {children}
  </div>
);

const EditProfile = () => {
  const profile = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data.age) {
        setAge(res.data.age);
        setIsAgeLocked(true);
      }
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!profile) fetchUser();
  }, []);

  useEffect(() => {
    if (profile) {
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
    }
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      techStack.forEach((tech) => formData.append("techStack", tech));
      if (photoFile) formData.append("photo", photoFile);

      await api.patch("/profile/edit", formData);

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const { field, message } = error.response.data;
        if (field === "username") {
          setUsernameError(message);
          usernameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          usernameRef.current?.focus();
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechChange = (e, index) => {
    const newStack = [...techStack];
    newStack[index] = e.target.value;
    setTechStack(newStack);
  };

  const addTech = () => setTechStack([...techStack, ""]);
  const removeTech = (index) => setTechStack(techStack.filter((_, i) => i !== index));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-2 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-slate-500 mt-1">Update your personal and professional details</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Personal Info */}
        <Section title="Personal Information" Icon={User}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Upload */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer backdrop-blur-[2px]">
                  <Camera className="w-8 h-8 drop-shadow-md" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium">Click to change photo</p>
            </div>

            {/* Fields */}
            <div className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={emailId}
                    disabled
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Username</label>
                  <input
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all ${usernameError ? 'border-rose-300 ring-rose-100 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
                    required
                  />
                  {usernameError && <p className="text-xs text-rose-500 mt-1 font-medium">{usernameError}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isAgeLocked}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Professional Info */}
        <Section title="Professional Details" Icon={Briefcase}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none leading-relaxed"
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
              <p className="text-xs text-slate-400 text-right">{bio.length}/500</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  placeholder="e.g. Web Development"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Experience Level</label>
                <div className="relative">
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none"
                  >
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronLeft className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Code className="w-4 h-4" /> Tech Stack
              </label>
              <div className="space-y-3">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleTechChange(e, index)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. React"
                    />
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTech}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Add Technology
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social & Location" Icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-slate-400" /> LinkedIn
              </label>
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-400" /> GitHub
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                placeholder="e.g. UTC-5"
              />
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;