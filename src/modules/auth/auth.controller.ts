import type { Request, Response } from "express"
import { authServices } from "./auth.services"
import sendResponse from "../../utils/sendResponse";

const signUpUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        if (!(role === "contributor" || role === "maintainer")) {
            return res.status(400).json({
                success: false,
                message: "Role is not valid",
            });
        }
        const result = await authServices.signUpUserInotDb(req.body);
        return res.status(201).json({
            success: true,
            message: "User SignUp Successfully",
            data: result
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 500,
                success: false,
                message: error.message,
                data: null,
            });
        }
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Something went wrong",
            data: null,
        });
    }

}

const logInUser = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await authServices.signInUserIntoDb(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

export const authController = {
    signUpUser,
    logInUser
}