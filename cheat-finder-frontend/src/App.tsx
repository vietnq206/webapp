import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Alert, Snackbar } from '@mui/material';
import { DatabaseSetup } from './components/DatabaseSetup';
import { FileAnalysis } from './components/FileAnalysis';
import { ServerSetup } from './components/ServerSetup';
import { ToolSelection } from './components/ToolSelection';
import { CreateDatabaseConfig, LoadDatabaseConfig, ServerConfig } from './types';
import { api } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type AppState = 'server-setup' | 'tool-selection' | 'database-setup' | 'file-analysis';

const HEALTH_CHECK_INTERVAL = 1000; // Check every 1 second

function App() {
  const [currentState, setCurrentState] = useState<AppState>('server-setup');
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const checkServerHealth = useCallback(async () => {
    if (currentState === 'server-setup') {
      return; // Don't check health before initial connection
    }

    try {
      await api.checkServerHealth();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError('Lost connection to server. Please check your connection.');
      setCurrentState('server-setup');
    }
  }, [currentState]);

  // Set up periodic health check
  useEffect(() => {
    if (currentState === 'server-setup') {
      return; // Don't start health checks until connected
    }

    const intervalId = setInterval(checkServerHealth, HEALTH_CHECK_INTERVAL);

    // Initial check
    checkServerHealth();

    return () => {
      clearInterval(intervalId);
    };
  }, [checkServerHealth, currentState]);

  const handleServerConnect = async (config: ServerConfig) => {
    try {
      api.setServerConfig(config);
      await api.checkServerHealth();
      setIsConnected(true);
      setCurrentState('tool-selection');
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    }
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setCurrentState('database-setup');
  };

  const handleDatabaseSetup = async (config: CreateDatabaseConfig | LoadDatabaseConfig) => {
    try {
      let result;
      if ('sourceDirectoryPath' in config) {
        // This is CreateDatabaseConfig
        result = await api.createDatabase(config);
      } else {
        // This is LoadDatabaseConfig
        result = await api.loadDatabase(config);
        console.log('Database loaded successfully:', result);
      }

      if (result.success) {
        // Move to file analysis page after successful database operation
        setCurrentState('file-analysis');
      } else {
        setError(result.message || 'Failed to setup database');
      }
    } catch (err) {
      console.error('Database setup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while setting up the database');
    }
  };

  const handleBack = () => {
    setCurrentState('database-setup');
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportResults();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analysis-results.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during export');
    }
  };

  const renderCurrentStep = () => {
    switch (currentState) {
      case 'server-setup':
        return <ServerSetup onConnect={handleServerConnect} />;
      case 'tool-selection':
        return <ToolSelection onToolSelect={handleToolSelect} />;
      case 'database-setup':
        return <DatabaseSetup onSubmit={handleDatabaseSetup} />;
      case 'file-analysis':
        return <FileAnalysis onBack={handleBack} onExport={handleExport} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderCurrentStep()}
      <Snackbar
        open={!!error}
        autoHideDuration={error?.includes('Lost connection') ? null : 6000}
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity={error?.includes('Lost connection') ? 'warning' : 'error'}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;

