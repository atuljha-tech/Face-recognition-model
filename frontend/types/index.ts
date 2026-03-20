// API Response Types
export interface HealthResponse {
  status: string;
  version: string;
  people_count: number;
  encodings_count: number;
}

export interface Person {
  id: number;
  name: string;
  created_at: string;
  encoding_count: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  person_id?: number;
  encodings_stored: number;
}

export interface RecognizeResponse {
  success: boolean;
  name: string;
  confidence: number;
  message: string;
  processing_time_ms: number;
}

export interface StatsResponse {
  people_count: number;
  encodings_count: number;
  database: string;
}