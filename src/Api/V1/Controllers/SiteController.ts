import type { Request, Response } from "express";
import Controller from "./Controller";
import SiteService from "../Services/SiteService";

const siteService = new SiteService();

export default class SiteController extends Controller {
  /**
   * GET /sites
   * Returns array of sites per OpenAPI spec.
   */
  public index(_req: Request, res: Response): void {
    const sites = siteService.getAll();
    res.json(sites);
  }
}
