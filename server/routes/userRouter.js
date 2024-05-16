import express from "express";
import {
  userAadhaarRegisterControl,
  userLoginControl,
  userSendVerificationEmail,
  userVerifyEmail,
  userSendOTP,
  userVerifyOTP,
  userAadhaarUpdateControl,
} from "../controller/userControl.js";

const userRouter = express.Router();

userRouter.post("/aadhaar", userAadhaarRegisterControl);
userRouter.post("/sendVerificationEmail", userSendVerificationEmail);
userRouter.get("/verifyEmail", userVerifyEmail);
userRouter.post("/sendOTP", userSendOTP);
userRouter.post("/verifyOTP", userVerifyOTP);
userRouter.post("/userAadhaarUpdateControl", userAadhaarUpdateControl);
userRouter.post("/login", userLoginControl);


export default userRouter;
