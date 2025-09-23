import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails
} from "../controllers/auth.controller.js";
import { registerUserValidator, loginUserValidator, updateAccountValidator } from "../validators/auth.validate.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/register").post(registerUserValidator(), validate, registerUser);

router.route("/login").post(loginUserValidator(), validate, loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").get(refreshAccessToken);

router.route("/me").get(verifyJWT, getCurrentUser)

router.route("/update").patch(verifyJWT, updateAccountValidator(), validate, updateAccountDetails);

export default router;