/**
 * Language-keyed string map (e.g. { en: "...", de: "..." }).
 * Matches LocalizedString usage across all snapshot entities.
 */
export interface LocalizedString {
  [languageCode: string]: string;
}

/**
 * Report entity matching Report.json entity definition.
 */
export interface Report {
  reportId: string;
  variantName?: string;
  fileName?: string;
  language: string;
  isOld?: boolean;
  creationDate?: number; // UnixOffset timestamp
}

/**
 * Snapshot of a single checklist item within a protocol topic.
 * Matches ProtocolItemSnapshot.json entity definition.
 */
export interface ProtocolItemSnapshot {
  name: LocalizedString;
  creatorPublicParticipantId?: string;
  data?: Record<string, unknown>; // flexible payload, defaults to {}
}

/**
 * Snapshot of a topic (section) within a protocol.
 * Matches ProtocolTopicSnapshot.json entity definition.
 */
export interface ProtocolTopicSnapshot {
  name: LocalizedString;
  items: ProtocolItemSnapshot[];
}

/**
 * Complete computed snapshot of a closed protocol.
 * Matches ProtocolSnapshot.json entity definition.
 */
export interface ProtocolSnapshot {
  protocolId: string;
  powerplantId: string;
  protocolBriefcaseId?: string | null;
  templateName: LocalizedString;
  name: string;
  date?: number; // UnixOffset timestamp
  time?: string | null; // HH:mm pattern
  status: string; // ProtocolStatus enum value, defaults to "none"
  reportId?: string | null;
  reports?: Report[];
  owner: string;
  topics?: ProtocolTopicSnapshot[];
}
