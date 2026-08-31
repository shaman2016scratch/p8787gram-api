import { User, Chat } from "./util/class.js";
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
    const usersIndex = JSON.stringify(rawUsersIndex)
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

app.get("/users/id/:id", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    const usersIndex = JSON.stringify(rawUsersIndex)
    const { id } = req.params
    const target = Object.keys(usersIndex)[id-1]
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
    try {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawUsersIndex)
    const { username, password, token } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if (password ? user.password !== password : user.token !== token) {
        return res.status(403).json({
            ok: true,
            error: "Invalid password"
        })
    }
    user.lastActive = new Date()
    const userToken = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })
    user.sessions.push(userToken)
    const IP = req.headers["x-forwarded-for"]
    user.devices.push({
        session: userToken,
        IP,
        started: new Date(),
        lastActive: new Date()
    })
    usersIndex[username] = user.JSON()
    await DB.write("/users/index.json", usersIndex.toString())
    return res.status(200).json({
        ok: true,
        result: userToken
    })
    } catch (e) {
        console.error(`/login/ ip ${IP} error ${e.message}`)
        return res.status(500).json({
            ok: true,
            error: "Interal Server Error",
            err: e.message
        })
    }
})

app.post("/session", async (req, res) => {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawUsersIndex)
    const { username, token } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if ((!user.sessions.includes(session) && session !== user.token) || jwt.verify(token, process.env.JWT_SECRET)) {
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
    let usersIndex = JSON.stringify(rawUsersIndex)
    const { username, token } = req.body
    if (!usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if ((!user.sessions.includes(session) && session !== user.token) || jwt.verify(token, process.env.JWT_SECRET)) {
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
    try {
    const rawUsersIndex = await DB.read("/users/index.json")
    let usersIndex = JSON.stringify(rawUsersIndex)
    const { name, username, password } = req.body
    if (usersIndex.users.includes(username)) {
        return res.status(404).json({
            ok: true,
            error: "User found"
        })
    }
    const user = new User({ name, username, password, id: Object.keys(usersIndex).length+1 })
    user.lastActive = new Date()
    const userToken = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })
    user.sessions.push(userToken)
    const IP = req.headers["x-forwarded-for"]
    user.devices.push({
        session: userToken,
        IP,
        started: new Date(),
        lastActive: new Date()
    })
    usersIndex[username] = user.JSON()
    await DB.write("/users/index.json", usersIndex.toString())
    return res.status(200).json({
        ok: true,
        result: userToken
    })
    } catch (e) {
        console.error(`/register/ ip ${IP} error ${e.message}`)
        return res.status(500).json({
            ok: true,
            error: "Interal Server Error",
            err: e.message
        })
    }
})

app.get("/chats/:target", async (req, res) => {
    const rawChatsIndex = await DB.read("/users/index.json")
    const chatsIndex = JSON.stringify(rawChatsIndex)
    const { target } = req.params
    if (!chatsIndex.users.includes(target)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const chat = new Chat(chatsIndex[target])
    return res.status(200).json({
        ok: true,
        result: {
            id: chat.id,
            name: chat.name,
            username: chat.username,
            members: chat.members.lenght
        }
    })
})

app.get("/chats/id/:id", async (req, res) => {
    const rawChatsIndex = await DB.read("/users/index.json")
    const chatsIndex = JSON.stringify(rawChatsIndex)
    const { id } = req.params
    const target = Object.keys(chatsIndex)[id-1]
    if (!chatsIndex.users.includes(target)) {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const chat = new Chat(chatsIndex[target])
    return res.status(200).json({
        ok: true,
        result: {
            id: chat.id,
            name: chat.name,
            username: chat.username,
            members: chat.members.lenght
        }
    })
})

app.post("/chats/:target/info", async (req, res) => {
    const rawChatsIndex = await DB.read("/users/index.json")
    const chatsIndex = JSON.stringify(rawChatsIndex)
    const rawUsersIndex = await DB.read("/users/index.json")
    const usersIndex = JSON.stringify(rawUsersIndex)
    const { target } = req.params
    const { username, session } = req.body
    if (!chatsIndex.chats.includes(target)) {
        return res.status(404).json({
            ok: true,
            error: "Chat not found"
        })
    }
    const chat = new Chat(chatsIndex[target])
    if (!usersIndex.users.includes(target) && chat.access === "private") {
        return res.status(404).json({
            ok: true,
            error: "User not found"
        })
    }
    const user = new User(usersIndex[username])
    if (chat.access === "private" && !chat.memberList.includes(user.id)) {
        return res.status(403).json({
            ok: true,
            error: "You is not in the chat"
        })
    }
    if ((!user.sessions.includes(session) && session !== user.token) || jwt.verify(session, process.env.JWT_SECRET)) {
        return res.status(403).json({
            ok: true,
            error: "Invalid token"
        })
    }
    return res.status(200).json({
        ok: true,
        result: {
            id: chat.id,
            name: chat.name,
            username: chat.username,
            members: chat.members.length,
            lastActive: chat.lastActive,
            createdAt: chat.createdAt,
            messages: chat.messages.length
        }
    })
})

const { PORT } = config.env

app.listen(PORT, "127.0.0.1", () => console.log(`Port ${PORT}`))