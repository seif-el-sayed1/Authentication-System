import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"
import authenticationImg from '../assets/authentication.webp';
import background from "../assets/getStart.webp";
import axios from "axios";
import { AppContent } from "../context/appContext";

export const ResetPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("");

    const [isEmail, setIsEmail] = useState(false)
    const [isOtp, setIsOtp] = useState(false)

    const {backendUrl} = useContext(AppContent)

    axios.defaults.withCredentials = true
    
    const inputRefs = React.useRef([]) 
    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }    
    }
    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0)  {
            inputRefs.current[index - 1].focus()
        }
    }
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split("")
        pasteArray.forEach((ele, index) => {
            if(inputRefs.current[index]) {
                inputRefs.current[index].value = ele
            }
        })
    }

    const submitEmail = async (e) => {
        try {
            e.preventDefault()
            const {data} = await axios.post(backendUrl + "api/send-reset-otp", {email})
            if(data.Success) {
                toast.success(data.message, {position: "top-center"})
                setIsEmail(true)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const submitOtp = async (e) => {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e.value)
            setOtp(otpArray.join(""))
            setIsOtp(true)
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(backendUrl + "api/reset-password", { email, otp, newPassword})
            if(data.Success) {
                toast.success(data.message)
                navigate("/getStarted")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }



    return (
        <div className="get-start" style={{backgroundImage: `url(${background})`, height: "100vh" }}>
            <div className="container"> 
                <div style={{cursor:"pointer"}} onClick={() => navigate("/")} className='d-flex align-items-center'>
                    <img src={authenticationImg} alt="authentication" />
                    <p className='fs-4 fw-bold mt-3'>Authentication</p>
                </div>
                <div className="container d-flex justify-content-center mt-5">

                    <div className="otp p-3">
                        <div className="form-head text-center">
                            <h1 className='fw-bold fs-2'>Reset Password</h1>
                        </div>
                        {!isEmail && 
                            <form onSubmit={submitEmail}>
                                <p style={{color: "gray"}} className="text-center">Enter Your Email</p>
                                <div className="email-form">
                                    <input onChange={(e) => setEmail(e.target.value)} type="text" className="px-2 py-1 mb-3" placeholder="Your Email" required/>
                                    <button className="w-100 py-1">Submit</button>
                                </div>
                            </form>
                        }
                        {!isOtp && isEmail &&
                            <form onSubmit={submitOtp}>
                                <p style={{color: "gray"}} className="text-center">Get Your Otp from Your Email</p>
                                <div  onPaste={handlePaste} className="otp-input d-flex gap-2 justify-content-center align-items-center my-4">
                                    {Array(6).fill(0).map((_, index) => (
                                        <input type="text" maxLength="1" key={index} required
                                        ref={e => inputRefs.current[index] = e}
                                        onInput={(e) => handleInput(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-25 h-25 text-center fs-5"/>
                                    ))}
                                </div>
                                <button className="w-100 py-1">Send</button>
                            </form>
                        }
                        {isEmail && isOtp && 
                            <form onSubmit={resetPassword}> 
                                <p style={{color: "gray"}} className="text-center">Enter Your Email</p>
                                <div className="email-form">
                                    <input onChange={(e) => setNewPassword(e.target.value)} type="text" className="px-2 py-1 mb-3" placeholder="New Password" required/>
                                </div>
                                <button className="w-100 py-1">Set New Password</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
