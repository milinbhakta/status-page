import express from "express";
import ErrorHandler from "./middlewares/ErrorHandler";
import NotFound from "./middlewares/NotFound";
import path from "path";
import helmetMiddleware from "./middlewares/helmet";
import corsMiddleware from "./middlewares/cors";
import registerHandlebarsHelpers from "./utils/handlebars";
import containersRouter from "./routes/containers";
import websitesRouter from "./routes/websites";

require("dotenv").config();

if (!process.env.WEBSITES) {
  throw new Error("WEBSITES environment variable not set");
}

const app = express();

app.set("views", "./src/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "index" });

app.use(express.json());

app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: function (res, path, stat) {
      res.set("Cache-Control", "public, max-age=31557600"); // 1 year
    },
  })
);

helmetMiddleware(app);
corsMiddleware(app);

registerHandlebarsHelpers();

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", containersRouter);
app.use("/", websitesRouter);

// middleware for handling not found routes
app.use(NotFound);

// middleware for handling errors
app.use(ErrorHandler);

export default app;
