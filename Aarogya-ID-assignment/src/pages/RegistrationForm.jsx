import React, { useState } from "react";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const RegistrationForm = () => {
  // State to store selected district and sub-district
  const [formData, setFormData] = useState({
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    district: "",
    subDistrict: "",
    role: "",
    category: "",
    subCategory: "",
    idUsername: "",
    password: "",
    confirmPassword: "",
  });

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  // Function to handle role selection
  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      category: "", // Reset category selection when role changes
      subCategory: "", // Reset sub-category selection when role changes
    });
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
      const response = await axios.post("apii", formData);
      console.log("Response:", response.data);
      // Add any additional logic here after successful API call
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <div className="flex justify-center items-center">
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
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              required
            />
            <button className="absolute top-5 right-5 text-orange-600 rounded-md">
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
            <button className="absolute top-5 right-5 text-orange-600 rounded-md">
              Verify
            </button>
          </div>
          <div className="relative w-1/3">
            <input
              name="dateOfBirth"
              value={formData.dateOfBirth}
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
              name="idUsername"
              className="w-full px-4 py-3 my-2 mb-4 border border-blue-300 rounded-md"
              value={formData.idUsername}
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
