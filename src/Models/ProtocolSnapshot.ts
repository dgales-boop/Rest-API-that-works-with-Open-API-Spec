/**
 * Language-keyed string values (e.g. { en: "...", de: "..." }).
 */
export interface LocalizedString {
  [languageCode: string]: string;
}

/**
 * Report entity — structure depends on actual Report definition.
 */
export interface Report {
  [key: string]: unknown;
}

/**
 * Protocol topic snapshot — structure depends on topic definition.
 */
export interface ProtocolTopicSnapshot {
  [key: string]: unknown;
}

/**
 * ProtocolSnapshot entity matching the OpenAPI protocolSnapshot schema.
 */
export interface ProtocolSnapshot {
  protocolId: string;
  powerplantId: string;
  protocolBriefcaseId?: string | null;
  templateName: LocalizedString;
  name: string;
  date?: number; // UnixOffset timestamp
  time?: string | null; // HH:mm pattern
  status: string; // default "none"
  reportId?: string | null;
  reports?: Report[];
  owner: string;
  topics?: ProtocolTopicSnapshot[];
}
