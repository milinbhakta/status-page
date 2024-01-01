import express from "express";
import { isWebsiteOnline } from "../utils/utils";

const router = express.Router();

router.get("/websites", async (req, res) => {
  const websites = process.env.WEBSITES?.split(",") || [];
  if (!websites) {
    res.status(500).send("WEBSITES environment variable not set");
  }

  const websiteResult = await Promise.all(
    websites.map(
      (website) =>
        new Promise((resolve) => {
          isWebsiteOnline(website, (err: any, online: boolean) => {
            const domainName = new URL(website).hostname;
            if (err) {
              console.error(err);
            }
            resolve({
              domainName: domainName.endsWith("/")
                ? domainName.slice(0, -1)
                : domainName,
              name: website,
              online: online,
              websiteStatus: online ? "healthy" : "unhealthy",
            });
          });
        })
    )
  );

  res.render("partials/websites", {
    websites: websiteResult,
    totalContainers: websiteResult.length,
    layout: false,
  });
});

export default router;
