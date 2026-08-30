import app from "./app.js";
import config from "../config.js";
import DB from "./db.js";

app.get("/", (req, res) => {
    return res.status(200).json({
        ok: true,
        result: {
            name: config.name,
            version: config.version
        }
    })
})

const { PORT } = config.env

app.listen(PORT, "127.0.0.1", () => console.log(`Port ${PORT}`))