import type { Site } from "../Models/Site";
import type { Plant } from "../Models/Plant";
import type { ClosedProtocol } from "../Models/ClosedProtocol";
import type { ProtocolSnapshot } from "../Models/ProtocolSnapshot";

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

export const closedProtocols: ClosedProtocol[] = [
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
 * Snapshot data for closed protocols, matching the OpenAPI ProtocolSnapshot schema.
 * Each snapshot is keyed by the corresponding ClosedProtocol id.
 */
export const protocolSnapshots: ProtocolSnapshot[] = [
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
    reports: [],
    owner: "inspector.mueller",
    topics: [
      {
        topicId: "topic-1",
        title: { en: "Fire Extinguishers", de: "Feuerlöscher" },
        result: "pass",
      },
      {
        topicId: "topic-2",
        title: { en: "Emergency Exits", de: "Notausgänge" },
        result: "pass",
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
    reports: [],
    owner: "tech.schmidt",
    topics: [
      {
        topicId: "topic-3",
        title: { en: "Sensor Accuracy", de: "Sensorgenauigkeit" },
        result: "pass",
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
    reports: [],
    owner: "auditor.weber",
    topics: [],
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
        topicId: "topic-4",
        title: { en: "Evacuation Time", de: "Evakuierungszeit" },
        result: "acceptable",
      },
      {
        topicId: "topic-5",
        title: { en: "Assembly Point", de: "Sammelplatz" },
        result: "pass",
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
    reports: [],
    owner: "inspector.mueller",
    topics: [],
  },
];
