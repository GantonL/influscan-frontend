import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { analyze, createScanObject, search, updateScanObject } from "../../scans/utilities";
import { type ScanResult } from '$lib/models/scan';

export const POST: RequestHandler = async ({request, locals, fetch}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const scanData = data.get('data')?.toString();
  const response: {success: boolean, scanResult?: ScanResult} = { success: false };
  if (!userId || !scanData) { error(400); }
  const parsedScanData = JSON.parse(scanData);
  const createScanObjectRes = await createScanObject(parsedScanData, { fetch });
  if (!createScanObjectRes) {
    error(500, 'Failed to create scan object');
  }
  const searchResults = await search(parsedScanData.details, { fetch });
  if (searchResults.error) {
    return handleFailedScan(parsedScanData, response, { fetch });
  }
  const analysisResult = await analyze(parsedScanData.details.name , searchResults, { fetch });
  if (!analysisResult) {
    return handleFailedScan(parsedScanData, response, { fetch });
  }
  parsedScanData.estimation = analysisResult.estimation; 
  parsedScanData.explanation = analysisResult.explanation;
  parsedScanData.status = 'completed';
  const updateScanObjectRes = await updateScanObject(parsedScanData.id, { 
    status: parsedScanData.status, 
    estimation: parsedScanData.estimation, 
    explanation: parsedScanData.explanation 
  }, { fetch });
  response.success = !!updateScanObjectRes;
  if (!response.success) {
    error(500, 'Failed to update completed scan object');
  }
  response.scanResult = parsedScanData;
  return json(response);
}

const handleFailedScan = async (scan: ScanResult, response: {success: boolean, scanResult?: ScanResult}, options?: { fetch?: RequestEvent['fetch'] }) => {
  scan.status = 'failed';
  const updateScanObjectRes = await updateScanObject(scan.id, { status: scan.status }, options);
  response.success = !!updateScanObjectRes;
  if (!response.success) {
    error(500, 'Failed to update scan object');
  }
  return json(response);
}
