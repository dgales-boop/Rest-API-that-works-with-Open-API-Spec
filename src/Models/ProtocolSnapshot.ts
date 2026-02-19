/**
 * Public types matching the OpenAPI 3.1 specification.
 * These are the shapes returned by the REST API.
 */

export interface LocalizedString {
  [languageCode: string]: string;
}

export interface Report {
  reportId: string;
  fileName?: string;
  language?: string;
}

export interface ProtocolItem {
  name: LocalizedString;
  value?: string | number | boolean | Record<string, unknown>;
  status?: string;
}

export interface ProtocolTopic {
  name: LocalizedString;
  items: ProtocolItem[];
}

export interface ProtocolSnapshot {
  protocolId: string;
  plantId: string;
  templateName: LocalizedString;
  name: string;
  date: string;
  owner?: string;
  reports?: Report[];
  topics?: ProtocolTopic[];
}
