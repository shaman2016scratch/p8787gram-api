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
}

export {
    User
}