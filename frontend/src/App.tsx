import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


function App() {

  const { authUser, isLoading } = useAuthContext();

	if (isLoading) return null;

  return (
    <div className="p-4 h-screen flex items-center justify-center">
     <Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
				<Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
			</Routes>
      <Toaster/>
    </div>
  )
}

export default App
