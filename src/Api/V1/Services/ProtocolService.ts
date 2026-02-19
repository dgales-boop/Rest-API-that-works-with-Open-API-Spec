import { closedProtocols, protocolSnapshots } from "../../../Database/mockData";
import type { ClosedProtocol } from "../../../Models/ClosedProtocol";
import type {
  ProtocolSnapshot,
  ProtocolTopic,
  ProtocolItem,
  Report,
} from "../../../Models/ProtocolSnapshot";
import type {
  InternalClosedProtocol,
  InternalProtocolSnapshot,
  InternalProtocolTopicSnapshot,
  InternalProtocolItemSnapshot,
  InternalReport,
} from "../../../Models/internal";

// ─── Internal → Public mappers ────────────────────────────────────────────────

function unixOffsetToISODate(ts: number | undefined): string {
  if (ts === undefined) return new Date(0).toISOString();
  return new Date(ts * 1000).toISOString();
}

function mapReport(r: InternalReport): Report {
  return {
    reportId: r.reportId,
    ...(r.fileName !== undefined ? { fileName: r.fileName } : {}),
    ...(r.language !== undefined ? { language: r.language } : {}),
  };
}

function mapItem(item: InternalProtocolItemSnapshot): ProtocolItem {
  const data = item.data ?? {};
  const { status, ...rest } = data;

  const hasMultipleValues = Object.keys(rest).length > 1;
  const firstValue = Object.values(rest)[0];

  const mapped: ProtocolItem = { name: item.name };

  if (hasMultipleValues) {
    mapped.value = rest as Record<string, unknown>;
  } else if (firstValue !== undefined) {
    mapped.value = firstValue as string | number | boolean;
  }

  if (typeof status === "string") {
    mapped.status = status;
  }

  return mapped;
}

function mapTopic(topic: InternalProtocolTopicSnapshot): ProtocolTopic {
  return {
    name: topic.name,
    items: topic.items.map(mapItem),
  };
}

function mapClosedProtocol(p: InternalClosedProtocol): ClosedProtocol {
  return {
    id: p.id,
    plantId: p.plantId,
    name: p.name,
    template: p.basedOn,
    date: p.date,
    owner: p.owner,
    status: p.status,
  };
}

function mapSnapshot(s: InternalProtocolSnapshot): ProtocolSnapshot {
  return {
    protocolId: s.protocolId,
    plantId: s.powerplantId,
    templateName: s.templateName,
    name: s.name,
    date: unixOffsetToISODate(s.date),
    owner: s.owner,
    ...(s.reports && s.reports.length > 0
      ? { reports: s.reports.map(mapReport) }
      : {}),
    ...(s.topics && s.topics.length > 0
      ? { topics: s.topics.map(mapTopic) }
      : {}),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export default class ProtocolService {
  public getAll(): ClosedProtocol[] {
    return closedProtocols.map(mapClosedProtocol);
  }

  public getById(id: string): ClosedProtocol | undefined {
    const found = closedProtocols.find((p) => p.id === id);
    return found ? mapClosedProtocol(found) : undefined;
  }

  public getSnapshotByProtocolId(id: string): ProtocolSnapshot | undefined {
    const protocol = closedProtocols.find((p) => p.id === id);
    if (!protocol || protocol.status !== "closed") {
      return undefined;
    }
    const snapshot = protocolSnapshots.find((s) => s.protocolId === id);
    return snapshot ? mapSnapshot(snapshot) : undefined;
  }
}
