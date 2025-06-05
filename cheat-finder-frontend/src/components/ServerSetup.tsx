import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ServerConfig } from '../types';

interface ServerSetupProps {
  onConnect: (config: ServerConfig) => Promise<void>;
}

export const ServerSetup: React.FC<ServerSetupProps> = ({ onConnect }) => {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5000');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!host.trim() || !port.trim()) {
      setError('Host and port are required');
      return;
    }

    const portNumber = parseInt(port);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      setError('Port must be a number between 1 and 65535');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConnect({ host, port: portNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Connect to Server
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Please enter the C++ backend server details
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="e.g., localhost or 127.0.0.1"
            disabled={isLoading}
          />

          <TextField
            label="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            type="number"
            placeholder="e.g., 5000"
            inputProps={{ min: 1, max: 65535 }}
            disabled={isLoading}
          />

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ height: 48 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Connect to Server'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 