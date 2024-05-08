import { userModel } from "../models/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import twilio from "twilio";
dotenv.config();

const userAadhaarRegisterControl = async (req, res) => {
  const { aadhaar } = req.body;

  try {
    const user1 = await userModel.findOne({ aadhaar });
    if (user1) {
      console.log(`Aadhaar:${aadhaar} already exist!`);
      return res.json({
        message: `User with aadhaar already exists!`,
        success: false,
      });
    }
    const newUser = new userModel({
      aadhaar,
    });

    await newUser.save();
    const token = jwt.sign({ id: aadhaar }, process.env.JWT_SECRET);

    return res.json({
      message: "Aadhaar Registered Successfully!!",
      success: true,
      token,
    });
  } catch (error) {
    await userModel.findOneAndDelete({ aadhaar });
    console.log("Error: ", error.message);
    return res.json({
      message: "Some error occured please try again!",
      success: false,
    });
  }
};

const userSendVerificationEmail = async (req, res) => {
  const { token, email } = req.body;
  console.log(token);
  console.log(email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "rajatrkb6@gmail.com",
      pass: process.env.PASS_EMAIL,
    },
  });

  const mailOptions = {
    from: "rajatrkb6@gmail.com",
    to: email,
    subject: "NHPR Email Verification",
    html: `To verify your Email click on the <a href='https://nhpr-registration.onrender.com/api/register/verifyEmail?token=${token}'>link</a>`,
  };

  try {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(`Error sending Verification email\n ${error}`);
        return res.json({
          message: `Error sending Verification email .`,
          success: false,
        });
      }
      console.log("Email sent:", info?.response);
      return res.json({
        message: `Verification email sent to ${email}`,
        success: true,
      });
    });
  } catch (err) {
    console.log("Error sending email Verification:", err);
  }
};

const userVerifyEmail = async (req, res) => {
  const { token } = req.query;
  const decodedToken = jwt.decode(String(token), process.env.JWT_SECRET);
  const aadhaar = decodedToken.id;
  try {
    await userModel.findOneAndUpdate({ aadhaar }, { emailVerified: true });
    //console.log(req.query);
    return res.json({
      message: `Email Verified ${token}`,
      success: true,
    });
  } catch (error) {
    //console.log("Error: ", error.message);
    return res.json({
      message: "Some error occured please try again!",
      success: false,
    });
  }
};

const userSendOTP = async (req, res) => {
  const { token, phone } = req.body;
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  const aadhaar = decodedToken.id;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_SERVICE_SID;
  const client = twilio(accountSid, authToken);

  try {
    await userModel.findOneAndUpdate({ aadhaar }, { phone });
    client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" })
      .then((verification) => {
        return res.json({
          message: "OTP Sent to your Phone number.",
          success: true,
        });
      });
  } catch (error) {
    //console.log(error.message);
    return res.json({
      message: "Failed to send OTP. Try again",
      success: false,
    });
  }
};

const userVerifyOTP = async (req, res) => {
  const { token, phone, code } = req.body;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_SERVICE_SID;
  const client = twilio(accountSid, authToken);
  const decodedToken = jwt.decode(String(token), process.env.JWT_SECRET);
  const aadhaar = decodedToken.id;

  try {
    client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code })
      .then(async (verification_check) => {
        if (verification_check.valid) {
          //console.log("OTP matched");
          await userModel.findOneAndUpdate(
            { aadhaar },
            { accountVerified: true, phoneVerified: true }
          );
          return res.json({
            message: `OTP Verified ${token}`,
            success: true,
          });
        } else {
          //console.log("Wrong OTP");
          res.json({
            message: "wrong OTP entered. Try again!",
            success: false,
          });
        }
      });
  } catch (error) {
    //console.log("Error: ", error.message);
    return res.json({
      message: "Some error occured please try again!",
      success: false,
    });
  }
};

const userAadhaarUpdateControl = async (req, res) => {
  const {
    token,
    username,
    phone,
    email,
    dob,
    district,
    subDistrict,
    category,
    subCategory,
    role,
    password,
  } = req.body;
  const decodedToken = jwt.decode(String(token), process.env.JWT_SECRET);
  const aadhaar = decodedToken.id;
  try {
    const user1 = await userModel.findOne({ aadhaar });
    if (!accountVerified) {
      return res.json({
        message: "Account not Verified. Please try again!",
        success: false,
      });
    } else if (!phoneVerified) {
      return res.json({
        message: "Phone not Verified. please try again!",
        success: false,
      });
    } else if (!emailVerified) {
      return res.json({
        message: "Email not Verified .Please try again!",
        success: false,
      });
    } else {
      await userModel.findOneAndUpdate(
        { aadhaar },
        {
          username,
          phone,
          email,
          dob,
          district,
          subDistrict,
          category,
          subCategory,
          role,
          password,
        }
      );

      //console.log(`Details Updated.`);
      return res.json({
        message: "Details updated.",
        success: true,
      });
    }
  } catch (error) {
    //console.log("Error: ", error.message);
    return res.json({
      message: "Some error occured please try again!",
      success: false,
    });
  }
};
export {
  userAadhaarRegisterControl,
  userAadhaarUpdateControl,
  userSendVerificationEmail,
  userVerifyEmail,
  userSendOTP,
  userVerifyOTP,
};
