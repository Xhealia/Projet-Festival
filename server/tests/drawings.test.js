import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/app.js";

const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg == ",
    "base64"
);
let uploadDir;
beforeEach(() => {
    uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "draw-"));
});
const send = (app) =>
    request(app)
        .post("/api/drawings")
        .attach("image", png, { filename: "d.png", contentType: "image/png" });
describe("POST /api/drawings", () => {
    it("accepte un dessin conforme (201)", async () => {
        const app = createApp({
            uploadDir, moderate: async () => ({
                flagged:
                    false
            })
        });
        const res = await send(app);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("approved");
        expect(fs.readdirSync(uploadDir)).toHaveLength(1);
    });
    it("refuse un dessin signalé (422) sans le sauvegarder", async () => {
        const app = createApp({
            uploadDir, moderate: async () => ({
                flagged: true
            })
        });
        const res = await send(app);
        expect(res.status).toBe(422);
        expect(fs.readdirSync(uploadDir)).toHaveLength(0);
    });
    it("bloque tout si la modération est en panne (503)", async () => {
        const app = createApp({
            uploadDir,
            moderate: async () => {
                throw new Error("down");
            },
        });
        const res = await send(app);
        expect(res.status).toBe(503);
        expect(fs.readdirSync(uploadDir)).toHaveLength(0);
    });
    it("répond 400 sans fichier", async () => {
        const app = createApp({
            uploadDir, moderate: async () => ({
                flagged:
                    false
            })
        });
        const res = await request(app).post("/api/drawings");
        expect(res.status).toBe(400);
    });
});