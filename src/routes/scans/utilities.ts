import type { ScanResult } from "$lib/models/scan";

export const buildScanResultObjectFromParsedRawData = (rawData: Record<string, string>): ScanResult => {
  const nameArray = rawData.name?.split(' ');
  const first_name = nameArray[0];
  const last_name = nameArray.length > 1 ? nameArray[1] : '';
  return {
    id: `${crypto.randomUUID()}`,
    date: Date.now(),
    status: 'not_started',
    details: {
      first_name,
      last_name,
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