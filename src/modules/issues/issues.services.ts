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

// get all issues
const getAllIssuesFromDB = async (query: any) => {
    const sort = query.sort === "oldest" ? "ASC" : "DESC";

    let sqlQuery = `
        SELECT *
        FROM issues
        WHERE 1=1
      `;

    const values: any[] = [];

    if (query.type) {
        values.push(query.type);
        sqlQuery += `
            AND type = $${values.length}
        `;
    }

    if (query.status) {
        values.push(query.status);
        sqlQuery += `
            AND status = $${values.length}
        `;
    }

    sqlQuery += `
        ORDER BY created_at ${sort}
    `;

    const issuesResult = await pool.query(sqlQuery, values);
    const allIssues = issuesResult.rows;

    // get reporter's Ids
    const reporterIds = [
        ...new Set(
            allIssues.map((issue) => issue.reporter_id)
        )
    ]

    if (reporterIds.length === 0) {
        return [];
    }

    // fetch reporters/users
    const usersResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = ANY($1)
        `,
        [reporterIds]
    );
    const users = usersResult.rows;

    // create user map
    const userMap = new Map();
    users.forEach((user) => {
        userMap.set(user.id, user);
    });

    // join issue and reporter's info
    const formattedIssues = allIssues.map(
        (issue) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,

            reporter:
                userMap.get(issue.reporter_id),

            created_at: issue.created_at,
            updated_at: issue.updated_at,
        })
    );

    return formattedIssues;
}

// get singleIssueFromDB
const getSingleIssueFromDB = async (id: any) => {
    const result = await pool.query(`
        SELECT * FROM issues
        WHERE id=$1
        `, [id]);
    if (result.rows.length === 0) {
        throw new Error("No issue found")
    }
    const issue = result.rows[0];

    const reporterResult = await pool.query(`
        SELECT id,name,role
        FROM users
        WHERE id=$1
        `, [issue.reporter_id]);
    const reporter = reporterResult.rows[0];

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter,

        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
}
export const issuesServices = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB
}