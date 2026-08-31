import Server8787DB from "./util/db.js";
import config from "../config.js";
import cors from "cors"

const DB = new Server8787DB("polzovatel_8787", "p8787gram", process.env.DB_SECRET)

app.use(
	express.json({ limit: "5mb" }),
	cors(),
	cookieParser()
)

export default DB