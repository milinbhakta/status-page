import express from "express";
import helmet from "helmet";
import cors from "cors";
import api from "./api";
import ErrorHandler from "./middlewares/ErrorHandler";
import NotFound from "./middlewares/NotFound";

require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1", api);

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;
