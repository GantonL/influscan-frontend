import type { ScanStatus } from "$lib/types/scan-status";

export interface ScanResult {
  id: string;
  created_at: number;
  status: ScanStatus;
  details: ScanResultDetails;
  user_id: string;
  estimation?: number;
  explanation?: string;
  domain?: string;
  niche?: string;
  rankings?: ScanResultRanking[];
  images?: string[];
  sources?: string[];
}

export interface ScanResultRanking {
  platform: string;
  followers: number;
} 

export interface ScanResultDetails {
  name: string;
  email?: string;
  address?: string;
  country?: string;
  extras?: string;
}

export interface AnalysisResult {
  estimation: ScanResult['estimation'];
  explanation: ScanResult['explanation'];
  domain?: ScanResult['domain'];
  niche?: ScanResult['niche'];
  rankings?: ScanResult['rankings'];
  images?: ScanResult['images'];
  sources?: ScanResult['sources'];
}