import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post('/signup', authController.signUpUser);
router.post('/login', auth(), authController.logInUser);

export const authRoute = router;