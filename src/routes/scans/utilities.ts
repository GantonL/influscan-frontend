import type { ScanResult } from "$lib/models/scan";

export const buildScanResultObjectFromParsedRawData = (rawData: Record<string, string>): ScanResult => {
  return {
    id: `${crypto.randomUUID()}`,
    created_at: Date.now(),
    status: 'not_started',
    details: {
      name: rawData.name,
      email: rawData.email,
      address: rawData.address,
      country: rawData.country,
    },
  }
}

export const search = async (candidateData: {name: string, email: string, address: string}): Promise<{ title: string; snippet: string; link: string}[]> => {
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