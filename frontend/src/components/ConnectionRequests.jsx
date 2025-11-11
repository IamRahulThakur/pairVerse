// ConnectionRequests.jsx
import React from 'react'
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest } from '../utils/requestSlice'
import { useEffect } from 'react';
import RequestCard from './RequestCard';
import { useNavigate } from 'react-router-dom';

const ConnectionRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/requests/received");
      dispatch(addRequest(res.data));
    } catch (err) {
      console.log(err);
    }
  }

  const handleAccept = async (id) => {
    try {
      await api.post(`/request/review/accepted/${id}`)
      fetchRequests();
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/request/review/rejected/${id}`)
      fetchRequests();
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchRequests()
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Connection Requests</h1>
      <div className="space-y-4">
        {requests && requests.length > 0 ? (
          requests.map((req) => (
            <RequestCard
              key={req._id}
              user={req}
              onAccept={() => handleAccept(req._id)}
              onReject={() => handleReject(req._id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No New Connection Requests Found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectionRequests;