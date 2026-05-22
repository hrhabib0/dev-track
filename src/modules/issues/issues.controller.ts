import type { Request, Response } from "express"
import type { JwtPayload } from "jsonwebtoken";
import { issuesServices } from "./issues.services";
import sendResponse from "../../utils/sendResponse";

const createIssues = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;
        const reporter_id = (req.user as JwtPayload).id;
        const userRole = (req.user as JwtPayload).role;
        if (!(userRole === "contributor" || userRole === "maintainer")) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "Forbidden",
                data: null,
            });
        }
        if (!(type === "bug" || type === "feature_request")) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Type must be bug or feature_request",
                data: null,
            });
        }
        const issue = await issuesServices.createIssuesIntoDB({
            title,
            description,
            type,
            reporter_id
        })
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created  ad successfully",
            data: issue,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 400,
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

// get all issues
const getAllIssues = async (req: Request, res: Response) => {
    try {
        const issues = await issuesServices.getAllIssuesFromDB(req.query);
        return res.status(200).json({
            success: true,
            data: issues,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 400,
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

// get single issue
const getSingleIssue = async (req: Request, res: Response) => {
    try {
        // console.log(req.params.id)
        const { id } = req.params;
        const issue = await issuesServices.getSingleIssueFromDB(id as string);
        return res.status(200).json({
            success: true,
            data: issue,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 404,
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 400,
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

    } catch (error: unknown) {
        if (error instanceof Error) {
            return sendResponse(res, {
                statusCode: 400,
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

export const issuesController = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}