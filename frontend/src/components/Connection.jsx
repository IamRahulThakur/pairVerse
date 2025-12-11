import React, { useEffect } from 'react'
import { api } from '../utils/api'
import { addConnection } from "../utils/connectionSlice"
import { useDispatch, useSelector } from 'react-redux';
import ConnectionCard from './ConnectionCard';
import { Network, Users } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-600" />
            My Network
          </h1>
          <p className="text-slate-500 mt-1">People you are connected with</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 shadow-sm">
          {connectionData?.length || 0} Connections
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectionData && connectionData.length > 0 ? (
          connectionData.map((res) => (
            <ConnectionCard key={res._id} user={res} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No connections yet</h3>
            <p className="text-slate-500">Start connecting with peers to build your network.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Connection;