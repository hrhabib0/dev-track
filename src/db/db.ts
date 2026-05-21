import { Pool } from "pg";
import config from "../config/config";

export const pool = new Pool({
    connectionString: config.connection_string
})

export const initDb = async () => {
    try {
        console.log("Database connect successfully")
    } catch (error) {
        console.log(error)
    }
}