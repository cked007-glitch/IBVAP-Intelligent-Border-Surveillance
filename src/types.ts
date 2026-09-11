export type ViewMode = 
  | 'overview'
  | 'live-surveillance'
  | 'camera-network'
  | 'ai-analytics'
  | 'human-detection'
  | 'vehicle-detection'
  | 'face-detection'
  | 'anpr'
  | 'virtual-fence'
  | 'suspicious-activity'
  | 'night-movement'
  | 'alerts'
  | 'incident-log'
  | 'patrol-management'
  | 'reports'
  | 'system-health'
  | 'settings';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AlertItem {
  id: string;
  title: string;
  eventType: string;
  severity: AlertSeverity;
  camera: string;
  location: string;
  timestamp: string;
  timeAgo: string;
  confidence: number;
  riskScore: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  trackingId?: string;
  description: string;
  snapshotUrl?: string;
}

export interface CameraFeedInfo {
  id: string;
  name: string;
  sector: string;
  location: string;
  type: 'PTZ' | 'Fixed' | 'Thermal' | 'ANPR Dedicated';
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  fps: number;
  resolution: string;
  aiProcessing: boolean;
  latencyMs: number;
  lastEvent: string;
  sceneType: 'road' | 'checkpoint' | 'bop' | 'fence' | 'terrain' | 'gate' | 'night';
  detectionsCount: number;
  ipAddress: string;
}

export interface DetectedEntity {
  id: string;
  type: 'PERSON' | 'VEHICLE' | 'FACE' | 'PLATE' | 'ANIMAL';
  label: string;
  subType?: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number }; // percentages 0-100
  direction?: string;
  velocity?: string;
  status?: string;
  color?: string;
  meta?: Record<string, string>;
}

export interface AnprRecord {
  id: string;
  plateNumber: string;
  vehicleType: 'Car' | 'SUV' | 'Truck' | 'Bus' | 'Motorcycle' | 'Unknown';
  confidence: number;
  camera: string;
  location: string;
  timestamp: string;
  status: 'FLAGGED' | 'AUTHORIZED' | 'UNKNOWN' | 'SUSPICIOUS';
  ownerNote?: string;
}

export interface FaceDetectionRecord {
  id: string;
  personId: string;
  name: string;
  status: 'MATCH FOUND' | 'UNKNOWN' | 'WATCHLIST' | 'AUTHORIZED PERSONNEL';
  confidence: number;
  camera: string;
  location: string;
  timestamp: string;
  clearanceLevel: string;
  avatarSeed: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  eventType: string;
  severity: AlertSeverity;
  camera: string;
  location: string;
  timestamp: string;
  confidence: number;
  trackingId: string;
  responseStatus: 'RESPONDING' | 'RESOLVED' | 'UNDER REVIEW' | 'ESCALATED';
  operatorNote: string;
  dispatchUnits?: string[];
}

export interface VirtualFenceZone {
  id: string;
  name: string;
  status: 'ACTIVE' | 'BREACH DETECTED' | 'STANDBY' | 'CALIBRATING';
  camera: string;
  breachCountToday: number;
  perimeterLengthMeters: number;
  sensitivity: number;
  coordinates: { x: number; y: number }[];
}

export interface SuspiciousActivityItem {
  id: string;
  type: 'Loitering' | 'Unauthorized Entry' | 'Unusual Movement' | 'Crowd Formation' | 'Abandoned Object' | 'Rapid Movement' | 'Restricted-Zone Activity';
  camera: string;
  location: string;
  timestamp: string;
  confidence: number;
  riskScore: number;
  targetId: string;
  status: 'OPEN' | 'INVESTIGATING' | 'DISMISSED';
  details: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description?: string;
  timeActive?: string;
}

export interface IncidentLogItem {
  id: string;
  dateTime: string;
  sectorCamera: string;
  eventType: string;
  objectsDetected: string;
  confidence: number;
  actionTaken: string;
  status: string;
}

export interface PatrolUnit {
  id: string;
  name: string;
  sector: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'EN ROUTE' | 'ENGAGED';
  personnelCount: number;
  assignedIncident?: string;
  vehicleId: string;
}
