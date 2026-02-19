/**
 * Internal types matching the Reportheld database / entity definitions.
 * These are NOT part of the public API contract.
 */

export interface LocalizedString {
  [languageCode: string]: string;
}

export interface InternalReport {
  reportId: string;
  variantName?: string;
  fileName?: string;
  language: string;
  isOld?: boolean;
  creationDate?: number;
}

export interface InternalProtocolItemSnapshot {
  name: LocalizedString;
  creatorPublicParticipantId?: string;
  data?: Record<string, unknown>;
}

export interface InternalProtocolTopicSnapshot {
  name: LocalizedString;
  items: InternalProtocolItemSnapshot[];
}

export interface InternalProtocolSnapshot {
  protocolId: string;
  powerplantId: string;
  protocolBriefcaseId?: string | null;
  templateName: LocalizedString;
  name: string;
  date?: number;
  time?: string | null;
  status: string;
  reportId?: string | null;
  reports?: InternalReport[];
  owner: string;
  topics?: InternalProtocolTopicSnapshot[];
}

export interface InternalClosedProtocol {
  id: string;
  siteId: string;
  plantId: string;
  level1: string;
  name: string;
  basedOn: string;
  date: string;
  owner: string;
  status: "closed";
}
