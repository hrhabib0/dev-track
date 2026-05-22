import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }
            const decoded = jwt.verify(token, config.secret) as JwtPayload;
            req.user = decoded;
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default auth;