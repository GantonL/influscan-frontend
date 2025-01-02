import { rescan, scan, type OmittedScanResult } from "./utilities";

self.onmessage = (e) => {
  switch (e.data.task) {
    case 'scan':
      batchScan(e.data.items);
      break;
    case 'rescan':
      batchRescan(e.data.items);
      break;
  }
};

async function batchScan(items: OmittedScanResult[]) {
  for await (const item of items) {
    postMessage({scanResult: {...item, status: 'in_progress'}});
    const result = await scan(item)
    .catch(() => {
			return {
				success: false,
				scanResult: item,
			}
		});
    postMessage(result);
  }
}

async function batchRescan(items: OmittedScanResult[]) {
  for await (const item of items) {
    postMessage({scanResult: {...item, status: 'in_progress'}});
    const result = await rescan(item)
    .catch(() => {
			return {
				success: false,
				scanResult: item,
			}
		});
    postMessage(result);
  }
}
