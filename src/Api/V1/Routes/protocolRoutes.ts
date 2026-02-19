import { Router } from "express";
import ProtocolController from "../Controllers/ProtocolController";

const router = Router();
const protocolController = new ProtocolController();

router.get("/closed", protocolController.listClosed.bind(protocolController));
router.get("/closed/:id", protocolController.getClosed.bind(protocolController));
router.get("/closed/:id/snapshot", protocolController.getClosedSnapshot.bind(protocolController));

export default router;
