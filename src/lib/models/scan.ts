import type { ScanStatus } from "$lib/types/scan-status";

export interface ScanResult {
  id: string;
  created_at: number;
  status: ScanStatus;
  details: ScanResultDetails;
  estimation?: number;
  explanation?: string;
}

export interface ScanResultDetails {
  first_name: string;
  last_name: string;
  address?: string;
  country?: string;
  extras?: string;  
}
