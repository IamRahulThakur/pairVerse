import React, { useEffect } from 'react'
import { api } from '../utils/api'
import {addConnection} from "../utils/connectionSlice"
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
    <div>
      < div className="flex flex-col items-center mt-2">
        {connectionData && connectionData.map((res) => (
          <ConnectionCard 
          key={res._id} 
          user={res} 
          />
        ))}
        {!connectionData && <div>
          No Connections
        </div> }
      </div>
    </div>
  )
}

export default Connection
