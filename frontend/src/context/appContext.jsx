import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);


    const authState = async () => {
        try {
            const {data} = await axios.get(backendUrl + "api/is-auth")
            if(data.Success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message,{position: "top-center"})
        }
    }
    
    const getUserData = async () => {
        const {data} = await axios.get(backendUrl + "api/user")
        if(data.Success) {
            setUserData(data.userData)
        } else {
            toast.error(data.message) 
        }
    }
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    };

    useEffect(() => {
        authState()
    },[])

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
