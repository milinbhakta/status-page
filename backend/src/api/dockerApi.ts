import express from "express";
import docker from "../utils/docker";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const containers = await docker.listContainers();
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: "Error getting containers" });
  }
});

export default router;
