import { Navbar } from "../components/navbar"
import laptop from "../assets/laptop.webp"
import { useContext } from "react"
import { AppContent } from "../context/appContext"

export const Home = () => {
    const {userData} = useContext(AppContent)
    return (
        <>
            <Navbar />
            <div className="home">
                <div className="container text-center">
                    <img src={laptop} alt="laptop image" />
                    <h1 className="fw-bold">Welcome {userData ? userData.name.split(" ")[0] +" !" : "To Our Website"}</h1>
                    <p className="fs-5">Let's start with a quick product tour and we will have you up <br /> and running in no time!</p>
                    <button className="text-decoration-none me-4 px-2 py-1 rounded-4">Get Started</button>
                </div>
            </div> 
        </>
    )
}
