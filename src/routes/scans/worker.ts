import type { ScansSettings } from "$lib/models/settings";
import { rescan, scan, type OmittedScanResult } from "./utilities";

self.onmessage = (e) => {
  const items = e.data.items;
  const settings = e.data.settings;
  switch (e.data.task) {
    case 'scan':
      batchScan(items, settings);
      break;
    case 'rescan':
      batchRescan(items, settings);
      break;
  }
};

async function batchScan(items: OmittedScanResult[], settings: ScansSettings) {
  for await (const item of items) {
    postMessage({scanResult: {...item, status: 'in_progress'}});
    const result = await scan(item, {settings})
    .catch(() => {
			return {
				success: false,
				scanResult: item,
        message: '',
			}
		});
    if (!result || result.message?.length) {
      result.success = false;
      result.scanResult = item;
    }
    postMessage(result);
  }
}

async function batchRescan(items: OmittedScanResult[], settings: ScansSettings) {
  for await (const item of items) {
    postMessage({scanResult: {...item, status: 'in_progress'}});
    const result = await rescan(item, {settings})
    .catch(() => {
			return {
				success: false,
				scanResult: item,
        message: '',
			}
		});
    if (!result || result.message?.length) {
      result.success = false;
      result.scanResult = item;
    }
    postMessage(result);
  }
}
