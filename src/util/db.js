import config from "../../config.js"

const DB_URL = `${config.env.DB_IP}:${config.env.DB_PORT}`

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
        try {
            const connecT = await (await fetch(`https://${DB_URL}/files/write/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "bypass-tunnel-reminder": true
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
        } catch (e) {
            console.error(e)
            return {}
        }
    }

    async read (file) {
        let demoConnecT
        try {
            const DB_SECRET = this.#DB_SECRET
            const project = this.project
            const projectGroup = this.project
            demoConnecT = await fetch(`https://${DB_URL}/files/read/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "bypass-tunnel-reminder": true
                },
                body: JSON.stringify({
                    DB_SECRET,
                    projectGroup,
                    project,
                    file
                })
            })
            const connecT = await demoConnecT.json()
            const isOk = connecT.ok === true
            if (!isOk) console.error(`Error with getting data: ${connecT.error}`)
            return isOk ? connecT.result : connecT.error
        } catch (e) {
            try {
                const connecT = await demoConnecT.text()
                console.log(connecT)
            } catch (e) {
                console.error("DB ERROR")
                console.error(e)
                return {}
            }
        }
    }
}

export {
    Server8787DB as default
}