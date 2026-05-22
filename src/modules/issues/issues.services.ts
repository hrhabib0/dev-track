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

// update a issue into db
const updateIssueIntoDB = async (issueId: string, payload: any, currentUser: any) => {
    const issueResult = await pool.query(`
        SELECT * FROM issues
        WHERE id=$1
        `, [issueId]);
    if (issueResult.rows.length === 0) {
        throw new Error("Issue not found");
    }
    const existingIssue = issueResult.rows[0];

    const userRole = currentUser.role;
    if (!(userRole === "contributor" || userRole === "maintainer")) {
        throw new Error(
            "You are not authorized to update issue"
        );
    }
    if (userRole === "contributor") {

        if (
            existingIssue.reporter_id !== currentUser.id
        ) {
            throw new Error(
                "You are not authorized to update this issue"
            );
        }

        if (existingIssue.status !== "open") {
            throw new Error(
                "You can only update open issues"
            );
        }
    }

    const fields = [];
    const values = [];

    if (payload.title) {
        values.push(payload.title);

        fields.push(
            `title = $${values.length}`
        );
    }

    if (payload.description) {
        values.push(payload.description);

        fields.push(
            `description = $${values.length}`
        );
    }

    if (payload.type) {
        values.push(payload.type);

        fields.push(
            `type = $${values.length}`
        );
    }

    fields.push(
        `updated_at = CURRENT_TIMESTAMP`
    );

    values.push(issueId);

    const sqlQuery = `
        UPDATE issues
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
    `;

    const updatedResult = await pool.query(
        sqlQuery,
        values
    );

    return updatedResult.rows[0];
}

// delete a Issue from db
const deleteIssueFromDB = async (issueId: string, currentUser: any) => {
    if (currentUser.role !== "maintainer") {
        throw new Error(
            "Only maintainers can delete issues"
        );
    }

    const issueResult = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [issueId]
    );

    const existingIssue = issueResult.rows[0];

    if (!existingIssue) {
        throw new Error(
            "Issue not found"
        );
    }

    await pool.query(
        `
        DELETE FROM issues
        WHERE id = $1
        `,
        [issueId]
    );
}

export const issuesServices = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueIntoDB,
    deleteIssueFromDB
}