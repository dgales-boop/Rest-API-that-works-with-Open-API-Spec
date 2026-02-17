import { Router } from "express";
import PlantController from "../Controllers/PlantController";

const router = Router();
const plantController = new PlantController();

router.get("/", plantController.index.bind(plantController));

export default router;
