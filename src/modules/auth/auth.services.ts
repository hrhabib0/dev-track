import bcrypt from "bcryptjs";
import { pool } from "../../db/db";
import jwt from "jsonwebtoken";
import config from "../../config/config";

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

const signInUserIntoDb = async (email: string, password: string) => {
    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])

    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }
    const user = userData.rows[0];
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
        throw new Error("Invalid Credentials");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    const token = jwt.sign(jwtPayload, config.secret, {
        expiresIn: "7d"
    })
    return {
        token,
        user
    }

}

export const authServices = {
    signUpUserInotDb,
    signInUserIntoDb
}