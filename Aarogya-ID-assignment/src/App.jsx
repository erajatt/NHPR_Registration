import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Resource from "./pages/Resource";
import Support from "./pages/Support";
import RegistrationForm from "./pages/RegistrationForm";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }, []);

  return (
    <div className="bg-slate-200 min-h-screen">
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <ScaleLoader color="#FF7F00" loading={loading} height={35} width={4} radius={2} margin={2} speedMultiplier={2} />
        </div>
      ) : (
        <BrowserRouter>
          <ToastContainer autoClose={2000} />
          <Header />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/support" element={<Support />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/about" element={<About />} />
            <Route path="/registrationform" element={<RegistrationForm />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
