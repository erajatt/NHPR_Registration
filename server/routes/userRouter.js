import express from "express";
import { userAadhaarRegisterControl, userSendVerifiactionEmail,userVerifyEmail,userSendOTP,userVerifyOTP, userAadhaarUpdateControl } from "../controller/userControl.js";

const userRouter = express.Router();

userRouter.post("/aadhaar", userAadhaarRegisterControl);
userRouter.post("/sendVerifiactionEmail", userSendVerifiactionEmail);
userRouter.get("/verifyEmail", userVerifyEmail);
userRouter.post("/sendOTP", userSendOTP);
userRouter.post("/verifyOTP", userVerifyOTP);
userRouter.post("/submitRegistrationForm",userAadhaarUpdateControl);

export default userRouter;
