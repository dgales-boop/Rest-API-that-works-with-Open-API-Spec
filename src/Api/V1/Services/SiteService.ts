import { sites } from "../../../Database/mockData";
import type { Site } from "../../../Models/Site";

export default class SiteService {
  /**
   * Retrieve all sites.
   */
  public getAll(): Site[] {
    return sites;
  }
}
