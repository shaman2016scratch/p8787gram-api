import { DB_URL } from "../../config.js";

class Server8787DB {

    #DB_SECRET = ""

    constructor (group, project, DB_SECRET) {
        this.group = group
        this.project = project
        this.#DB_SECRET = DB_SECRET
    }

    async write (file, newContent) {
        const DB_SECRET = this.#DB_SECRET
        const project = this.project
        const projectGroup = this.project
        const connecT = await (await fetch(`https://${DB_URL}/files/write/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "bypass-tunnel-reminder": "true"
            },
            body: JSON.stringify({
                DB_SECRET,
                projectGroup,
                project,
                file,
                newContent
            })
        })).json()
        const isOk = connecT.ok === true
        return isOk ? connecT.result : connecT.error
    }

    async read (file) {
        const DB_SECRET = this.#DB_SECRET
        const project = this.project
        const projectGroup = this.project
        const connecT = await (await fetch(`https://${DB_URL}/files/read/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "bypass-tunnel-reminder": "true"
            },
            body: JSON.stringify({
                DB_SECRET,
                projectGroup,
                project,
                file
            })
        })).json()
        const isOk = connecT.ok === true
        return isOk ? connecT.result : connecT.error
    }
}

export {
    Server8787DB as default
}