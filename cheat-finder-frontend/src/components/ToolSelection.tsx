import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stack,
  Tooltip,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BugReportIcon from '@mui/icons-material/BugReport';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';

interface ToolSelectionProps {
  onToolSelect: (tool: string) => void;
}

export const ToolSelection: React.FC<ToolSelectionProps> = ({ onToolSelect }) => {
  const tools = [
    {
      id: 'escalation-analysis',
      name: 'Escalation Analysis',
      description: 'Analyze code for potential privilege escalation patterns',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      available: true,
    },
    {
      id: 'vulnerability-scan',
      name: 'Vulnerability Scanner',
      description: 'Scan code for common security vulnerabilities',
      icon: <BugReportIcon sx={{ fontSize: 40 }} />,
      available: false,
    },
    {
      id: 'code-similarity',
      name: 'Code Similarity',
      description: 'Find similar code patterns across your codebase',
      icon: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
      available: false,
    },
    {
      id: 'behavior-analysis',
      name: 'Behavior Analysis',
      description: 'Analyze runtime behavior patterns',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      available: false,
    },
  ];

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight="500">
              Select Analysis Tool
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose the type of analysis you want to perform
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {tools.map((tool) => (
              <Box 
                key={tool.id}
                sx={{ 
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: '280px',
                }}
              >
                <Tooltip 
                  title={!tool.available ? "Coming soon" : ""}
                  placement="top"
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      cursor: tool.available ? 'pointer' : 'default',
                      opacity: tool.available ? 1 : 0.7,
                      transition: 'all 0.2s ease-in-out',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': tool.available ? {
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                        boxShadow: 3,
                      } : {},
                    }}
                    onClick={() => tool.available && onToolSelect(tool.id)}
                  >
                    <Stack spacing={2} alignItems="center">
                      <Box sx={{ 
                        color: tool.available ? 'primary.main' : 'text.disabled',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {tool.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        align="center"
                        color={tool.available ? 'text.primary' : 'text.disabled'}
                      >
                        {tool.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        align="center"
                        color={tool.available ? 'text.secondary' : 'text.disabled'}
                      >
                        {tool.description}
                      </Typography>
                      {!tool.available && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.disabled',
                            bgcolor: 'action.hover',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          Coming Soon
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}; 