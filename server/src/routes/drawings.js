import { Router } from "express";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export function drawingsRouter({ moderate, uploadDir }) {
    const router = Router();
    const upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => cb(null, file.mimetype === "image/png")
    });

    router.post("/", upload.single("image"), async (req, res) => {
        if (!req.file) return res.status(400).json({ error: "PNG manquant ou invalide" });
        try {
            const verdict = await moderate(req.file.buffer, req.file.mimetype);
            if (verdict.flagged) {
                return res.status(422).json({ status: "rejected", reason: "Contenu non conforme" });
            }
            const id = randomUUID();
            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(path.join(uploadDir, `${id}.png`), req.file.buffer);
            return res.status(201).json({ status: "approved", id, url: `/uploads/${id}.png` });
        } catch (err) {
            console.error(err);
            return res.status(503).json({ error: "Modération indisponible, réessaie plus tard" });
        }
    });

    router.get("/", async (_req, res) => {
        await fs.mkdir(uploadDir, { recursive: true });
        const files = (await fs.readdir(uploadDir)).filter((f) => f.endsWith(".png"));
        res.json(files.map((f) => ({ id: f.replace(".png", ""), url: `/uploads/${f}` })));
    });

    return router;
}