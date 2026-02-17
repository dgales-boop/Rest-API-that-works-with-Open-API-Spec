import { Router } from "express";
import userRoutes from "./userRoutes";
import testRoutes from "./testRoutes";
import siteRoutes from "./siteRoutes";
import plantRoutes from "./plantRoutes";
import protocolRoutes from "./protocolRoutes";

const router = Router();

// Existing routes
router.use("/user", userRoutes);
router.use("/test", testRoutes);

// New resource routes
router.use("/sites", siteRoutes);
router.use("/plants", plantRoutes);
router.use("/protocols", protocolRoutes);

export default router;
