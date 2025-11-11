// Connection.jsx
import React, { useEffect } from 'react'
import { api } from '../utils/api'
import { addConnection } from "../utils/connectionSlice"
import { useDispatch, useSelector } from 'react-redux';
import ConnectionCard from './ConnectionCard';

const Connection = () => {
  const dispatch = useDispatch();
  const connectionData = useSelector((store) => store.connection);

  const getConnections = async () => {
    try {
      const res = await api.get("/user/connections");
      dispatch(addConnection(res.data));
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getConnections()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Connections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectionData && connectionData.map((res) => (
          <ConnectionCard key={res._id} user={res} />
        ))}
        {!connectionData?.length && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No Connections</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Connection;