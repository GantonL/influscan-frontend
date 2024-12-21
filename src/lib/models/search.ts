export interface GoogleCustomSearchEngineResult {
  title: string;
  snippet: string;
  link: string;
  pagemap?: {
    cse_thumbnail?: { src: string }[];
  };
}