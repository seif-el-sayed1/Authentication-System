import { Home } from "./pages/home"
import {GetStarted} from "./pages/getStarted"
import { Routes, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import { VerifyEmail } from "./pages/VerifyEmail";
function App() {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/getStarted" element={<GetStarted />}/>
        <Route path="/verifyEmail" element={<VerifyEmail />}/>
      </Routes>
    </>
  )
}

export default App
