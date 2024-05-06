import React, { useEffect, useState } from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AodIcon from "@mui/icons-material/Aod";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginType, setLoginType] = useState("username");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState("");
  const [isValid, setIsValid] = useState(false);

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

  const handleSubmit = () => {
    // Handle form submission
    //console.log("Form submitted!");
  };

  const handleCancel = () => {
    // Handle form submission
    navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
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
              loginType === "mobile" ? "border-orange-600" : ""
            }`}
            onClick={() => setLoginType("mobile")}
          >
            <div className="flex space-x-2 py-2">
              <AodIcon />
              <p>Mobile Number</p>
            </div>
          </button>
        </div>
        {loginType === "username" ? (
          <>
            <p>Healthcare Professional ID</p>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
            />
          </>
        ) : (
          <>
            <p>Registered Mobile No.</p>
            <div className="flex mb-8 mt-2">
              <input
                type="text"
                placeholder="+91"
                className="w-20 px-4 py-3 border border-blue-300 rounded-l-md"
                disabled
              />
              <input
                type="text"
                placeholder="Mobile Number"
                className="flex-1 px-4 py-3 border border-blue-300 rounded-r-md"
              />
            </div>
          </>
        )}
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
    </div>
  );
};

export default Login;
