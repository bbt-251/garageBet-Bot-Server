import "dotenv/config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "./bot";

const app = express();
const port = process.env.PORT || 3010;

app.use(bodyParser.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "garagebet-bot-server" });
});

app.listen(port, () => {
    console.log(`🚀 GarageBet Bot Server running on port ${port}`);
});
