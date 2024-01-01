import express from "express";
import { isWebsiteOnline } from "../utils/utils";
import website from "../interfaces/Website";

const router = express.Router();

router.get("/websites", async (req, res) => {
  const websites: website[] = JSON.parse(process.env.WEBSITES || "[]");
  if (!websites) {
    res.status(500).send("WEBSITES environment variable not set");
  }

  const websiteResult = await Promise.all(
    websites.map(
      (website) =>
        new Promise((resolve) => {
          isWebsiteOnline(website.url, (err: any, online: boolean) => {
            if (err) {
              console.error(err);
            }
            resolve({
              domainName: website.domain,
              name: website.name,
              online: online,
              websiteStatus: online ? "healthy" : "unhealthy",
            });
          });
        })
    )
  );

  res.render("partials/websites", {
    websites: websiteResult,
    layout: false,
  });
});

export default router;
