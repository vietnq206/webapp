export interface Snippet {
  id: string;
  fileName: string;
  instructionCount: number;
  content: string;
  startLine: number;
  endLine: number;
}

export interface SnippetListItem {
  snippetId: string;
  fileName: string;
}

export interface CreateDatabaseConfig {
  sourceDirectoryPath: string;  // Directory containing source files
  minAmountInstructions: number;
}

export interface LoadDatabaseConfig {
  databasePath: string;  // Path to the existing database file
}

export interface MarkedRange {
  startLine: number;
  endLine: number;
  content: string;
}

export interface ServerConfig {
  host: string;
  port: number;
}

export interface ServerStatus {
  isConnected: boolean;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
} 