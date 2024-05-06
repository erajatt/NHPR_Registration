import React, { useEffect, useState } from "react";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const RegistrationForm = () => {
  // State to store selected district and sub-district
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

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showMobileOtpPopup, setShowMobileOtpPopup] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [token, setToken] = useState("");

  // Define the roles (A, B, C)
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

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  // Function to handle role selection
  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      category: "", // Reset category selection when role changes
      subCategory: "", // Reset sub-category selection when role changes
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
    console.log(formData);
    try {
      const response = await axios.post(
        "https://nhpr-registration.onrender.com/api/register/userAadhaarUpdateControl",
        formData
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Registration successful. Log in to continue.");
        navigate("/login");
      } else {
        toast.error("Some error occured!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyEmail = async () => {
    const response = await axios.post(
      "https://nhpr-registration.onrender.com/api/register/sendVerificationEmail",
      token
    );
    if (response.data.success) {
      toast.success("Verification link has been sent to your email address.");
    }
  };

  const handleVerifyPhoneNumber = async () => {
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
    }
  };
  // Dummy data for districts and sub-districts (replace with actual data)
  const districts = [
    "Delhi",
    "Mumbai",
    "Kolkata",
    // ... Add other districts here
  ];

  const subDistricts = [
    "South Delhi",
    "Central Mumbai",
    "North Kolkata",
    // ... Add other sub-districts here
  ];

  const subCategories = [
    "South Delhi",
    "Central Mumbai",
    "North Kolkata",
    // ... Add other sub-districts here
  ];

  const OTPInput = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to hold OTP digits
    const inputRefs = []; // Array to hold input refs

    const handleInputChange = (index, e) => {
      const newOtp = [...otp];
      newOtp[index] = e.target.value;

      // Move cursor to next input box on typing a digit
      if (e.target.value && index < otp.length - 1) {
        inputRefs[index + 1].focus();
      }

      setOtp(newOtp);
    };

    const handleKeyDown = (index, e) => {
      // Move cursor to previous input box on pressing backspace in an empty box
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs[index - 1].focus();
      }
    };

    const handleOtpSubmit = async () => {
      try {
        const otpString = otp.join("");
        console.log(otpString);
        const response = await axios.post(
          "https://nhpr-registration.onrender.com/api/register/verifyOTP",
          { code: otpString, token, phone: `+91${formData.phone}` }
        );
        if (response.data.success) {
          setShowMobileOtpPopup(false); // Close OTP popup
          toast.success(
            "OTP verification successful. Fill the registartion form."
          );
          navigate("/registrationForm");
        } else {
          toast.error("Some error occurred!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Enter OTP sent to your mobile number ${formData.phone}
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
              className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              required
            />
            <button
              className="absolute top-5 right-5 text-orange-600 rounded-md"
              onClick={handleVerifyPhoneNumber}
            >
              Verify
            </button>
          </div>
          <div className="relative w-1/3">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              required
            />
            <button
              className="absolute top-5 right-5 text-orange-600 rounded-md"
              onClick={handleVerifyEmail}
            >
              Verify
            </button>
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
            <div className="flex justify-between space-x-4 mt-4">
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
                  {categoryOptions[formData.role].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
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
                  {subCategories.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/3"></div>
            </div>
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
            <span className="absolute top-5 right-5 rounded-md">@hpr.abdm</span>
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

        {/* Other form fields */}
      </div>
    </div>
  );
};

export default RegistrationForm;
