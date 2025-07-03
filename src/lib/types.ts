export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  searchResults?: SearchResult[];
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelySearchResponse {
  results: SearchResult[];
  query: string;
}

export interface LLMResponse {
  content: string;
  sources?: SearchResult[];
}
