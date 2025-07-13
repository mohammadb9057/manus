import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} روز پیش`;
  if (hours > 0) return `${hours} ساعت پیش`;
  if (minutes > 0) return `${minutes} دقیقه پیش`;
  return 'همین الان';
};

// Agent utilities
export const getAgentStatusColor = (status) => {
  const colors = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    error: 'text-red-600 bg-red-100',
    running: 'text-blue-600 bg-blue-100',
    paused: 'text-yellow-600 bg-yellow-100'
  };
  return colors[status] || colors.inactive;
};

export const getExecutionStatusColor = (status) => {
  const colors = {
    success: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100',
    running: 'text-blue-600 bg-blue-100',
    pending: 'text-yellow-600 bg-yellow-100',
    cancelled: 'text-gray-600 bg-gray-100'
  };
  return colors[status] || colors.pending;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAgentName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 50;
};

export const validateApiKey = (key) => {
  return key && key.trim().length >= 10;
};

// Data transformation utilities
export const transformAgentForAPI = (agent) => {
  return {
    name: agent.name,
    description: agent.description,
    type: agent.type,
    config: agent.config,
    tools: agent.tools,
    llm_provider: agent.llmProvider,
    llm_config: agent.llmConfig,
    triggers: agent.triggers,
    is_active: agent.isActive
  };
};

export const transformAgentFromAPI = (apiAgent) => {
  return {
    id: apiAgent.id,
    name: apiAgent.name,
    description: apiAgent.description,
    type: apiAgent.type,
    config: apiAgent.config,
    tools: apiAgent.tools,
    llmProvider: apiAgent.llm_provider,
    llmConfig: apiAgent.llm_config,
    triggers: apiAgent.triggers,
    isActive: apiAgent.is_active,
    createdAt: apiAgent.created_at,
    updatedAt: apiAgent.updated_at
  };
};

// File utilities
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadJSON = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'خطای غیرمنتظره‌ای رخ داد';
};

export const handleApiError = (error, showToast) => {
  const message = getErrorMessage(error);
  console.error('API Error:', error);
  if (showToast) {
    showToast(message, 'error');
  }
  return message;
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Color utilities
export const generateAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// URL utilities
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Agent type utilities
export const getAgentTypeIcon = (type) => {
  const icons = {
    chatbot: '🤖',
    automation: '⚡',
    data_processor: '📊',
    api_connector: '🔗',
    scheduler: '⏰',
    monitor: '👁️',
    custom: '🛠️'
  };
  return icons[type] || icons.custom;
};

export const getAgentTypeLabel = (type) => {
  const labels = {
    chatbot: 'چت‌بات',
    automation: 'اتوماسیون',
    data_processor: 'پردازش داده',
    api_connector: 'اتصال API',
    scheduler: 'زمان‌بند',
    monitor: 'نظارت',
    custom: 'سفارشی'
  };
  return labels[type] || labels.custom;
};

