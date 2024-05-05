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

function App() {
  return (
    <div className="bg-slate-200 min-h-screen">
      <BrowserRouter>
      <Header/>
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
    </div>
  );
}

export default App;
