import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-app.vercel.app/api' 
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Agent API endpoints
export const agentAPI = {
  // Get all agents
  getAgents: () => api.get('/agents'),
  
  // Get agent by ID
  getAgent: (id) => api.get(`/agents/${id}`),
  
  // Create new agent
  createAgent: (agentData) => api.post('/agents', agentData),
  
  // Update agent
  updateAgent: (id, agentData) => api.put(`/agents/${id}`, agentData),
  
  // Delete agent
  deleteAgent: (id) => api.delete(`/agents/${id}`),
  
  // Execute agent
  executeAgent: (id, input) => api.post(`/agents/${id}/execute`, { input }),
  
  // Get agent execution history
  getAgentHistory: (id) => api.get(`/agents/${id}/history`),
  
  // Clone agent
  cloneAgent: (id) => api.post(`/agents/${id}/clone`),
};

// Workflow API endpoints
export const workflowAPI = {
  // Get all workflows
  getWorkflows: () => api.get('/workflows'),
  
  // Get workflow by ID
  getWorkflow: (id) => api.get(`/workflows/${id}`),
  
  // Create new workflow
  createWorkflow: (workflowData) => api.post('/workflows', workflowData),
  
  // Update workflow
  updateWorkflow: (id, workflowData) => api.put(`/workflows/${id}`, workflowData),
  
  // Delete workflow
  deleteWorkflow: (id) => api.delete(`/workflows/${id}`),
  
  // Execute workflow
  executeWorkflow: (id, input) => api.post(`/workflows/${id}/execute`, { input }),
  
  // Get workflow execution history
  getWorkflowHistory: (id) => api.get(`/workflows/${id}/history`),
};

// Tools API endpoints
export const toolsAPI = {
  // Get available tools
  getTools: () => api.get('/tools'),
  
  // Get tool by ID
  getTool: (id) => api.get(`/tools/${id}`),
  
  // Test tool connection
  testTool: (toolData) => api.post('/tools/test', toolData),
  
  // Add custom tool
  addTool: (toolData) => api.post('/tools', toolData),
  
  // Update tool
  updateTool: (id, toolData) => api.put(`/tools/${id}`, toolData),
  
  // Delete tool
  deleteTool: (id) => api.delete(`/tools/${id}`),
};

// LLM API endpoints
export const llmAPI = {
  // Get available LLM providers
  getProviders: () => api.get('/llm/providers'),
  
  // Test LLM connection
  testConnection: (providerData) => api.post('/llm/test', providerData),
  
  // Send chat completion request
  chatCompletion: (messages, options = {}) => 
    api.post('/llm/chat', { messages, ...options }),
  
  // Get LLM usage statistics
  getUsage: () => api.get('/llm/usage'),
};

// Team API endpoints
export const teamAPI = {
  // Get team members
  getTeamMembers: () => api.get('/team/members'),
  
  // Invite team member
  inviteMember: (email, role) => api.post('/team/invite', { email, role }),
  
  // Update member role
  updateMemberRole: (memberId, role) => 
    api.put(`/team/members/${memberId}`, { role }),
  
  // Remove team member
  removeMember: (memberId) => api.delete(`/team/members/${memberId}`),
  
  // Get shared agents
  getSharedAgents: () => api.get('/team/shared-agents'),
  
  // Share agent with team
  shareAgent: (agentId, permissions) => 
    api.post(`/agents/${agentId}/share`, { permissions }),
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboard: () => api.get('/analytics/dashboard'),
  
  // Get agent performance metrics
  getAgentMetrics: (agentId, timeRange) => 
    api.get(`/analytics/agents/${agentId}`, { params: { timeRange } }),
  
  // Get system usage statistics
  getUsageStats: (timeRange) => 
    api.get('/analytics/usage', { params: { timeRange } }),
  
  // Get error logs
  getErrorLogs: (limit = 100) => 
    api.get('/analytics/errors', { params: { limit } }),
};

// Templates API endpoints
export const templatesAPI = {
  // Get agent templates
  getAgentTemplates: () => api.get('/templates/agents'),
  
  // Get workflow templates
  getWorkflowTemplates: () => api.get('/templates/workflows'),
  
  // Create agent from template
  createFromTemplate: (templateId, customizations) => 
    api.post(`/templates/agents/${templateId}/create`, customizations),
  
  // Save agent as template
  saveAsTemplate: (agentId, templateData) => 
    api.post(`/agents/${agentId}/save-template`, templateData),
};

export default api;

