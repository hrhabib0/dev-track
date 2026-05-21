import bcrypt from "bcryptjs";
import { pool } from "../../db/db";
const signUpUserInotDb = async (payload: any) => {

    const { name, email, password: plainPassword, role } = payload;
    const hashedPasword = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(`
        INSERT INTO users(name, email, password, role)
        VALUES($1,$2,$3,$4) 
        RETURNING *
        `, [name, email, hashedPasword, role]);

    const userData = result.rows[0];
    const { password, ...restUserInfo } = userData;
    return restUserInfo;
}

export const authServices = {
    signUpUserInotDb,
}