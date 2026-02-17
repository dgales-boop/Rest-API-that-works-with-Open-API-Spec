import type { Request, Response } from "express";
import Controller from "./Controller";
import ProtocolService from "../Services/ProtocolService";

const protocolService = new ProtocolService();

/** Safely extract a route param as string. */
function paramStr(val: string | string[] | undefined): string {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

export default class ProtocolController extends Controller {
  /**
   * GET /protocols/closed
   * Returns array of closed protocols per OpenAPI spec.
   */
  public listClosed(_req: Request, res: Response): void {
    const protocols = protocolService.getAll();
    res.json(protocols);
  }

  /**
   * GET /protocols/closed/:id
   * Returns a single closed protocol metadata.
   */
  public getClosed(req: Request, res: Response): void {
    const id = paramStr(req.params.id);

    const protocol = protocolService.getById(id);

    if (!protocol) {
      this.sendErrorResponse(res, "Protocol not found", 404);
      return;
    }

    res.json(protocol);
  }
}
