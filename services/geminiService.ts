import type { Video, SearchOptions } from '../types';

// YouTube Data API v3 Interfaces
interface YouTubeChannelSearchResponse {
  items: { id: { channelId: string } }[];
}

interface YouTubeChannelsListResponse {
  items: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
}

interface YouTubePlaylistItemsListResponse {
  nextPageToken?: string;
  items: {
    snippet: {
      title: string;
      resourceId: {
        videoId: string;
      };
    };
  }[];
}

interface YouTubeSearchListResponse {
  nextPageToken?: string;
  items: {
    id: { videoId: string };
    snippet: { title: string };
  }[];
}


const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const handleYouTubeApiError = async (response: Response, contextMessage: string): Promise<never> => {
    try {
        const errorData = await response.json();
        const message = errorData?.error?.message;
        if (message) {
            const cleanMessage = message.replace(/<[^>]*>?/gm, '');
            throw new Error(cleanMessage);
        }
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
    throw new Error(contextMessage);
};


const getChannelId = async (query: string, apiKey: string): Promise<string> => {
  const channelIdRegex = /(?:youtube\.com\/(?:c\/|channel\/|user\/))?([a-zA-Z0-9_-]{24})/;
  const match = query.match(channelIdRegex);
  if (match && match[1] && match[1].startsWith('UC')) {
    return match[1];
  }

  const url = `${API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    await handleYouTubeApiError(response, 'Failed to search for YouTube channel.');
  }
  const data: YouTubeChannelSearchResponse = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel "${query}" not found.`);
  }
  return data.items[0].id.channelId;
};

const getUploadsPlaylistId = async (channelId: string, apiKey: string): Promise<string> => {
  const url = `${API_BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    await handleYouTubeApiError(response, 'Failed to get channel details.');
  }
  const data: YouTubeChannelsListResponse = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('Could not retrieve channel details.');
  }
  return data.items[0].contentDetails.relatedPlaylists.uploads;
};

/**
 * Fetches videos from a channel.
 * Strategy:
 * 1. If default order ('date') and duration ('any') are used, it scrapes the "Uploads" playlist.
 *    This is much cheaper (1 quota unit per page) and can retrieve 1000+ videos easily.
 * 2. If specific sorting (e.g., 'viewCount') or filtering (e.g., 'long') is requested,
 *    it uses the Search endpoint restricted to the channelId.
 *    This is more expensive (100 quota units per page) and often caps around 500 results.
 */
export const fetchYouTubeVideos = async (
  channelQuery: string,
  apiKey: string,
  maxResults: number = 1000,
  options: SearchOptions = {}
): Promise<Video[]> => {
  if (!apiKey) {
    throw new Error("A YouTube Data API key is required.");
  }
  
  try {
    const channelId = await getChannelId(channelQuery, apiKey);

    // Check if we need advanced filtering/sorting which requires the Search API
    const requiresSearchApi = 
      (options.order && options.order !== 'date') || 
      (options.videoDuration && options.videoDuration !== 'any');

    if (requiresSearchApi) {
      // Use Search API filtered by Channel ID
      return await internalSearch(apiKey, maxResults, { ...options, channelId });
    } else {
      // Use PlaylistItems API (cheaper/standard extraction)
      const uploadsPlaylistId = await getUploadsPlaylistId(channelId, apiKey);
      return await internalPlaylistScrape(apiKey, uploadsPlaylistId, maxResults);
    }

  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while communicating with the YouTube API.");
  }
};

const internalPlaylistScrape = async (apiKey: string, playlistId: string, maxResults: number): Promise<Video[]> => {
    let allVideos: Video[] = [];
    let nextPageToken: string | undefined = undefined;
    
    // Effectively "no limit" if maxResults is huge, but practical loop limit
    while (allVideos.length < maxResults) {
      // We request 50, but if we only need 5 more to hit max, we still fetch 50 because pagination
      // dictates the flow, we just slice the result later.
      let url = `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
      if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        await handleYouTubeApiError(response, 'Failed to fetch video playlist.');
      }
      
      const data: YouTubePlaylistItemsListResponse = await response.json();
      
      const videos = data.items
        .filter(item => item.snippet?.resourceId?.videoId)
        .map(item => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        }));

      allVideos = [...allVideos, ...videos];
      nextPageToken = data.nextPageToken;

      if (!nextPageToken) break;
    }

    return allVideos.slice(0, maxResults);
};

// Helper for internal usage by both fetchYouTubeVideos (filtered) and searchYouTubeVideos (global)
const internalSearch = async (
    apiKey: string,
    maxResults: number,
    params: SearchOptions & { channelId?: string, q?: string }
): Promise<Video[]> => {
  
  // We respect the user's maxResults. If they want "No limit" (e.g. 5000), we try to fetch it.
  // However, we set a sane technical safety cap (e.g. 5000) to prevent browser crashes, 
  // though the API will likely run out of quota or relevance depth before this.
  const effectiveMaxResults = Math.min(maxResults, 5000); 
  let allVideos: Video[] = [];
  let nextPageToken: string | undefined = undefined;
  const maxPerPage = 50;

  while (allVideos.length < effectiveMaxResults) {
    const remaining = effectiveMaxResults - allVideos.length;
    const resultsToFetch = Math.min(maxPerPage, remaining);
    // API requires maxResults to be at least 0, but practically 1-50
    const safeMaxResults = Math.max(1, Math.min(50, resultsToFetch));

    let url = `${API_BASE_URL}/search?part=snippet&type=video&maxResults=${50}&key=${apiKey}`;
    
    if (params.q) url += `&q=${encodeURIComponent(params.q)}`;
    if (params.channelId) url += `&channelId=${params.channelId}`;
    if (params.order) url += `&order=${params.order}`;
    if (params.videoDuration) url += `&videoDuration=${params.videoDuration}`;
    if (params.safeSearch) url += `&safeSearch=${params.safeSearch}`;
    
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
       // Detailed error handling can go here
       await handleYouTubeApiError(response, 'Failed to search/filter videos.');
    }
    
    const data: YouTubeSearchListResponse = await response.json();
    
    const videos = data.items
      .filter(item => item.id?.videoId)
      .map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

    allVideos = [...allVideos, ...videos];
    nextPageToken = data.nextPageToken;

    if (!nextPageToken) {
      break;
    }
  }
  
  return allVideos.slice(0, effectiveMaxResults);
};

export const searchYouTubeVideos = async (
  query: string,
  apiKey: string,
  maxResults: number,
  options: SearchOptions = {}
): Promise<Video[]> => {
  if (!apiKey) {
    throw new Error("A YouTube Data API key is required.");
  }
  if (maxResults <= 0) return [];
  
  try {
      return await internalSearch(apiKey, maxResults, { ...options, q: query });
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while searching on YouTube.");
  }
};