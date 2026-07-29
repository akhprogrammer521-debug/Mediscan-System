import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";

const app: Express = express();

// Middlewares
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorMiddleware);


export default app;
