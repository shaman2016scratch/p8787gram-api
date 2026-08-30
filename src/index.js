import { User } from "./util/class.js";
import jwt from "jsonwebtoken";
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

app.get("/users/:target", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    const usersIndex = JSON.stringify(rawIndex)
    const { target } = req.params
    if (!usersIndex.users.includes(target)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[target])
    return res.status(200).json({
        ok: true,
        result: {
            id: user.id,
            name: user.name,
            username: user.username,
            lastActive: user.lastActive,
            joined: user.joined,
            role: user.role
        }
    })
})

app.post("/login", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawIndex)
    const { username, password } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if (user.password !== password) {
        return res.status(403).json({
            ok: true,
            error: "Invalid password"
        })
    }
    user.lastActive = new Date()
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })
    usersIndex[username] = user.JSON()
    await DB.write("/users/index.json", usersIndex.toString())
    return res.status(200).json({
        ok: true,
        result: token
    })
})

app.post("/session", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawIndex)
    const { username, token } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if (user.session !== token || jwt.verify(token, process.env.JWT_SECRET)) {
        return res.status(403).json({
            ok: true,
            error: "Invalid token"
        })
    }
    return res.status(200).json({
        ok: true,
        result: {
            id: user.id,
            name: user.name,
            username: user.username,
            lastActive: user.lastActive,
            joined: user.joined,
            role: user.role,
            devices: user.devices
        }
    })
})

app.post("/session/chats", async (req, res) => {
    let limit = parseInt(req.query.limit, 10);
	let offset = parseInt(req.query.offset, 10);
	limit = isNaN(limit) ? 40 : Math.min(Math.max(1, limit), 40); 
	offset = isNaN(offset) ? 0 : Math.max(0, offset);
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawIndex)
    const { username, token } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if (user.session !== token || jwt.verify(token, process.env.JWT_SECRET)) {
        return res.status(403).json({
            ok: true,
            error: "Invalid token"
        })
    }
    return res.status(200).json({
        ok: true,
        result: (user.chats || []).slice(offset, offset + limit)
    })
})

app.post("/register", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawIndex)
    const { name, username, password } = req.body
    if (usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User found"
        })
    }
    const user = new User({ name, username, password, id: Object.keys(usersIndex).length+1 })
    user.lastActive = new Date()
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })
    usersIndex[username] = user.JSON()
    await DB.write("/users/index.json", usersIndex.toString())
    return res.status(200).json({
        ok: true,
        result: token
    })
})

const { PORT } = config.env

app.listen(PORT, "127.0.0.1", () => console.log(`Port ${PORT}`))