import express, { type Application } from "express";
import dotenv from "dotenv";


dotenv.config();
const app: Application = express();
// const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`DevTrack Server is listening on port ${port}`)
})