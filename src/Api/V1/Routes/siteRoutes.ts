import { Router } from "express";
import SiteController from "../Controllers/SiteController";

const router = Router();
const siteController = new SiteController();

router.get("/", siteController.index.bind(siteController));

export default router;
