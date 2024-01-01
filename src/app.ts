import express from "express";
import helmet from "helmet";
import cors from "cors";
import ErrorHandler from "./middlewares/ErrorHandler";
import NotFound from "./middlewares/NotFound";
import docker from "./utils/docker";
import Handlebars from "hbs";
import path from "path";

require("dotenv").config();

const app = express();

app.set("views", "./src/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "index" });

app.use(helmet());
app.use(helmet.noSniff());
app.use(cors());
app.use(express.json());

app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: function (res, path, stat) {
      res.set("Cache-Control", "public, max-age=31557600"); // 1 year
    },
  })
);

Handlebars.registerHelper("statusClass", function (status) {
  if (status === "healthy") {
    return "healthy";
  } else if (status.includes("unhealthy")) {
    return "unhealthy";
  } else if (status.includes("starting")) {
    return "starting";
  } else {
    return "unknown";
  }
});

Handlebars.registerHelper("statusTxtClass", function (status) {
  if (status === "healthy") {
    return "healthyTxt";
  } else if (status.includes("unhealthy")) {
    return "unhealthyTxt";
  } else if (status.includes("starting")) {
    return "startingTxt";
  } else {
    return "unknownTxt";
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/containers", async (req, res) => {
  const userLocale = req.headers["accept-language"];
  const locales = userLocale!.split(",").map((str) => str.split(";")[0]);
  const resContainers = await docker.listContainers();

  const result = resContainers.reduce((acc: Map<string, any>, container) => {
    const statusMatch = container.Status.match(/\((.*?)\)/);
    const status = statusMatch ? statusMatch[1] : container.Status;
    const containerData = {
      name: container.Labels["com.docker.compose.service"],
      status: status,
      state: container.State,
      created: new Date(container.Created * 1000).toLocaleString(locales),
    };
    const projectName = container.Labels["com.docker.compose.project"];
    const sentenceCaseProjectName =
      projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase();

    if (!acc.has(sentenceCaseProjectName)) {
      acc.set(sentenceCaseProjectName, {
        containerName: sentenceCaseProjectName,
        services: [containerData],
      });
    } else {
      acc.get(sentenceCaseProjectName).services.push(containerData);
    }
    return acc;
  }, new Map());

  // Convert the Map back to an array
  let finalResult = Array.from(result.values());

  // Post-processing step to add containerStatus
  finalResult = finalResult.map((container) => {
    const allServicesHealthy = container.services.every(
      (service: any) => service.status === "healthy"
    );
    container.containerStatus = allServicesHealthy ? "healthy" : "unhealthy";
    return container;
  });

  res.render("partials/containers", {
    containers: finalResult,
    totalContainers: finalResult.length,
    layout: false,
  });
});

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;
