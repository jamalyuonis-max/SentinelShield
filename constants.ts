import { Threat, ThreatSeverity, ThreatStatus, SystemStats } from './types';
import { Shield, Activity, Lock, Smartphone, Server, Cpu } from 'lucide-react';

export const MOCK_THREATS: Threat[] = [
  {
    id: 't-1001',
    name: 'WannaCry.X',
    type: 'Ransomware',
    severity: ThreatSeverity.CRITICAL,
    status: ThreatStatus.QUARANTINED,
    detectedAt: '2023-10-27T14:30:00Z',
    path: 'C:\\Windows\\System32\\svchost_fake.exe',
    hash: 'a1b2c3d4e5f67890abcdef1234567890',
  },
  {
    id: 't-1002',
    name: 'Emotet.Loader',
    type: 'Trojan',
    severity: ThreatSeverity.HIGH,
    status: ThreatStatus.RESOLVED,
    detectedAt: '2023-10-26T09:15:00Z',
    path: 'C:\\Users\\Admin\\Downloads\\invoice_pdf.exe',
    hash: 'f6e5d4c3b2a10987654321fedcba0987',
  },
  {
    id: 't-1003',
    name: 'AdWare.Generic',
    type: 'Adware',
    severity: ThreatSeverity.LOW,
    status: ThreatStatus.ACTIVE,
    detectedAt: '2023-10-27T16:45:00Z',
    path: 'C:\\Program Files\\BrowserToolbar\\toolbar.dll',
    hash: '1234567890abcdef1234567890abcdef',
  },
  {
    id: 't-1004',
    name: 'Miner.XMR',
    type: 'Cryptojacker',
    severity: ThreatSeverity.MEDIUM,
    status: ThreatStatus.QUARANTINED,
    detectedAt: '2023-10-25T11:20:00Z',
    path: 'C:\\Temp\\worker.exe',
    hash: '0987654321fedcba0987654321fedcba',
  },
];

export const INITIAL_STATS: SystemStats = {
  cpuLoad: 12,
  memoryUsage: 45,
  networkTraffic: 150, // Kbps
  lastScan: '2 hours ago',
  protectedFiles: 1245098,
  threatsBlocked: 342,
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'scan', label: 'Scan Center', icon: Activity },
  { id: 'threats', label: 'Threats & Quarantine', icon: Lock },
  { id: 'intelligence', label: 'AI Intelligence', icon: Cpu },
  { id: 'settings', label: 'Policy Settings', icon: Server },
];
