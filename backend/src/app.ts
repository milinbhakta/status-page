import express from "express";
import helmet from "helmet";
import cors from "cors";
import api from "./api";
import ErrorHandler from "./middlewares/ErrorHandler";
import NotFound from "./middlewares/NotFound";
import docker from "./utils/docker";

require("dotenv").config();

const app = express();

app.set("views", "./src/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "index" });

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const containers = await docker.listContainers();
  res.render("partials/containers", {
    layout: "index",
    containers,
  });
});

app.use("/api/v1", api);

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;
