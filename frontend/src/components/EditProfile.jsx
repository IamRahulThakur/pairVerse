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

      await api.patch("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  const Section = ({ title, icon: Icon, children }) => (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center gap-2 border-b border-base-content/5 pb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-base-content/60 hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-base-content/60 mt-1">Update your personal and professional details</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Personal Info */}
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Upload */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full border-4 border-base-content/10 overflow-hidden bg-base-200">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/20">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-base-content/50 mt-3">Click to change photo</p>
            </div>

            {/* Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/80">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/80">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="email"
                    value={emailId}
                    disabled
                    className="input-field pl-12 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/80">Username</label>
                  <input
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`input-field ${usernameError ? 'border-error focus:border-error' : ''}`}
                    required
                  />
                  {usernameError && <p className="text-xs text-error mt-1">{usernameError}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content/80">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isAgeLocked}
                    className="input-field disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Professional Info */}
        <Section title="Professional Details" icon={Briefcase}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
              <p className="text-xs text-base-content/50 text-right">{bio.length}/500</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Web Development"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Code className="w-4 h-4" /> Tech Stack
              </label>
              <div className="space-y-3">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleTechChange(e, index)}
                      className="input-field"
                      placeholder="e.g. React"
                    />
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="p-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTech}
                  className="w-full py-3 border-2 border-dashed border-base-content/20 rounded-xl text-base-content/60 hover:border-primary hover:text-primary transition-all font-medium"
                >
                  + Add Technology
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social & Location" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </label>
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="input-field"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="input-field"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input-field"
                placeholder="e.g. UTC-5"
              />
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
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