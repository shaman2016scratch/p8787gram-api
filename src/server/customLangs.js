import app from "../app.js";

const tranbase = {}

app.get("/translations/:id", (req, res) => {
    if (!Object.keys(tranbase).includes(req.params.id)) return res.status(404).json({ ok: false, error: "translation not found" })
    return res.status(200).json({
        ok: true,
        result: {
            id: req.params.id,
            translations: `https://api-p8787gram.loca.lt/translations/data/${req.params.id}`
        }
    })
})

app.get("/translations/data/:id", (req, res) => {
    if (!Object.keys(tranbase).includes(req.params.id)) return res.status(404).json({})
    return res.status(200).json(tranbase[req.params.id])
})