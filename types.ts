export enum ThreatSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum ThreatStatus {
  ACTIVE = 'Active',
  QUARANTINED = 'Quarantined',
  RESOLVED = 'Resolved',
  ANALYZING = 'Analyzing',
}

export interface Threat {
  id: string;
  name: string;
  type: string; // Ransomware, Trojan, Spyware, etc.
  severity: ThreatSeverity;
  status: ThreatStatus;
  detectedAt: string;
  path: string;
  hash: string;
  description?: string;
  analysis?: string;
}

export interface SystemStats {
  cpuLoad: number;
  memoryUsage: number;
  networkTraffic: number;
  lastScan: string;
  protectedFiles: number;
  threatsBlocked: number;
}

export enum ScanType {
  QUICK = 'Quick Scan',
  FULL = 'Full System Scan',
  CUSTOM = 'Custom Scan',
}

export enum View {
  DASHBOARD = 'dashboard',
  SCAN = 'scan',
  THREATS = 'threats',
  SETTINGS = 'settings',
  INTELLIGENCE = 'intelligence',
}
