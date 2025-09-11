import React from "react";
import { api } from "../utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
   
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handlePost = async (e) => {
         e.preventDefault();
        try {
        await api.post("/user/posts/create", {
            title,
            content,
        });
        toast.success("Post Created Successfully");
        return navigate("/profile");
        } catch (error) {
        console.log(error.message);
        }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="card card-bordered bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create Post</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="input input-bordered w-full"
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                onClick={handlePost}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
