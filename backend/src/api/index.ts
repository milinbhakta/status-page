import express from "express";
import dockerApi from "./dockerApi";

const router = express.Router();

router.use("/containers", dockerApi);

export default router;
