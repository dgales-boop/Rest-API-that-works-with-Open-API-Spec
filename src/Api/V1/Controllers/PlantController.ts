import type { Request, Response } from "express";
import Controller from "./Controller";
import PlantService from "../Services/PlantService";

const plantService = new PlantService();

export default class PlantController extends Controller {
  /**
   * GET /plants
   * Returns array of plants per OpenAPI spec.
   */
  public index(_req: Request, res: Response): void {
    const plants = plantService.getAll();
    res.json(plants);
  }
}
