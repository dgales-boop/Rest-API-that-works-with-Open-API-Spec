import { closedProtocols, protocolSnapshots } from "../../../Database/mockData";
import type { ClosedProtocol } from "../../../Models/ClosedProtocol";
import type { ProtocolSnapshot } from "../../../Models/ProtocolSnapshot";

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

  /**
   * Retrieve the snapshot for a closed protocol.
   * Returns undefined if the protocol doesn't exist, isn't closed, or has no snapshot.
   */
  public getSnapshotByProtocolId(id: string): ProtocolSnapshot | undefined {
    const protocol = this.getById(id);
    if (!protocol || protocol.status !== "closed") {
      return undefined;
    }
    return protocolSnapshots.find((s) => s.protocolId === id);
  }
}
