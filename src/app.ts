import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth.routes";


const app: Application = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use("/api/auth", authRoute)

export default app;