import express from "express";
import cors from "cors";
import path from "node:path";
import { moderateImage } from "./moderation.js";
import { drawingsRouter } from "./routes/drawings.js";

export function createApp({
    moderate = moderateImage,
    uploadDir = process.env.UPLOAD_DIR || path.resolve("uploads"),
} = {}) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
    app.use("/api/drawings", drawingsRouter({ moderate, uploadDir }));
    app.use("/uploads", express.static(uploadDir));
    return app;
}