import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { analyze, createScanObject, search, updateScanObject } from "../../scans/utilities";
import { type ScanResult } from '$lib/models/scan';
import { totalMonthlyScansCount, updateTotalMonthlyScanCount as updateTotalMonthlyScanCount } from "$lib/server/database/scans";
import { planMonthlyLimit } from "$lib/server/database/users";
import type { ScansSettings } from "$lib/models/settings";

export const POST: RequestHandler = async ({request, locals, fetch}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const scanData = data.get('data')?.toString();
  const response: {success: boolean, scanResult?: ScanResult} = { success: false };
  if (!userId || !scanData) { error(400); }
  const parsedScanData = JSON.parse(scanData);
  const isAllowed = await isAllowedToScan(userId);
  if (!isAllowed) {
    error(401, 'Scan limit reached');
  }
  const createScanObjectRes = await createScanObject(parsedScanData, { fetch });
  if (!createScanObjectRes) {
    error(500, 'Failed to create scan object');
  }
  const scanSettings = data.get('settings')?.toString();
  let settings: ScansSettings | undefined = undefined;
  if (scanSettings) {
    settings = JSON.parse(scanSettings);
  }
  const { success, scanResult } = await searchAndAnalyze(userId, parsedScanData, response, { fetch, settings });
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
  const isAllowed = await isAllowedToScan(userId);
  if (!isAllowed) {
    error(401, 'Scan limit reached');
  }
  const scanSettings = data.get('settings')?.toString();
  let settings: ScansSettings | undefined = undefined;
  if (scanSettings) {
    settings = JSON.parse(scanSettings);
  }
  const { success, scanResult } = await searchAndAnalyze(userId, parsedScanData, response, { fetch, settings });
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

const searchAndAnalyze = async (user_id: string, scan: ScanResult, response: {success: boolean, scanResult?: ScanResult}, options?: { fetch?: RequestEvent['fetch'], settings?: ScansSettings }): Promise<{success: boolean, scanResult?: ScanResult}> => {
  const searchResults = await search(scan.details, options);
  if (searchResults.error) {
    return handleFailedScan(scan, response, options);
  }
  const analysisResult = await analyze(scan.details.name , searchResults, options);
  if (!analysisResult) {
    return handleFailedScan(scan, response, options);
  }
  await updateTotalMonthlyScanCount(user_id);
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


const isAllowedToScan = async (user_id: string): Promise<boolean> => {
  const planLimit = await planMonthlyLimit(user_id).catch(() => 0);
  if (!planLimit) { return false; }
  const monthlyScansCount = await totalMonthlyScansCount(user_id).catch(() => 0);
  return planLimit > (monthlyScansCount ?? 0);
}