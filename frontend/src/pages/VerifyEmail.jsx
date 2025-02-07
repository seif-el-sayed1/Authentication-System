import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"
import authenticationImg from '../assets/authentication.webp';
import background from "../assets/getStart.webp";
import axios from "axios";
import { AppContent } from "../context/appContext";

export const VerifyEmail = () => {
    const navigate = useNavigate()
    
    const {backendUrl, isLoggedin, getUserData, userData} = useContext(AppContent)

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
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e.value)
            const otp = otpArray.join("")
            const {data} = await axios.post(backendUrl + "api/verify-email", {otp})
            if(data.Success) {
                toast.success(data.message,{position: "top-center"})
                getUserData()
                navigate("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message, {position: "top-center"})
        }
    }
    useEffect(() => {
        userData && userData.isVerified && navigate("/");
    },[isLoggedin, userData])
    return (
        <div className="verify-email" style={{backgroundImage: `url(${background})`, height: "100vh" }}>
            <div className="container">
                <div style={{cursor:"pointer"}} onClick={() => navigate("/")} className='d-flex align-items-center'>
                    <img src={authenticationImg} alt="authentication" />
                    <p className='fs-4 fw-bold mt-3'>Authentication</p>
                </div>
                <div className="otp p-3">
                    <div className="form-head text-center">
                        <h1 className='fw-bold fs-2'>Email Verify</h1>
                        <p style={{color: "gray"}}>Get Your Otp from Your Email</p>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                </div>
            </div>
        </div>
    )
}
