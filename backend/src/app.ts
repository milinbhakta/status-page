import express from "express";
import helmet from "helmet";
import cors from "cors";
import api from "./api";
import ErrorHandler from "./middlewares/ErrorHandler";
import NotFound from "./middlewares/NotFound";
import docker from "./utils/docker";
import Handlebars from "hbs";

require("dotenv").config();

const app = express();

app.set("views", "./src/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "index" });

app.use(helmet());
app.use(cors());
app.use(express.json());

Handlebars.registerHelper("statusClass", function (status) {
  if (status === "healthy") {
    return "healthy";
  } else if (status.includes("Up") && status.includes("(unhealthy)")) {
    return "unhealthy";
  } else if (status.includes("starting")) {
    return "starting";
  } else {
    return "unknown";
  }
});

app.get("/", async (req, res) => {
  const resContainers = await docker.listContainers();

  res.render("partials/containers", {
    layout: "index",
    containers: resContainers.map((container) => {
      const statusMatch = container.Status.match(/\((.*?)\)/);
      const status = statusMatch ? statusMatch[1] : container.Status;
      let btnName = "";
      if (status === "healthy") {
        btnName = "Operational";
      } else if (status === "unhealthy") {
        btnName = "Non-operational";
      } else if (status === "starting") {
        btnName = "Initializing";
      }
      return {
        name: container.Names.join(", "),
        status: status,
        state: container.State,
        created: new Date(container.Created * 1000)
          .toLocaleString()
          .replace(/\/|, /g, "-")
          .replace(/: /, " "),
        btnClass: status === "healthy" ? "btn-success" : "btn-danger",
        btnName: btnName,
      };
    }),
  });
});

app.use("/api/v1", api);

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;
