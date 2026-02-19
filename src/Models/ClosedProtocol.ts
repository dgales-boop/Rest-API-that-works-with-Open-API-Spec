/**
 * Public ClosedProtocol — matches the OpenAPI ClosedProtocol schema.
 */
export interface ClosedProtocol {
  id: string;
  plantId: string;
  name: string;
  template?: string;
  date: string;
  owner?: string;
  status: "closed";
}
