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
  const { success, scanResult } = await searchAndAnalyze(parsedScanData, response, { fetch });
  response.success = success;
  response.scanResult = scanResult;
  return json(response);
}

export const PUT: RequestHandler = async ({request, locals, fetch}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const scanData = data.get('data')?.toString();
  const response: {success: boolean, scanResult?: ScanResult} = { success: false };
  if (!userId || !scanData) { error(400); }
  const parsedScanData = JSON.parse(scanData);
  const { success, scanResult } = await searchAndAnalyze(parsedScanData, response, { fetch });
  response.success = success;
  response.scanResult = scanResult;
  return json(response);
}



const handleFailedScan = async (scan: ScanResult, response: {success: boolean, scanResult?: ScanResult}, options?: { fetch?: RequestEvent['fetch'] }) => {
  scan.status = 'failed';
  const updateScanObjectRes = await updateScanObject(scan.id, { status: scan.status }, options);
  response.success = !!updateScanObjectRes;
  if (!response.success) {
    error(500, 'Failed to update scan object');
  }
  return response;
}

const searchAndAnalyze = async (scan: ScanResult, response: {success: boolean, scanResult?: ScanResult}, options?: { fetch?: RequestEvent['fetch'] }): Promise<{success: boolean, scanResult?: ScanResult}> => {
  const searchResults = await search(scan.details, options);
  if (searchResults.error) {
    return handleFailedScan(scan, response, options);
  }
  const analysisResult = await analyze(scan.details.name , searchResults, options);
  if (!analysisResult) {
    return handleFailedScan(scan, response, options);
  }
  scan.estimation = analysisResult.estimation; 
  scan.explanation = analysisResult.explanation;
  scan.domain = analysisResult.domain;
  scan.niche = analysisResult.niche;
  scan.rankings = analysisResult.rankings;
  scan.images = analysisResult.images;
  scan.sources = analysisResult.sources;
  scan.status = 'completed'; 
  const updateScanObjectRes = await updateScanObject(scan.id, { 
    status: scan.status, 
    ...analysisResult,
  }, options);
  response.success = !!updateScanObjectRes;
  if (!response.success) {
    error(500, 'Failed to update completed scan object');
  }
  response.scanResult = scan;
  return response;
}