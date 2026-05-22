import type { Role } from "../../types/common.types";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    created_at?: Date;
    updated_at?: Date;
}