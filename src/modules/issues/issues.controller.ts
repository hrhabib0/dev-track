import type { Request, Response } from "express"
import type { JwtPayload } from "jsonwebtoken";
import { issuesServices } from "./issues.services";

const createIssues = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;
        const reporter_id = (req.user as JwtPayload).id;
        if (!(type === "bug" || type === "feature_request")) {
            return res.status(400).json({
                success: false,
                message: "Type must be bug or feature_request",
            });
        }
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

// get all issues
const getAllIssues = async (req: Request, res: Response) => {
    try {
        const issues = await issuesServices.getAllIssuesFromDB(req.query);
        return res.status(200).json({
            success: true,
            data: issues,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// get single issue
const getSingleIssue = async (req: Request, res: Response) => {
    try {
        // console.log(req.params.id)
        const { id } = req.params;
        const issue = await issuesServices.getSingleIssueFromDB(id);
        return res.status(200).json({
            success: true,
            data: issue,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

// update a issue
const updateIssue = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updatedIssue = await issuesServices.updateIssueIntoDB(id as string, req.body, req.user);
        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: updatedIssue,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// delete a issue
const deleteIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        const currentUser = req.user as any;

        await issuesServices.deleteIssueFromDB(
            issueId,
            currentUser
        );

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
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
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}