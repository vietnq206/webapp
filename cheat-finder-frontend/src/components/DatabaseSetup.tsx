import React, { useState } from 'react';
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Paper,
  Box,
  Stack,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StorageIcon from '@mui/icons-material/Storage';
import { CreateDatabaseConfig, LoadDatabaseConfig } from '../types';

interface DatabaseSetupProps {
  onSubmit: (config: CreateDatabaseConfig | LoadDatabaseConfig) => void;
}

export const DatabaseSetup: React.FC<DatabaseSetupProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<'create' | 'load'>('create');
  const [path, setPath] = useState('');
  const [minAmountInstructions, setMinAmountInstructions] = useState(30);

  const handleSubmit = () => {
    if (mode === 'create') {
      onSubmit({
        sourceDirectoryPath: path,
        minAmountInstructions,
      });
    } else {
      onSubmit({
        databasePath: path,
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <StorageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="500">
              Database Setup
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your database settings to start analyzing code
            </Typography>
          </Box>

          <Divider />

          {/* Mode Selection */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>Select Operation Mode</FormLabel>
            <RadioGroup
              value={mode}
              onChange={(e) => setMode(e.target.value as 'create' | 'load')}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                justifyContent: 'center',
              }}
            >
              <Paper 
                elevation={mode === 'create' ? 3 : 1}
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: theme => `1px solid ${mode === 'create' ? theme.palette.primary.main : theme.palette.divider}`,
                  flex: 1,
                  maxWidth: 250,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => setMode('create')}
              >
                <FormControlLabel
                  value="create"
                  control={<Radio />}
                  label={
                    <Typography variant="subtitle1" fontWeight={500}>
                      Create New Database
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Start fresh with a new database for your code analysis
                </Typography>
              </Paper>

              <Paper 
                elevation={mode === 'load' ? 3 : 1}
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: theme => `1px solid ${mode === 'load' ? theme.palette.primary.main : theme.palette.divider}`,
                  flex: 1,
                  maxWidth: 250,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => setMode('load')}
              >
                <FormControlLabel
                  value="load"
                  control={<Radio />}
                  label={
                    <Typography variant="subtitle1" fontWeight={500}>
                      Load Existing Database
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Continue working with a previously created database
                </Typography>
              </Paper>
            </RadioGroup>
          </FormControl>

          {/* Path Input */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                {mode === 'create' ? 'Source Directory Path' : 'Database Path'}
              </Typography>
              <Tooltip title={mode === 'create' 
                ? "Enter the directory path containing the source files to analyze" 
                : "Enter the path to your existing database file"
              }>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={
                mode === 'create'
                  ? 'e.g., C:\\Users\\YourName\\Documents\\SourceCode'
                  : 'e.g., C:\\Users\\YourName\\Documents\\mydb.db'
              }
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {mode === 'create'
                ? 'The directory containing your source code files to analyze'
                : 'The path to your existing database file'}
            </Typography>
          </Box>

          {/* Minimum Instructions - Only shown in create mode */}
          {mode === 'create' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Minimum Amount of Instructions
                </Typography>
                <Tooltip title="Minimum number of instructions required for code analysis">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                type="number"
                value={minAmountInstructions}
                onChange={(e) => setMinAmountInstructions(Number(e.target.value))}
                inputProps={{ min: 25, max: 1000 }}
                fullWidth
                variant="outlined"
                helperText="Enter a value between 25 and 1000 (default: 30)"
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!path}
            size="large"
            sx={{ 
              mt: 2,
              height: 48,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {mode === 'create' ? 'Create Database' : 'Load Database'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}; 