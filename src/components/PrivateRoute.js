// components/PrivateRoute.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUser = async() =>{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/login/profile`,{
        withCredentials:true
      })
      setUser(res.data)
    }
    fetchUser();
  },[])
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
