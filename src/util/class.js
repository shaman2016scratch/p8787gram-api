class User {
    constructor (json) {
        this.id = json.id || null
        this.username = json.username || `id${this.id}`
        this.name = json.name || ""
        this.lastActive = json.lastActive || new Date()
        this.created = json.created || new Date()
        this.chats = json.chats || []
        this.role = json.role || "user"
        this.password = json.password
        this.session = json.session
        this.devices = json.devices || []
    }

    JSON () {
        return {
            name: this.name,
            username: this.username,
            id: this.id,
            lastActive: this.lastActive,
            created: this.created,
            chats: this.chats,
            role: this.role,
            devices: this.devices,
            password: this.password,
            session: this.session
        }
    }

    joinChat (chat) {
        this.chats.push({
            id: chat.id,
            config: {}
        })
    }
}

class Chat {
    constructor (json) {
        this.name = json.name || ""
        this.id = json.id || null
        this.members = json.members || []
        this.type = json.type || "group"
        this.access = json.access || "private"
        this.admins = json.admins || []
        this.creator = json.creator || null
        this.owner = json.owner || this.creator
        this.messages = json.messages || []
        this.lastActive = json.lastActive || new Date()
        this.createdAt = json.createdAt || new Date()
        this.actions = json.actions || []
        this.username = json.username || `id${this.id}`
        this.memberList = json.memberList || []
    }

    JSON () {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            access: this.access,
            members: this.members,
            memberList: this.memberList,
            admins: this.admins,
            owner: this.owner,
            creator: this.creator,
            messages: this.messages,
            lastActive: this.lastActive,
            createdAt: this.createdAt,
            actions: this.actions,
            username: this.username
        }
    }

    joinUser (user) {
        this.members.push({
            id: user.id,
            joinedAt: new Date()
        })
        this.memberList.push(user.id)
        this.messages.push({
            author: {
                id: user.id,
                username: user.username
            },
            type: "joined",
            added: {
                id: user.id,
                username: user.username
            },
            deleted: false,
            date: new Date()
        })
        this.actions.push({
            author: {
                id: user.id,
                username: user.username
            },
            type: "joined",
            added: {
                id: user.id,
                username: user.username
            },
            date: new Date()
        })
    }

    addUser (user, adder) {
        this.members.push({
            id: user.id,
            joinedAt: new Date()
        })
        this.memberList.push(user.id)
        this.messages.push({
            author: {
                id: adder.id,
                username: adder.username
            },
            type: "joined",
            added: {
                id: user.id,
                username: user.username
            },
            deleted: false,
            date: new Date()
        })
        this.actions.push({
            author: {
                id: adder.id,
                username: adder.username
            },
            type: "joined",
            added: {
                id: user.id,
                username: user.username
            },
            date: new Date()
        })
    }

    addAdmin (user, adder) {
        this.admins.push({
            id: user.id,
            addedAt: new Date()
        })
        this.messages.push({
            author: {
                id: adder.id,
                username: adder.username
            },
            type: "newAdmin",
            added: {
                id: user.id,
                username: user.username
            },
            deleted: false,
            date: new Date()
        })
        this.actions.push({
            author: {
                id: adder.id,
                username: adder.username
            },
            type: "newAdmin",
            added: {
                id: user.id,
                username: user.username
            },
            date: new Date()
        })
    }
}

export {
    User,
    Chat
}