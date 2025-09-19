import React, { useEffect, useState } from "react";
import { api } from "../utils/api";

const FindFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/findfriends");
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async(id) => {
    try {
      await api.post(`/request/send/interested/${id}`);
      setFriends((prev) => prev.filter((user) => user._id !== id));
    }
    catch(error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">People you may know</h1>

      {friends.length === 0 ? (
        <p className="text-gray-600">No suggestions found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((user) => (
            <div
              key={user._id}
              className="card bg-base-100 shadow-md border border-base-200"
            >
              <div className="card-body">
                <h2 className="card-title text-lg">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.matchCount} common skills
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {user.commonTechs?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="badge badge-outline badge-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-primary" onClick={() => handleRequest(user._id)}>Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindFriends;
