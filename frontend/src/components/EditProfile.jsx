import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import ProfileCard from "./ProfileCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

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
  const [photourl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [domain, setDomain] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timezone, setTimezone] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [emailId, setEmailId] = useState("");
  const [isAgeLocked , setIsAgeLocked] = useState(false);


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
        Navigate("/login");
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
      setPhotoUrl(profile.photourl || "");
      setBio(profile.bio || "");
      setDomain(profile.domain || "");
      setTechStack(profile.techStack || []);
      setExperienceLevel(profile.experienceLevel || "");
      setTimezone(profile.timezone || "");
      setLinkedIn(profile.linkedIn || "");
      setGithub(profile.Github || "");
    }
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/profile/edit", {
        firstName,
        lastName,
        username,
        gender,
        photourl,
        bio,
        age,
        domain,
        techStack,
        experienceLevel,
        timezone,
        linkedIn,
        Github: github,
      });
      toast.success("Profile updated successfully!");
      return navigate("/profile");
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
      }
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card card-bordered bg-base-100 w-full max-w-lg shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Edit Profile</h2>
          <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
            {/* Email */}
            <label className="font-medium">Email</label>
            <input
              type="email"
              value={emailId}
              disabled
              className="input input-bordered w-full"
            />

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Username */}
            <label className="font-medium">Username</label>
            {usernameError && (
              <p className="text-red-500 text-sm">{usernameError}</p>
            )}
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="input input-bordered w-full"
            />

            <label className="font-medium">Photo URL</label>
            <input
              type="url"
              value={photourl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-bordered w-full"
            />
            {/* Age */}
            <label className="font-medium">Age</label>
            <input
              type="number"
              value={age}
              disabled={isAgeLocked}
              onChange={(e) => setAge(e.target.value)}
              className="input input-bordered w-full"
            />

            {/* Gender */}
            <label className="font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>

            {/* Bio */}
            <label className="font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="textarea textarea-bordered w-full"
            />

            {/* Domain */}
            <label className="font-medium">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="input input-bordered w-full"
            />

            {/* Tech Stack */}
            <div>
              <label className="font-medium">Tech Stack</label>
              {techStack.map((tech, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleTechChange(e, index)}
                    className="input input-bordered flex-1"
                  />
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removeTech(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline mt-2"
                onClick={addTech}
              >
                + Add Tech
              </button>
            </div>

            {/* Experience Level */}
            <label className="font-medium">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Experience Level</option>
              <option value="beginner">beginner</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </select>

            {/* Timezone */}
            <label className="font-medium">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input input-bordered w-full"
            />

            {/* LinkedIn */}
            <label className="font-medium">LinkedIn</label>
            <input
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="input input-bordered w-full"
            />

            {/* GitHub */}
            <label className="font-medium">GitHub</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="input input-bordered w-full"
            />

            <button type="submit" className="btn btn-primary w-full mt-4">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
