import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const[user, setUser] = useState(null)
    const [role, setRole] = useState(null)

    useEffect(() => {
  console.log("Role changed:", role);
}, [role]);

    useEffect(()=>{
        const getUser = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/login/checkProfile`,{
                withCredentials:true
            })
            // debugger
            setRole(res.data.role)
            console.log(res.data)
            setUser(res.data)
        }
        getUser();
    },[])   

    return (
        <AuthContext.Provider value={{user, role}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)