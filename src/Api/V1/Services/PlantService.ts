import { plants } from "../../../Database/mockData";
import type { Plant } from "../../../Models/Plant";

export default class PlantService {
  /**
   * Retrieve all plants.
   */
  public getAll(): Plant[] {
    return plants;
  }
}
