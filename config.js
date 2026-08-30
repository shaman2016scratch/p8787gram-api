import _package from "./package.cjs"
const { packageJson } = _package

const config = {
    env: {
        "DB_IP": "server8787.loca.lt",
        "DB_PORT": 443,
        PORT: 8603
    },
    name: packageJson.name,
    version: packageJson.version
}

export default config