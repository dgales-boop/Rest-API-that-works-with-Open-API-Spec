import { closedProtocols } from "../../../Database/mockData";
import type { ClosedProtocol } from "../../../Models/ClosedProtocol";

export default class ProtocolService {
  /**
   * Retrieve all closed protocols.
   */
  public getAll(): ClosedProtocol[] {
    return closedProtocols;
  }

  /**
   * Retrieve a single closed protocol by ID.
   */
  public getById(id: string): ClosedProtocol | undefined {
    return closedProtocols.find((p) => p.id === id);
  }
}
