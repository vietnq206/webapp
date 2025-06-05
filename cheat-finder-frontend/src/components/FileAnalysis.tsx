import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { SnippetListItem } from '../types';
import { api } from '../services/api';
import { FastTable } from './FastTable';
import './SnippetsTable.css';

interface FileAnalysisProps {
  onBack: () => void;
  onExport: () => void;
}

export const FileAnalysis: React.FC<FileAnalysisProps> = ({ onBack, onExport }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SnippetListItem[]>([]);
  const tableRef = useRef<FastTable | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const pendingData = useRef<SnippetListItem[] | null>(null);

  // Initialize table
  useEffect(() => {
    const initTable = () => {
      try {
        if (!containerRef.current) {
          throw new Error('Container ref not available');
        }

        console.log('FileAnalysis: Initializing table...');
        const table = new FastTable();
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(table.getContainer());
        tableRef.current = table;
        isInitialized.current = true;
        console.log('FileAnalysis: Table initialized successfully');

        // If we have pending data, set it now
        if (pendingData.current) {
          console.log('FileAnalysis: Setting pending data after initialization');
          table.setData(pendingData.current);
          pendingData.current = null;
        }
      } catch (err) {
        console.error('Error initializing table:', err);
        setError('Failed to initialize table component');
        isInitialized.current = false;
      }
    };

    // Initialize immediately
    initTable();

    return () => {
      console.log('FileAnalysis: Cleaning up table');
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      tableRef.current = null;
      isInitialized.current = false;
      pendingData.current = null;
    };
  }, []);

  // Handle data setting
  const setTableData = (items: SnippetListItem[]) => {
    console.log('FileAnalysis: Attempting to set table data', {
      isInitialized: isInitialized.current,
      hasTableRef: !!tableRef.current,
      itemCount: items.length
    });

    if (!isInitialized.current || !tableRef.current) {
      console.log('FileAnalysis: Table not ready, storing data for later');
      pendingData.current = items;
      return;
    }

    try {
      console.log('FileAnalysis: Setting data to initialized table');
      tableRef.current.setData(items);
      console.log('FileAnalysis: Data set successfully');
    } catch (err) {
      console.error('Error setting table data:', err);
      setError('Failed to display data in table');
    }
  };

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchSnippets = async () => {
      const fetchStartTime = performance.now();
      try {
        setLoading(true);
        console.log('FileAnalysis: Fetching data...');
        const response = await api.getSnippetsList();
        
        if (!isMounted) return;

        if (!response || !response.items) {
          throw new Error('Invalid response structure from server');
        }

        const items = response.items;
        console.log(`FileAnalysis: Received ${items.length} items`);
        setData(items);
        setTableData(items);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching snippets:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch snippets');
      } finally {
        if (isMounted) {
          setLoading(false);
          const totalTime = performance.now() - fetchStartTime;
          console.log(`✅ Total update time: ${totalTime.toFixed(2)}ms`);
        }
      }
    };

    fetchSnippets();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    return (
      <>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {loading ? 'Loading...' : `Total items: ${data.length}`}
          </Typography>
        </Box>
        <div 
          ref={containerRef} 
          className="table-container"
          style={{ 
            width: '100%', 
            minHeight: '400px',
            overflow: 'hidden'
          }} 
        />
      </>
    );
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="500">
            File Analysis
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{ textTransform: 'none' }}
            >
              Back to Database Setup
            </Button>
            <Button
              variant="contained"
              onClick={onExport}
              sx={{ textTransform: 'none' }}
            >
              Export Results
            </Button>
          </Box>
        </Box>

        {renderContent()}
      </Paper>
    </Container>
  );
}; 