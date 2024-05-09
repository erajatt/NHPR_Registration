import React, { useEffect, useState } from "react";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import ScaleLoader from "react-spinners/ScaleLoader";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    dob: "",
    district: "",
    subDistrict: "",
    role: "",
    category: "",
    subCategory: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showMobileOtpPopup, setShowMobileOtpPopup] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileNumberVerified, setMobileNumberVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after 1500ms
    }, 1300);
  }, []);

  const roles = [
    "I am a Healthcare Professional",
    "I am a Facility manager/administrator",
    "I am a Healthcare Professional and Facility Manager",
  ];
  const categoryOptions = {
    "I am a Healthcare Professional": ["doctor", "nurse"],
    "I am a Facility manager/administrator": ["facility manager"],
    "I am a Healthcare Professional and Facility Manager": ["doctor", "nurse"],
  };
  const districts = ["Delhi", "Mumbai", "Kolkata"];

  const subDistricts = ["South Delhi", "Central Mumbai", "North Kolkata"];

  const subCategoryOptions = {
    doctor: [
      "Modern Medicine",
      "Dentist",
      "Ayurveda",
      "Unani",
      "Siddha",
      "Homeopathy",
      "Sowa-Rigpa",
    ],
    nurse: [
      "Registered Auxiliary Nurse Midwife (RANM)",
      "Registered Nurse (RN)",
      "Registered Nurse and Registered Midwife (RN & RM)",
      "Registered Lady Health Visitor (RLHV)",
    ],
  };

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      category: "",
      subCategory: "",
    });
  };

  const handleOtpInputChange = (e) => {
    setOtpValue(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    //console.log(formData);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://nhpr-registration.onrender.com/api/register/userAadhaarUpdateControl",
        formData
      );
      //console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Registration successful. Log in to continue.");
        navigate("/login");
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

  const handleVerifyEmail = async () => {
    setLoading(true);
    console.log(token);
    const response = await axios.post(
      "https://nhpr-registration.onrender.com/api/register/sendVerificationEmail",
      { token, email: formData.email }
    );
    if (response.data.success) {
      toast.success("Verification link has been sent to your email address.");
      setLoading(false);
    } else {
      console.log("failed");
      toast.error("Verification link couldnot be sent. Please try again.");
      setLoading(false);
    }
  };

  const handleVerifyPhoneNumber = async () => {
    setLoading(true);

    const response = await axios.post(
      "https://nhpr-registration.onrender.com/api/register/sendOTP",
      {
        token,
        phone: `+91${formData.phone}`,
      }
    );
    if (response.data.success) {
      setShowMobileOtpPopup(true);
      toast.info(
        "Please enter the OTP received on your mobile number to continue."
      );
      setLoading(false);
    } else {
      toast.error("OTP could not be sent");
      setLoading(false);
    }
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

    const handleOtpSubmit = async () => {
      try {
        const otpString = otp.join("");
        //console.log(otpString);
        const response = await axios.post(
          "https://nhpr-registration.onrender.com/api/register/verifyOTP",
          { code: otpString, token, phone: `+91${formData.phone}` }
        );
        if (response.data.success) {
          setShowMobileOtpPopup(false);
          toast.success("Mobile number has been verified.");
          setMobileNumberVerified(true);
          // navigate("/registrationForm");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md max-w-md">
          <button className='absolute top-2 right-2 hover:text-gray-700' onClick={setShowMobileOtpPopup(false)}><CloseIcon/></button>
          <h2 className="text-xl font-semibold mb-4">
            {`Enter OTP sent to your mobile number ${formData.phone}`}
          </h2>
          <div className="flex justify-center space-x-4">
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
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={handleOtpSubmit}
          >
            Submit OTP
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center">
      {showMobileOtpPopup && <OTPInput />}
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
        <div className="bg-white px-6 py-4 rounded-md w-4/5 my-6">
          <div className="w-full px-4 py-2 my-2 mb-4 text-white bg-blue-900 border rounded-md">
            <h1 className="text-lg font-semibold">
              Registration Form (Mobile verification is required)
            </h1>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="w-1/3 font-semibold">
              Mobile Number<span className="text-orange-600">*</span>
            </div>
            <div className="w-1/3 font-semibold">
              Email<span className="text-orange-600">*</span>
            </div>
            <div className="w-1/3 font-semibold">
              Date of Birth<span className="text-orange-600">*</span>
            </div>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="relative w-1/3">
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 my-2 mb-4 border rounded-md ${
                  mobileNumberVerified === true
                    ? "border-gray-400 bg-gray-200 text-gray-600"
                    : " border-blue-300"
                }`}
                disabled={mobileNumberVerified === true}
                required
              />
              {!mobileNumberVerified ? (
                <button
                  className="absolute top-5 right-5 text-orange-600 rounded-md"
                  onClick={handleVerifyPhoneNumber}
                >
                  Verify
                </button>
              ) : (
                <img
                  src="/verified-symbol-icon.svg"
                  className="absolute top-5 right-4"
                  width={25}
                ></img>
              )}
            </div>
            <div className="relative w-1/3">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 my-2 mb-4 border rounded-md ${
                  emailVerified === true
                    ? "border-gray-400 bg-gray-200 text-gray-600"
                    : " border-blue-300"
                }`}
                disabled={emailVerified === true}
                required
              />
              {!emailVerified ? (
                <button
                  className="absolute top-5 right-5 text-orange-600 rounded-md"
                  onClick={handleVerifyEmail}
                >
                  Verify
                </button>
              ) : (
                <img
                  src="/verified-symbol-icon.svg"
                  className="absolute top-5 right-4"
                  width={25}
                ></img>
              )}
            </div>
            <div className="relative w-1/3">
              <input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <div className="w-1/3 text-xs text-gray-400">
              Mobile number linked with Aadhaar will get auto verified, OTP will
              be sent in case mobile number is different.
            </div>
            <div className="w-1/3 text-xs text-gray-400">
              Email verification is not mandatory
            </div>
            <div className="w-1/3"></div>
          </div>

          <div className="flex justify-between space-x-4 mt-4">
            <div className="w-1/3">
              <label htmlFor="district" className="font-semibold">
                District<span className="text-orange-600">*</span>
              </label>
              <select
                id="district"
                name="district"
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md cursor-pointer"
                value={formData.district}
                onChange={handleChange}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="subDistrict" className="font-semibold">
                Sub-District<span className="text-orange-600">*</span>
              </label>
              <select
                id="subDistrict"
                name="subDistrict"
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md cursor-pointer"
                value={formData.subDistrict}
                onChange={handleChange}
              >
                <option value="">Select Sub-District</option>
                {subDistricts.map((subDistrict) => (
                  <option key={subDistrict} value={subDistrict}>
                    {subDistrict}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3"></div>
          </div>
          <div className="font-semibold mt-4">Roles</div>
          {roles.map((role) => (
            <div
              key={role}
              className="flex items-center space-x-2 cursor-pointer my-2"
              onClick={() => handleRoleChange(role)}
            >
              {formData.role === role ? (
                <RadioButtonCheckedRoundedIcon color="primary" />
              ) : (
                <RadioButtonUncheckedOutlinedIcon />
              )}
              <span>{role}</span>
            </div>
          ))}
          {formData.role && (
            <>
              <div className="w-1/3">
                <label htmlFor="category" className="font-semibold flex">
                  Category<span className="text-orange-600">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md cursor-pointer"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions[formData.role]?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {(formData.category === "doctor" ||
                formData.category === "nurse") && (
                <div className="w-1/3">
                  <label htmlFor="subCategory" className="font-semibold flex">
                    Sub-Category<span className="text-orange-600">*</span>
                  </label>
                  <select
                    id="subCategory"
                    name="subCategory"
                    className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md cursor-pointer"
                    value={formData.subCategory}
                    onChange={handleChange}
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategoryOptions[formData.category]?.map(
                      (subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between space-x-4">
            <div className="w-1/3 font-semibold flex">
              Healthcare Professional ID/username
              <span className="text-orange-600">*</span>
            </div>
            <div className="w-1/3 font-semibold flex">
              Password<span className="text-orange-600">*</span>
            </div>
            <div className="w-1/3 font-semibold flex">
              Confirm Password<span className="text-orange-600">*</span>
            </div>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="relative w-1/3">
              <input
                name="username"
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span className="absolute top-5 right-5 rounded-md">
                @hpr.abdm
              </span>
            </div>
            <div className="relative w-1/3">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              />
              {passwordVisible ? (
                <VisibilityOffOutlinedIcon
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VisibilityOutlinedIcon
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <div className="relative w-1/3">
              <input
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              />
              {confirmPasswordVisible ? (
                <VisibilityOffOutlinedIcon
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                />
              ) : (
                <VisibilityOutlinedIcon
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className=" bg-blue-100 text-blue-950 font-semibold py-3 px-4">
              <button>Reset</button>
            </div>
            <div
              className={`w-auto px-28 py-3 ${
                formData.password === formData.confirmPassword
                  ? "bg-orange-600 text-white"
                  : "bg-orange-400 text-gray-200"
              } rounded-md`}
            >
              <button
                disabled={formData.password !== formData.confirmPassword}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
