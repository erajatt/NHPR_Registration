import React, { useEffect, useState } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import ScaleLoader from "react-spinners/ScaleLoader";

const Register = () => {
  const [loading, setLoading] = useState(true); // Set loading initially to true
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after 1500ms
    }, 1300);
  }, []);
  const [idType, setIdType] = useState("Aadhaar");
  const [idNumber, setIdNumber] = useState("");
  const [step, setStep] = useState(1);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [token, setToken] = useState("token");

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://nhpr-registration.onrender.com/api/register/aadhaar",
        {
          aadhaar: idNumber,
        }
      );

      if (response.data.success) {
        setToken(response.data.token);
        setCookie("token", response.data.token);
        window.localStorage.setItem("token", response.data.token);
        //console.log(response.data.token);
        const response1 = await axios.post(
          "https://nhpr-registration.onrender.com/api/register/sendOTP",
          {
            phone: "+919908760036",
            token: response.data.token,
          }
        );

        //console.log(response1.data);
        if (response1.data.success) {
          toast.info("Enter OTP sent to your Aadhaar linked mobile number.");
          setStep(2);
          setLoading(false);
        } else {
          toast.error("OTP couldn't be sent.");
          setLoading(false);
        }
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
    navigate("/");
  };

  const handleDeclarationChange = (e) => {
    setIsDeclarationChecked(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const OTPInput = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to hold OTP digits
    const inputRefs = []; // Array to hold input refs

    const handleInputChange = (index, e) => {
      const newOtp = [...otp];
      newOtp[index] = e.target.value;

      if (e.target.value && index < otp.length - 1) {
        inputRefs[index + 1].focus();
      }

      setOtp(newOtp);
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs[index - 1].focus();
      }
    };

    const handleSubmit2 = async () => {
      try {
        setLoading(true);
        const otpString = otp.join("");
        //console.log(otpString);
        const response = await axios.post(
          "https://nhpr-registration.onrender.com/api/register/verifyOTP",
          { code: otpString, token, phone: "+919908760036" }
        );
        if (response.data.success) {
          toast.success(
            "OTP verification successful. Fill the registartion form."
          );
          navigate("/registrationForm");
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

    return (
      <div>
        <div className="text-sm mb-4">
          We have sent an OTP to the Aadhaar linked Mobile number ******0036.
        </div>
        <div className="flex justify-start items-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs[index] = ref)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 mx-2 text-center border-blue-300 border rounded-md"
            />
          ))}
        </div>
        <div className="flex justify-between my-4">
          <button
            onClick={handleCancel}
            className="w-auto px-28 py-3 mr-4 bg-slate-200 rounded-l-md"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit2}
            disabled={otp.some((digit) => digit === "")} // Disable if any OTP box is empty
            className={`w-auto px-28 py-3 ${
              otp.every((digit) => digit !== "")
                ? "bg-orange-600 text-white"
                : "bg-orange-400 text-gray-200"
            } rounded-md`}
          >
            Submit
          </button>
        </div>
        <div className="flex justify-center mt-4">
          Already have an account?
          <a href="/login" className="text-orange-600 ml-2">
            Login here.
          </a>
        </div>
      </div>
    );
  };

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
        <div className="bg-white px-6 py-4 rounded-md w-2/5 my-6">
          <h2 className="text-2xl mb-1 font-bold">
            Create your Healthcare Professional ID
          </h2>
          <p className="text-sm">
            The Healthcare professional ID will connect you to the India's
            Digital Health Ecosystem
          </p>
          <p className="mt-2">Generate Healthcare professional ID via</p>
          <div className="flex justify-between my-4">
            <button
              className={`px-20 py-3 rounded-md border ${
                idType === "Aadhaar" ? "border-orange-600" : "border-blue-300"
              }`}
              onClick={() => setIdType("Aadhaar")}
            >
              <div className="flex">
                <img src="/aadhaar-1.svg" width={40} alt="Aadhaar Logo" />
                <p className="ml-2">Aadhaar</p>
              </div>
            </button>
            <button
              className={`px-14 py-3 rounded-md border ${
                idType === "Driving License"
                  ? "border-orange-600"
                  : "border-blue-300"
              }`}
              onClick={() => setIdType("Driving License")}
            >
              <div className="flex">
                <ArticleOutlinedIcon />
                <p className="ml-2">Driving License</p>
              </div>
            </button>
          </div>
          {idType === "Aadhaar" ? (
            <>
              <p>Enter your Aadhaar Number/Virtual ID</p>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                  }}
                  placeholder="Aadhaar Number"
                  className={`w-full px-4 py-3 my-2 mb-4 border rounded-md ${
                    step === 2
                      ? "border-gray-400 bg-gray-200 text-gray-600"
                      : "border-blue-300"
                  }`}
                  disabled={step === 2} // Disable input when step is 2
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
            </>
          ) : (
            <>
              <p>Enter your Driving Driving License Number</p>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"} // Toggle between text and password type
                  placeholder="Driving License Number"
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                  }}
                  className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
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
            </>
          )}
          {step === 1 && (
            <>
              <div className="declaration-box h-12 overflow-y-auto">
                <p className="text-xs font-semibold">
                  I, hereby declare that I am voluntarily sharing my Aadhaar
                  Number / Virtual ID and demographic information issued by
                  UIDAI, with National Health Authority (NHA) for the sole
                  purpose of creation of Healthcare Professional ID. I
                  understand that my Healthcare Professional ID can be used and
                  shared for purposes as may be notified by Ayushman Bharat
                  Digital Mission (ABDM) from time to time including provision
                  of healthcare services. Further, I am aware that my personal
                  identifiable information (Name, Address, Age, Date of Birth,
                  Gender and Photograph) may be made available to the entities
                  working in the National Digital Health Ecosystem (NDHE) which
                  inter alia includes stakeholders and entities such as
                  healthcare professional (e.g. doctors), facilities (e.g.
                  hospitals, laboratories) and data fiduciaries (e.g. health
                  programmes), which are registered with or linked to the
                  Ayushman Bharat Digital Mission (ABDM), and various processes
                  there under. I authorize NHA to use my Aadhaar number /
                  Virtual ID for performing Aadhaar based authentication with
                  UIDAI as per the provisions of the Aadhaar (Targeted Delivery
                  of Financial and other Subsidies, Benefits and Services) Act,
                  2016 for the aforesaid purpose. I understand that UIDAI will
                  share my e-KYC details, or response of “Yes” with NHA upon
                  successful authentication. I consciously choose to use Aadhaar
                  number / Virtual ID for the purpose of availing benefits
                  across the NDHE. I am aware that my personal identifiable
                  information excluding Aadhaar number / VID number can be used
                  and shared for purposes as mentioned above. I reserve the
                  right to revoke the given consent at any point of time as per
                  provisions of Aadhaar Act and Regulations and other laws,
                  rules and regulations.
                </p>
              </div>
              <div className="flex items-center my-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isDeclarationChecked}
                  onChange={handleDeclarationChange}
                  className="mr-2"
                />
                <label htmlFor="declaration" className="text-sm">
                  I agree
                </label>
              </div>
              <div className="flex items-center justify-start">
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
                  Reset
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
                  Submit
                </button>
              </div>
              <div className="flex justify-center mt-4">
                Already have an account?
                <a href="/login" className="text-orange-600 ml-2">
                  Login here.
                </a>
              </div>
            </>
          )}
          {step === 2 && <OTPInput />}
        </div>
      )}
    </div>
  );
};

export default Register;
