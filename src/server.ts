import app from "./app"
import config from "./config/config"
import { initDb } from "./db/db";

const port = config.port;

const main = () => {
    initDb();
    app.listen(port, () => {
        console.log(`DevTrack Server is listening on port ${port}`)
    })
}
main();
