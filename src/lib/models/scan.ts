import type { ScanStatus } from "$lib/types/scan-status";

export interface ScanResult {
  id: string;
  created_at: number;
  status: ScanStatus;
  details: ScanResultDetails;
  user_id: string;
  estimation?: number;
  explanation?: string;
}

export interface ScanResultDetails {
  name: string;
  email?: string;
  address?: string;
  country?: string;
  extras?: string;
}
