import express from "express";
import cors from "cors"

const app = express();

app.use(
	express.json({ limit: "5mb" }),
	cors(),
	cookieParser()
)

export {
	app as default
};