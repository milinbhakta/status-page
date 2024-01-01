import express from "express";
import docker from "../utils/docker";

const router = express.Router();

router.get("/containers", async (req, res) => {
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
      created: container.Created,
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

export default router;
