import { Express } from "express";
import helmet from "helmet";

export default function helmetMiddleware(app: Express) {
  app.use(helmet());
  app.use(helmet.noSniff());
}
