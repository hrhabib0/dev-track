import type { IssueStatus, IssueType } from "../../types/common.types";

export interface IIssue {
    id?: number;
    title: string;
    description: string;
    type: IssueType;
    status?: IssueStatus;
    reporter_id?: number;
    created_at?: Date;
    updated_at?: Date;
}