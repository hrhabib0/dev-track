import { pool } from "../../db/db"

const createIssuesIntoDB = async (payload: any) => {
    const { title, description, type, reporter_id } = payload;
    const result = await pool.query(`
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `, [title, description, type, reporter_id])
    return result.rows[0];
}

export const issuesServices = {
    createIssuesIntoDB,
}