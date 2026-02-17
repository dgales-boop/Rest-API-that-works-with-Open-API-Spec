import { Router } from "express";
import ProtocolController from "../Controllers/ProtocolController";

const router = Router();
const protocolController = new ProtocolController();

router.get("/closed", protocolController.listClosed.bind(protocolController));
router.get(
  "/closed/:id",
  protocolController.getClosed.bind(protocolController),
);

export default router;
