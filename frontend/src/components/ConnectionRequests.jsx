import React, { useEffect } from 'react'
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest } from '../utils/requestSlice'
import RequestCard from './RequestCard';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Requests
          </h1>
          <p className="text-base-content/60 mt-1">Manage your connection requests</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-sm font-medium text-base-content/80">
          {requests?.length || 0} Pending
        </div>
      </div>

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
          <div className="glass-card p-12 text-center border-dashed border-2 border-base-content/10">
            <div className="w-16 h-16 bg-base-content/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-base-content/40" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No pending requests</h3>
            <p className="text-base-content/50">You're all caught up! Check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectionRequests;