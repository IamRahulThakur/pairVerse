import React from 'react'
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest} from '../utils/requestSlice'
import { useEffect } from 'react';
import RequestCard from './RequestCard';

const ConnectionRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/requests/received");
      dispatch(addRequest(res.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleAccept = async (id) => {
    try {
      await api.post(`/request/review/accepted/${id}`)
      fetchRequests();
    }
    catch(error) {
      console.log(error.message);
    }
  }
  

  const handleReject = async (id) => {
    try {
      await api.post(`/request/review/rejected/${id}`)
      fetchRequests();
    }
    catch(error) {
      console.log(error.message);
    }
  }



  useEffect(() => {
    fetchRequests()
  }, []);

  return (
   <div>
      <div className="flex flex-col items-center mt-6">
        {/* Correctly check for empty array */}
        {requests && requests.length > 0 ? (
          requests.map((req) => (
            <RequestCard 
              key={req._id} 
              // Passing the entire request object is fine, can be named more explicitly
              user={req} 
              onAccept={() => handleAccept(req._id)} 
              onReject={() => handleReject(req._id)} 
            />
          ))
        ) : (
          <div>No New Connection Requests Found</div>
        )}
      </div>
    </div>
  )
}

export default ConnectionRequests
