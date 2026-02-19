import type { Site } from "../Models/Site";
import type { Plant } from "../Models/Plant";
import type { InternalClosedProtocol, InternalProtocolSnapshot } from "../Models/internal";

export const sites: Site[] = [
  {
    id: "site-1",
    name: "Berlin Manufacturing Hub",
    abbreviationName: "BMH",
    zip: "10115",
    address: "Industriestraße 12",
    city: "Berlin",
    country: "Germany",
  },
  {
    id: "site-2",
    name: "Munich Engineering Center",
    abbreviationName: "MEC",
    zip: "80331",
    address: "Technikweg 5",
    city: "Munich",
    country: "Germany",
  },
  {
    id: "site-3",
    name: "Hamburg Logistics Park",
    abbreviationName: "HLP",
    zip: "20095",
    address: "Hafenallee 88",
    city: "Hamburg",
    country: "Germany",
  },
];

export const plants: Plant[] = [
  {
    id: "plant-1",
    siteId: "site-1",
    name: "Assembly Line Alpha",
    code: "ALA-001",
    level1: "Berlin Manufacturing Hub",
    zip: "10115",
    address: "Industriestraße 12, Halle A",
    city: "Berlin",
    country: "Germany",
  },
  {
    id: "plant-2",
    siteId: "site-1",
    name: "Welding Station Beta",
    code: "WSB-002",
    level1: "Berlin Manufacturing Hub",
    zip: "10115",
    address: "Industriestraße 12, Halle B",
    city: "Berlin",
    country: "Germany",
  },
  {
    id: "plant-3",
    siteId: "site-2",
    name: "Paint Shop Gamma",
    code: "PSG-003",
    level1: "Munich Engineering Center",
    zip: "80331",
    address: "Technikweg 5, Gebäude 3",
    city: "Munich",
    country: "Germany",
  },
  {
    id: "plant-4",
    siteId: "site-3",
    name: "Quality Control Delta",
    code: "QCD-004",
    level1: "Hamburg Logistics Park",
    zip: "20095",
    address: "Hafenallee 88, Block D",
    city: "Hamburg",
    country: "Germany",
  },
];

export const closedProtocols: InternalClosedProtocol[] = [
  {
    id: "1",
    siteId: "site-1",
    plantId: "plant-1",
    level1: "Berlin Manufacturing Hub",
    name: "Monthly Safety Inspection - January",
    basedOn: "Safety Protocol Template v2.1",
    date: "2024-01-31",
    owner: "inspector.mueller",
    status: "closed",
  },
  {
    id: "2",
    siteId: "site-1",
    plantId: "plant-2",
    level1: "Berlin Manufacturing Hub",
    name: "Equipment Calibration Report - Q1",
    basedOn: "Calibration Standard ISO 17025",
    date: "2024-03-31",
    owner: "tech.schmidt",
    status: "closed",
  },
  {
    id: "3",
    siteId: "site-2",
    plantId: "plant-3",
    level1: "Munich Engineering Center",
    name: "Paint Quality Audit - February",
    basedOn: "Paint Quality Standard DIN 55633",
    date: "2024-02-28",
    owner: "auditor.weber",
    status: "closed",
  },
  {
    id: "4",
    siteId: "site-3",
    plantId: "plant-4",
    level1: "Hamburg Logistics Park",
    name: "Fire Safety Drill Report",
    basedOn: "Fire Safety Regulation ASR A2.2",
    date: "2024-04-15",
    owner: "safety.fischer",
    status: "closed",
  },
  {
    id: "5",
    siteId: "site-1",
    plantId: "plant-1",
    level1: "Berlin Manufacturing Hub",
    name: "Electrical Systems Inspection - March",
    basedOn: "Electrical Safety Standard DIN VDE 0105",
    date: "2024-03-20",
    owner: "inspector.mueller",
    status: "closed",
  },
];

/**
 * Snapshot data for closed protocols.
 * Topics and items follow ProtocolTopicSnapshot / ProtocolItemSnapshot entity definitions:
 *   - topics[].name       : LocalizedString (required)
 *   - topics[].items      : ProtocolItemSnapshot[] (required)
 *   - items[].name        : LocalizedString (required)
 *   - items[].creatorPublicParticipantId : string (optional)
 *   - items[].data        : Record<string, unknown> (optional, defaults to {})
 * Reports follow the Report entity definition:
 *   - reportId, language  : required
 *   - variantName, fileName, isOld, creationDate : optional
 */
