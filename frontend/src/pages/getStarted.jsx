import { useContext, useState } from "react"
import { AppContent } from "../context/appContext";
import axios from 'axios';
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom"
import authenticationImg from '../assets/authentication.webp';
import background from "../assets/getStart.webp"

export const GetStarted = () => {
    const navigate = useNavigate()

    const [state, setState] = useState('signUp')
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContent)

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            axios.defaults.withCredentials = true
            if (state === "signUp") {
                const {data} = await axios.post(backendUrl + "api/register", 
                    {name, email, password} 
                )
                if(data.Success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                    toast.success(data.message, {position: "top-center"})
                } else {
                    toast.error(data.message, {position: "top-center"})
                }
            } else {
                const {data} = await axios.post(backendUrl + "api/login", 
                    {email, password}
                )
                if(data.Success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                    toast.success(data.message, {position: "top-center"})
                } else {
                    toast.error(data.message, {position: "top-center"})
                }
            }
        } catch (error) {
            toast.success(error.message, {position: "top-center"})
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
                    <div className="form p-3" >
                        <div className="form-head text-center">
                            <h2 className="fw-bold">{state === 'signUp' ? "Create Account" : "Login"}</h2>
                            <p style={{color: "gray"}}>{state === 'signUp' ? "Create Your Account" : "Login to your account"}</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {state === "signUp" && 
                            <input onChange={(e) => setName(e.target.value)} className="px-2 py-1 mb-2" type="text" placeholder="Full Name" required />}
                            <input onChange={(e) => setEmail(e.target.value)} className="px-2 py-1 mb-2" type="email" placeholder="Email" required />
                            <input onChange={(e) => setPassword(e.target.value)} className="px-2 py-1 mb-2" type="text" placeholder="Password" required />
                            <p  onClick={() => navigate("/resetPassword")} style={{textDecoration: "underline", cursor: "pointer"}}>Forget Your Password ? </p>
                            <button className="w-100 py-1">{state === "signUp" ? "Sign Up" : "Login"}</button>
                        </form>
                        <div className="text-center form-footer">
                            {state === "signUp" ? (<p className="">Already Have an Account ? <span onClick={() => setState("login")}>Login</span></p>)
                            : (<p>Create New Account <span onClick={() => setState("signUp")}>Sign Up</span></p>)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
