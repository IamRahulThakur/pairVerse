import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

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
      } else {
        console.error("Error fetching user data:", error);
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

      if (photoFile) {
        formData.append("photo", photoFile);
      }

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
          usernameRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          usernameRef.current?.focus();
        }
        return;
      } else {
        console.log(error.response ? error.response.data : error.message);
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
  const removeTech = (index) =>
    setTechStack(techStack.filter((_, i) => i !== index));

  const Section = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-5 bg-blue-600 mr-3 rounded-full"></div>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your personal and professional information</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Personal Information Section */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Profile Photo
                </label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Click the camera icon to upload a new photo
                  </p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailId}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    {usernameError && (
                      <p className="text-red-600 text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {usernameError}
                      </p>
                    )}
                    <input
                      ref={usernameRef}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="Choose a username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age {isAgeLocked && <span className="text-green-600 text-xs">(Locked)</span>}
                    </label>
                    <input
                      type="number"
                      value={age}
                      disabled={isAgeLocked}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </Section>

          {/* Professional Information Section */}
          <Section title="Professional Information">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
                  placeholder="Tell us about yourself, your interests, and your goals..."
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {bio.length}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                    placeholder="e.g., Web Development, Data Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack
                </label>
                <div className="space-y-3">
                  {techStack.map((tech, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechChange(e, index)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                        placeholder="e.g., JavaScript, Python, React"
                      />
                      <button
                        type="button"
                        className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        onClick={() => removeTech(index)}
                        title="Remove technology"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors duration-200"
                    onClick={addTech}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Technology
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  placeholder="e.g., UTC-5, EST, PST"
                />
              </div>
            </div>
          </Section>

          {/* Social Links Section */}
          <Section title="Social Links">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </Section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;