import axios from 'axios';

export const mcpClient = axios.create({
  baseURL: process.env.MICROSOFT_COPILOT_WEBHOOK_URL,
  headers: {
    Authorization: `Bearer ${process.env.MCP_WEBHOOK_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export { mcpClient as client };
