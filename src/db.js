import Server8787DB from "./util/db.js";
import config from "../config.js";

const DB = new Server8787DB("polzovatel_8787", "p8787gram", process.env.DB_SECRET)

export default DB