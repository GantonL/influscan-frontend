import type { ScanResult } from "$lib/models/scan";

export const buildScanResultObjectFromParsedRawData = (rawData: Record<string, string>): Omit<ScanResult, 'user_id' | 'created_at'> => {
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


export const createScanObject = async (scan: Omit<ScanResult, 'user_id' | 'created_at'>): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(scan));
    fetch('/api/scans', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(!!res);
          }, reject);
      }, reject);
  });
}

export const updateScanObject = async (id: ScanResult['id'], updateObject: Partial<Pick<ScanResult, 'details' | 'estimation' | 'explanation' | 'status'>>): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('id', id);
    body.append('updateObject', JSON.stringify(updateObject));
    fetch('/api/scans', {method: 'PUT', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(!!res);
          }, reject);
      }, reject);
  });
}

export const search = async (candidateData: ScanResult['details']): Promise<{ title: string; snippet: string; link: string}[] & { error?: Record<string, string> }> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('data', JSON.stringify(candidateData));
    fetch('/api/search', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res ?? []);
          }, reject);
      }, reject);
  });
}

export const analyze = async (candidateDetails: string, searchResults: { title: string; snippet: string; link: string}[]): Promise<{estimation: number;  explanation: string}> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('details', JSON.stringify(candidateDetails));
    body.append('results', JSON.stringify(searchResults));
    fetch('/api/analyze', {method: 'POST', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}