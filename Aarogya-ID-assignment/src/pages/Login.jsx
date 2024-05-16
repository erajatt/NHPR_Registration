import React, { useEffect, useState } from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AodIcon from "@mui/icons-material/Aod";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const Login = () => {
  const [loginType, setLoginType] = useState("username");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    // setToken(window.localStorage.getItem("token"));
    setTimeout(() => {
      setLoading(false); // Set loading to false after 1500ms
    }, 1300);
  }, []);

  const generateRandomNumbers = () => {
    const random1 = Math.floor(Math.random() * 100) + 1; // Generate random number between 1 and 10
    const random2 = Math.floor(Math.random() * 100) + 1;
    setNum1(random1);
    setNum2(random2);
    setSum(""); // Clear the input field
    setIsValid(false); // Reset validation state
  };
  useEffect(() => {
    generateRandomNumbers();
  }, []);

  const handleSumChange = (e) => {
    const inputSum = parseInt(e.target.value, 10);
    if (!isNaN(inputSum)) {
      setSum(inputSum);
      setIsValid(inputSum === num1 + num2); // Validate the sum
    } else {
      setSum(""); // Clear the input field if input is not a number
      setIsValid(false); // Reset validation state
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // console.log(phone);
    // console.log(username);

    // console.log(password);

    try {
      const response = await axios.post(
        "https://nhpr-registration.onrender.com/api/register/login",
        { phone, username, password }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // console.log(response.data.token);
        setCookie("token", response.data.token);
        window.localStorage.setItem("token", response.data.token);
        navigate("/about");
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Handle form submission
    navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      {loading ? ( // Show loader if loading is true
        <div className="flex items-center justify-center h-screen">
          <ScaleLoader
            color="#FF7F00"
            loading={loading}
            height={35}
            width={4}
            radius={2}
            margin={2}
            speedMultiplier={2}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md w-2/5 my-10 min-h-100">
          <h2 className="text-2xl mb-4 font-bold">
            Login to National Healthcare Providers Registry
          </h2>
          <p className="mt-8 mb-2">Login via</p>
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 border border-blue-300 rounded-md ${
                loginType === "username" ? "border-orange-600" : ""
              }`}
              onClick={() => setLoginType("username")}
            >
              <div className="flex space-x-2 py-2">
                <PermIdentityIcon />
                <p>Healthcare Professional ID/Username</p>
              </div>
            </button>
            <button
              className={`px-4 py-2 border border-blue-300 rounded-md ${
                loginType === "phone" ? "border-orange-600" : ""
              }`}
              onClick={() => setLoginType("phone")}
            >
              <div className="flex space-x-2 py-2">
                <AodIcon />
                <p>phone Number</p>
              </div>
            </button>
          </div>
          {loginType === "username" ? (
            <>
              <p>Healthcare Professional ID</p>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              />
            </>
          ) : (
            <>
              <p>Registered phone No.</p>
              <div className="flex mb-8 mt-2">
                <input
                  type="text"
                  placeholder="+91"
                  className="w-20 px-4 py-3 border border-blue-300 rounded-l-md"
                  disabled
                />
                <input
                  type="text"
                  placeholder="phone Number"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-r-md"
                />
              </div>
            </>
          )}

          <p>Enter Password</p>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full px-4 py-3 my-2 mb-4 border rounded-md border-blue-300"
            />
            {passwordVisible ? (
              <VisibilityOutlinedIcon
                className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <VisibilityOffOutlinedIcon
                className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>

          <div className="flex items-center my-4 justify-start">
            <span>
              {num1} + {num2} = ?
            </span>
            <input
              type="text"
              value={sum}
              onChange={handleSumChange}
              className="w-14 px-4 py-2 mx-4 border border-blue-300 rounded-md"
            />
            <button onClick={generateRandomNumbers}>
              <LoopIcon />
            </button>
          </div>
          <div className="flex justify-between my-4">
            <button
              onClick={handleCancel}
              className="w-auto px-28 py-3 mr-4 bg-slate-200 rounded-l-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid} // Disable the button if sum is invalid
              className={`w-auto px-28 py-3 ${
                isValid
                  ? "bg-orange-600 text-white"
                  : "bg-orange-400 text-gray-200"
              } rounded-md`}
            >
              Login
            </button>
          </div>
          <div className="flex justify-center mt-4">
            Do not have an account?
            <a href="/register" className="text-orange-600 ml-2">
              Register here.
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
