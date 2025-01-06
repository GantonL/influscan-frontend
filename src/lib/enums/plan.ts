export enum Plan {
  None = 'none',
  Lite = 'lite',
  Plus = 'plus',
  Pro = 'pro',
}

export enum PlanFeatures {
  LiteScans = 'Up to 250 scans per month',
  PlusScans = 'Up to 1000 scans per month',
  ProScans = 'Up to 10000 scans per month',
  CSVUpload = 'CSV upload',
  StrictCSVParser = 'Strict CSV parser',
  DynamicCSVParser = 'Dynamic CSV parser',
  APIKey = 'API key',
  Integrations = 'Integrations'
}