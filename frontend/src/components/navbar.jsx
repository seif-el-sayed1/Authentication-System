import authenticationImg from '../assets/authentication.webp';
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate()
    return (
        <div className="nav">
            <div className="container d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <img src={authenticationImg} alt="authentication" />
                    <p className='fs-4 fw-bold mt-3'>Authentication</p>
                </div>
                <button onClick={() => navigate('/getStarted')} className='text-decoration-none me-4 px-2 py-1 rounded-4'>Login</button>
            </div>
        </div>
    )
}
