import type { Request, Response } from "express"
import type { JwtPayload } from "jsonwebtoken";
import { issuesServices } from "./issues.services";

const createIssues = async (req: Request, res: Response) => {
    console.log("issues coming up...")
    try {
        const { title, description, type } = req.body;
        const reporter_id = (req.user as JwtPayload).id;
        const issue = await issuesServices.createIssuesIntoDB({
            title,
            description,
            type,
            reporter_id
        })
        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: issue,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const issuesController = {
    createIssues,
}