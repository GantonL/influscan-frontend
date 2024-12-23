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
  estimation: number;
  explanation: string;
  domain?: string;
  niche?: string;
  rankings?: ScanResult['rankings'];
}