import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth.routes";
import { issuesRoute } from "./modules/issues/issues.route";


const app: Application = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use("/api/auth", authRoute)
app.use("/api/issues", issuesRoute)
export default app;