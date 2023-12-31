import express from "express";
import helmet from "helmet";
import cors from "cors";
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

app.get("/", async (req, res) => {
  const resContainers = await docker.listContainers();

  const result = resContainers.reduce((acc: Map<string, any>, container) => {
    const statusMatch = container.Status.match(/\((.*?)\)/);
    const status = statusMatch ? statusMatch[1] : container.Status;
    const containerData = {
      name: container.Labels["com.docker.compose.service"],
      status: status,
      state: container.State,
      created: new Date(container.Created * 1000)
        .toLocaleString()
        .replace(/\/|, /g, "-")
        .replace(/: /, " "),
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
    layout: "index",
    containers: finalResult,
    totalContainers: finalResult.length,
    updatedOn: new Date().toLocaleString(),
  });
});

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;