export const protocolSnapshots: InternalProtocolSnapshot[] = [
  {
    protocolId: "1",
    powerplantId: "plant-1",
    protocolBriefcaseId: "BRIEF-01",
    templateName: {
      en: "Monthly Safety Inspection",
      de: "Monatliche Sicherheitsinspektion",
    },
    name: "Monthly Safety Inspection - January",
    date: 1706659200, // 2024-01-31
    time: "09:00",
    status: "closed",
    reportId: "REP-1001",
    reports: [
      {
        reportId: "REP-1001",
        variantName: "standard",
        fileName: "safety-inspection-jan-2024.pdf",
        language: "en",
        isOld: false,
        creationDate: 1706745600,
      },
      {
        reportId: "REP-1001-DE",
        variantName: "standard",
        fileName: "sicherheitsinspektion-jan-2024.pdf",
        language: "de",
        isOld: false,
        creationDate: 1706745600,
      },
    ],
    owner: "inspector.mueller",
    topics: [
      {
        name: { en: "Fire Extinguishers", de: "Feuerlöscher" },
        items: [
          {
            name: { en: "Extinguisher count verification", de: "Anzahl Feuerlöscher prüfen" },
            creatorPublicParticipantId: "participant-001",
            data: { value: 12, required: 10, status: "ok" },
          },
          {
            name: { en: "Expiry date check", de: "Ablaufdatum prüfen" },
            creatorPublicParticipantId: "participant-001",
            data: { allValid: true, nextExpiry: "2025-06", status: "ok" },
          },
        ],
      },
      {
        name: { en: "Emergency Exits", de: "Notausgänge" },
        items: [
          {
            name: { en: "Exit signage visible", de: "Notausgangsbeschilderung sichtbar" },
            creatorPublicParticipantId: "participant-002",
            data: { status: "ok", count: 6 },
          },
          {
            name: { en: "Exit routes unobstructed", de: "Fluchtwege frei" },
            creatorPublicParticipantId: "participant-002",
            data: { status: "ok", obstaclesFound: false },
          },
        ],
      },
    ],
  },
  {
    protocolId: "2",
    powerplantId: "plant-2",
    protocolBriefcaseId: "BRIEF-02",
    templateName: {
      en: "Equipment Calibration",
      de: "Gerätekalibrierung",
    },
    name: "Equipment Calibration Report - Q1",
    date: 1711843200, // 2024-03-31
    time: "14:30",
    status: "closed",
    reportId: "REP-2001",
    reports: [
      {
        reportId: "REP-2001",
        variantName: "standard",
        fileName: "equipment-calibration-q1-2024.pdf",
        language: "en",
        isOld: false,
        creationDate: 1711929600,
      },
    ],
    owner: "tech.schmidt",
    topics: [
      {
        name: { en: "Sensor Accuracy", de: "Sensorgenauigkeit" },
        items: [
          {
            name: { en: "Pressure sensor calibration", de: "Drucksensorkalibrierung" },
            creatorPublicParticipantId: "participant-004",
            data: { measuredDeviation: 0.02, allowedDeviation: 0.05, status: "ok" },
          },
          {
            name: { en: "Temperature sensor calibration", de: "Temperatursensorkalibrierung" },
            creatorPublicParticipantId: "participant-004",
            data: { measuredDeviation: 0.3, allowedDeviation: 0.5, status: "ok" },
          },
        ],
      },
    ],
  },
  {
    protocolId: "3",
    powerplantId: "plant-3",
    protocolBriefcaseId: null,
    templateName: {
      en: "Paint Quality Audit",
      de: "Lackqualitätsprüfung",
    },
    name: "Paint Quality Audit - February",
    date: 1709078400, // 2024-02-28
    time: "10:15",
    status: "closed",
    reportId: "REP-3001",
    reports: [
      {
        reportId: "REP-3001",
        variantName: "detailed",
        fileName: "paint-quality-audit-feb-2024.pdf",
        language: "en",
        isOld: false,
        creationDate: 1709164800,
      },
    ],
    owner: "auditor.weber",
    topics: [
      {
        name: { en: "Surface Coating Thickness", de: "Schichtdicke Oberflächenbeschichtung" },
        items: [
          {
            name: { en: "Panel A thickness measurement", de: "Schichtdickenmessung Panel A" },
            creatorPublicParticipantId: "participant-005",
            data: { measuredMicrons: 82, targetMicrons: 80, tolerance: 5, status: "ok" },
          },
        ],
      },
    ],
  },
  {
    protocolId: "4",
    powerplantId: "plant-4",
    protocolBriefcaseId: "BRIEF-04",
    templateName: {
      en: "Fire Safety Drill",
      de: "Brandschutzübung",
    },
    name: "Fire Safety Drill Report",
    date: 1713139200, // 2024-04-15
    time: null,
    status: "closed",
    reportId: null,
    reports: [],
    owner: "safety.fischer",
    topics: [
      {
        name: { en: "Evacuation Procedure", de: "Evakuierungsverfahren" },
        items: [
          {
            name: { en: "Evacuation time measured", de: "Evakuierungszeit gemessen" },
            creatorPublicParticipantId: "participant-006",
            data: { durationSeconds: 210, targetSeconds: 240, status: "ok" },
          },
          {
            name: { en: "All staff accounted for", de: "Alle Mitarbeiter erfasst" },
            creatorPublicParticipantId: "participant-006",
            data: { headcount: 48, expected: 48, status: "ok" },
          },
        ],
      },
      {
        name: { en: "Assembly Point", de: "Sammelplatz" },
        items: [
          {
            name: { en: "Assembly point signage visible", de: "Sammelplatzbeschilderung sichtbar" },
            creatorPublicParticipantId: "participant-006",
            data: { status: "ok" },
          },
        ],
      },
    ],
  },
  {
    protocolId: "5",
    powerplantId: "plant-1",
    protocolBriefcaseId: "BRIEF-05",
    templateName: {
      en: "Electrical Systems Inspection",
      de: "Elektrosysteminspektion",
    },
    name: "Electrical Systems Inspection - March",
    date: 1710892800, // 2024-03-20
    time: "08:00",
    status: "closed",
    reportId: "REP-5001",
    reports: [
      {
        reportId: "REP-5001",
        variantName: "standard",
        fileName: "electrical-inspection-mar-2024.pdf",
        language: "en",
        isOld: false,
        creationDate: 1710979200,
      },
    ],
    owner: "inspector.mueller",
    topics: [
      {
        name: { en: "Switchboard Inspection", de: "Schaltschrankinspektion" },
        items: [
          {
            name: { en: "Visual inspection of wiring", de: "Sichtprüfung der Verkabelung" },
            creatorPublicParticipantId: "participant-001",
            data: { status: "ok", findingsCount: 0 },
          },
          {
            name: { en: "Circuit breaker function test", de: "Funktionstest Leistungsschalter" },
            creatorPublicParticipantId: "participant-001",
            data: { status: "ok", testedCount: 12, failedCount: 0 },
          },
        ],
      },
    ],
  },
];
