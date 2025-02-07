import authenticationImg from '../assets/authentication.webp';
import { useNavigate } from "react-router-dom";
import { useContext} from "react"
import { AppContent } from "../context/appContext"
import axios from 'axios';
import { toast } from 'react-toastify';

export const Navbar = () => {
    const navigate = useNavigate()
    const {userData, setUserData, setIsLoggedin ,backendUrl} = useContext(AppContent)

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + "api/logout")
            if(data.Success) {
                toast.success(data.message,{position: "top-center"})
                setUserData(false)
                setIsLoggedin(false)
                navigate("/")
            }
        } catch (error) {
            toast.error(error.message,{position: "top-center"})
        }
    }
    const sentVerifyOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + "api/send-verify-otp")
            if(data.Success) {
                navigate('/verifyEmail')
                toast.success(data.message, {position: "top-center"})
            } else {
                toast.error(data.message, {position: "top-center"})
            }
        } catch (error) {
            toast.error(error.message, {position: "top-center"})
        }
    }
    return (
        <div className="nav">
            <div className="container d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <img src={authenticationImg} alt="authentication" />
                    <p className='fs-4 fw-bold mt-3'>Authentication</p>
                </div>
                {userData ? 
                            <div>
                                <div className='user-letter p-1 text-center fw-bold'>{userData.name[0].toUpperCase()}</div>
                                <ul>
                                    {!userData.isVerified && <li onClick={() => sentVerifyOtp()}
                                                                className='py-1 px-3'>
                                                                Verify Email
                                                            </li>}
                                    <li onClick={logout} className='py-1 px-3'>Log Out</li>
                                </ul>
                            </div>
                        :    
                            <button onClick={() => navigate('/getStarted')} className='text-decoration-none me-4 px-2 py-1 rounded-4'>
                                Sign Up
                            </button>
                }
            </div>
        </div>
    )
}
