import { CreateDatabaseConfig, LoadDatabaseConfig, Snippet, ServerConfig, SnippetListItem, PaginatedResponse, PaginationParams } from '../types';

let API_BASE_URL = 'http://localhost:5000';

export const api = {
  setServerConfig(config: ServerConfig) {
    API_BASE_URL = `http://${config.host}:${config.port}`;
  },

  async checkServerHealth(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Server is not responding (Status: ${response.status})`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to connect to server: ${error.message}`);
      }
      throw new Error('Failed to connect to server');
    }
  },

  async createDatabase(config: CreateDatabaseConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/createdatabase`, {
        method: 'POST',
        body: JSON.stringify({
          directory: config.sourceDirectoryPath,
          minNumberOfInstruction: config.minAmountInstructions
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  },

  async loadDatabase(config: LoadDatabaseConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/loadexistingdb`, {
        method: 'POST',
        body: config.databasePath,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // If the response is empty or just whitespace, consider it a success
      if (!text || !text.trim()) {
        return {
          success: true,
          message: 'Database loaded successfully'
        };
      }

      try {
        // Try to parse as JSON if there is content
        const data = JSON.parse(text);
        return {
          success: true,
          message: data.message || 'Database loaded successfully'
        };
      } catch {
        // If not JSON but we got a 200 OK, consider it success
        return {
          success: true,
          message: text || 'Database loaded successfully'
        };
      }
    } catch (error) {
      console.error('Error loading database:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load database'
      };
    }
  },

  async getSnippetsList(params: PaginationParams = { page: 1, pageSize: 100 }): Promise<PaginatedResponse<SnippetListItem>> {
    const startTime = performance.now();
    try {
      console.log('🚀 Starting snippets fetch...');
      
      console.log(`Fetching snippets list from: ${API_BASE_URL}/getsnippetslist`);
      const fetchStartTime = performance.now();
      const response = await fetch(`${API_BASE_URL}/getsnippetslist`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const fetchEndTime = performance.now();
      console.log(`⏱️ Network fetch took: ${(fetchEndTime - fetchStartTime).toFixed(2)}ms`);

      if (!response.ok) {
        console.error('Server response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response has JSON content type
      const contentType = response.headers.get('content-type');
      console.log('📄 Response content type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Response is not JSON, attempting to parse text response');
        const textStartTime = performance.now();
        const responseText = await response.text();
        const textEndTime = performance.now();
        console.log(`⏱️ Text extraction took: ${(textEndTime - textStartTime).toFixed(2)}ms`);
        
        try {
          // Parse the text response into an array
          const parseStartTime = performance.now();
          const parsedData = JSON.parse(responseText);
          const parseEndTime = performance.now();
          console.log(`⏱️ JSON parsing took: ${(parseEndTime - parseStartTime).toFixed(2)}ms`);
          console.log(`📊 Data size: ${responseText.length} characters, ${parsedData.length} items`);
          
          // Convert the array into the paginated format
          const formatStartTime = performance.now();
          const result = {
            items: parsedData,
            total: parsedData.length,
            page: params.page,
            pageSize: params.pageSize
          };
          const formatEndTime = performance.now();
          console.log(`⏱️ Format conversion took: ${(formatEndTime - formatStartTime).toFixed(2)}ms`);

          const totalTime = performance.now() - startTime;
          console.log(`✅ Total processing time: ${totalTime.toFixed(2)}ms`);
          return result;
        } catch (parseError) {
          console.error('Error parsing text response:', parseError);
          throw new Error('Failed to parse server response');
        }
      }

      // If we have JSON content type, use response.json()
      const jsonStartTime = performance.now();
      const data = await response.json();
      const jsonEndTime = performance.now();
      console.log(`⏱️ JSON response parsing took: ${(jsonEndTime - jsonStartTime).toFixed(2)}ms`);
      console.log(`📊 Received ${Array.isArray(data) ? data.length : 'paginated'} data`);
      
      // Handle both array and paginated response formats
      const formatStartTime = performance.now();
      let result;
      if (Array.isArray(data)) {
        result = {
          items: data,
          total: data.length,
          page: params.page,
          pageSize: params.pageSize
        };
      } else {
        result = data;
      }
      const formatEndTime = performance.now();
      console.log(`⏱️ Format conversion took: ${(formatEndTime - formatStartTime).toFixed(2)}ms`);

      const totalTime = performance.now() - startTime;
      console.log(`✅ Total processing time: ${totalTime.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const totalTime = performance.now() - startTime;
      console.error(`❌ Error after ${totalTime.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  async submitRanges(ranges: { startLine: number; endLine: number }[]): Promise<Snippet[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ranges }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting ranges:', error);
      throw error;
    }
  },

  async exportResults(): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/export`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  },

  async loadFile(filePath: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/load-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content.split('\n');
    } catch (error) {
      console.error('Error loading file:', error);
      throw error;
    }
  }
}; 