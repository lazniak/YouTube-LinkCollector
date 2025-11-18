export interface Video {
  title: string;
  url: string;
}

export interface SearchOptions {
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'viewCount';
  videoDuration?: 'any' | 'long' | 'medium' | 'short';
  safeSearch?: 'moderate' | 'none' | 'strict';
}
