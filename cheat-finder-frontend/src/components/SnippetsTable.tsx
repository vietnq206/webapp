import React from 'react';
import { Box, Typography } from '@mui/material';
import { SnippetListItem } from '../types';
import './SnippetsTable.css';

interface SnippetsTableProps {
  snippets: SnippetListItem[];
}

export const SnippetsTable: React.FC<SnippetsTableProps> = ({ snippets = [] }) => {
  if (!Array.isArray(snippets)) {
    console.error('Snippets is not an array:', snippets);
    return (
      <div className="error-message">
        Invalid data format received
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="empty-message">
        No snippets available
      </div>
    );
  }

  return (
    <div className="snippets-table-container">
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="h6" fontWeight={500}>
          Snippets List ({snippets.length} items)
        </Typography>
      </Box>
      <div className="table-wrapper">
        <div className="table-header">
          <div className="header-cell snippet-id">Snippet ID</div>
          <div className="header-cell file-name">File Name</div>
        </div>
        <div className="table-body">
          {snippets.map((snippet) => (
            <div key={snippet.snippetId} className="table-row">
              <div className="cell snippet-id">{snippet.snippetId}</div>
              <div className="cell file-name">{snippet.fileName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 