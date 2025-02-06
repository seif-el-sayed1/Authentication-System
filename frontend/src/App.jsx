import { Home } from "./pages/home"
import {GetStarted} from "./pages/getStarted"
import { Routes, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify"
function App() {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/getStarted" element={<GetStarted />}/>
      </Routes>
    </>
  )
}

export default App
