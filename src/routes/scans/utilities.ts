import type { AnalysisResult, ScanResult } from "$lib/models/scan";
import type { GoogleCustomSearchEngineResult } from "$lib/models/search";
import type { ScansSettings } from "$lib/models/settings";
import type { RequestEvent } from "./$types";

export type OmittedScanResult = Omit<ScanResult, 'user_id' | 'created_at'>; 

export const buildScanResultObjectFromParsedRawData = (rawData: Record<string, string>): Pick<ScanResult, 'id' | 'status' | 'details'> => {
  return {
    id: `${crypto.randomUUID()}`,
    status: 'not_started',
    details: {
      name: rawData.name,
      email: rawData.email,
      address: rawData.address,
      country: rawData.country,
    },
  }
}

export const scan = async (data: OmittedScanResult, options?: {fetch?: RequestEvent['fetch'], settings?: ScansSettings}): Promise<{success: boolean, scanResult?: ScanResult, message?: string}> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(data));
    if (options?.settings) {
      body.append('settings', JSON.stringify(options?.settings));
    }
    const request = options?.fetch ?? fetch;
    request('/api/scan', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}

export const rescan = async (data: OmittedScanResult, options?: {fetch?: RequestEvent['fetch'], settings?: ScansSettings}): Promise<{success: boolean, scanResult?: ScanResult, message?: string}> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(data));
    if (options?.settings) {
      body.append('settings', JSON.stringify(options?.settings));
    }
    const request = options?.fetch ?? fetch;
    request('/api/scan', {method: 'PUT', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}

export const createScanObject = async (scan: Omit<ScanResult, 'user_id' | 'created_at'>, options?: {fetch?: RequestEvent['fetch']}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(scan));
    const request = options?.fetch ?? fetch;
    request('/api/results', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(!!res);
          }, reject);
      }, reject);
  });
}

export const updateScanObject = async (id: ScanResult['id'], updateObject: Partial<Pick<ScanResult, 'details' | 'estimation' | 'explanation' | 'status' | 'domain' | 'niche' | 'rankings'>>, options?: {fetch?: RequestEvent['fetch']}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('id', id);
    body.append('updateObject', JSON.stringify(updateObject));
    const request = options?.fetch ?? fetch;
    request('/api/results', {method: 'PUT', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(!!res);
          }, reject);
      }, reject);
  });
}

export const deleteScanObject = async (ids: ScanResult['id'][], options?: {fetch?: RequestEvent['fetch']}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('ids', JSON.stringify(ids));
    const request = options?.fetch ?? fetch;
    request('/api/results', {method: 'DELETE', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(!!res);
          }, reject);
      }, reject);
  });
}

export const search = async (candidateData: ScanResult['details'], options?: {fetch?: RequestEvent['fetch']}): Promise<GoogleCustomSearchEngineResult[] & { error?: Record<string, string> }> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(candidateData));
    const request = options?.fetch ?? fetch;
    request('/api/search', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res ?? []);
          }, reject);
      }, reject);
  });
}

export const analyze = async (candidateDetails: string, searchResults: Pick<GoogleCustomSearchEngineResult, 'title' | 'snippet' | 'link'>[], options?: {fetch?: RequestEvent['fetch'], settings?: ScansSettings}): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('details', JSON.stringify(candidateDetails));
    body.append('results', JSON.stringify(searchResults));
    if (options?.settings) {
      body.append('settings', JSON.stringify(options.settings));
    }
    const request = options?.fetch ?? fetch;
    request('/api/analyze', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}

export const getScansResults = async (options?: { fetch?: RequestEvent['fetch']; filters?: string; sortBy?: string; pageSize?: number; offset?: number}): Promise<OmittedScanResult[]> => {
  return new Promise((resolve, reject) => {
    const request = options?.fetch ?? fetch;
    let searchParams = '';
    if (options?.filters) {
      searchParams = `filters=${options.filters}`;
    }
    if (options?.sortBy) {
      searchParams = searchParams.concat(`&sortBy=${options.sortBy}`)
    }
    if (options?.pageSize) {
      searchParams = searchParams.concat(`&pageSize=${options.pageSize}`)
    }
    if (options?.offset) {
      searchParams = searchParams.concat(`&offset=${options.offset}`)
    }
    request(`/api/results?${searchParams}`, {method: 'GET'})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}

export const getScansResultsCount = async (options?: { fetch?: RequestEvent['fetch']; filters?: string;}): Promise<number> => {
  return new Promise((resolve, reject) => {
    const request = options?.fetch ?? fetch;
    let searchParams = '';
    if (options?.filters) {
      searchParams = `filters=${options.filters}`;
    }
    request(`/api/results/count?${searchParams}`, {method: 'GET'})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}