import type { Request, Response } from "express"
import { authServices } from "./auth.services"

const signUpUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        const result = await authServices.signUpUserInotDb(req.body);
        return res.status(201).json({
            success: true,
            message: "User SignUp Successfully",
            data: result
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export const authController = {
    signUpUser,
}