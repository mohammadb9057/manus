// Configuration for various services and APIs

export const config = {
  // App configuration
  app: {
    name: 'AI Agent Builder',
    version: '1.0.0',
    description: 'سیستم ساخت و مدیریت Agent های هوش مصنوعی',
    author: 'Manus AI',
  },

  // API configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-vercel-app.vercel.app/api' 
      : 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3,
  },

  // LLM Providers configuration
  llmProviders: {
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      models: [
        { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000 },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000 },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385 },
      ],
      requiresApiKey: true,
      freeCredits: '$5 for new accounts',
    },
    
    anthropic: {
      name: 'Anthropic Claude',
      baseUrl: 'https://api.anthropic.com/v1',
      models: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', maxTokens: 200000 },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 200000 },
      ],
      requiresApiKey: true,
      freeCredits: 'Monthly free credits available',
    },
    
    google: {
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      models: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2000000 },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1000000 },
      ],
      requiresApiKey: true,
      freeCredits: 'Generous free quota',
    },
    
    groq: {
      name: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: [
        { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', maxTokens: 131072 },
        { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', maxTokens: 131072 },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', maxTokens: 32768 },
      ],
      requiresApiKey: true,
      freeCredits: 'High speed with free limits',
    },
    
    together: {
      name: 'Together AI',
      baseUrl: 'https://api.together.xyz/v1',
      models: [
        { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Chat', maxTokens: 8192 },
        { id: 'meta-llama/Llama-3-8b-chat-hf', name: 'Llama 3 8B Chat', maxTokens: 8192 },
        { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', maxTokens: 32768 },
      ],
      requiresApiKey: true,
      freeCredits: 'Free credits for testing',
    },

    llm7: {
      name: 'LLM7.io',
      baseUrl: 'https://api.llm7.io/v1',
      models: [
        { id: 'gpt-4', name: 'GPT-4 via LLM7', maxTokens: 8192 },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo via LLM7', maxTokens: 4096 },
      ],
      requiresApiKey: true,
      freeCredits: 'Check LLM7.io for current offers',
    },
  },

  // Database providers
  databases: {
    mongodb: {
      name: 'MongoDB Atlas',
      freeLimit: '512MB storage',
      connectionString: process.env.MONGODB_URI || '',
    },
    
    supabase: {
      name: 'Supabase',
      freeLimit: '500MB database, 2GB bandwidth',
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || '',
    },
    
    planetscale: {
      name: 'PlanetScale',
      freeLimit: '1 database, 1GB storage',
      connectionString: process.env.DATABASE_URL || '',
    },
    
    firebase: {
      name: 'Firebase Firestore',
      freeLimit: '1GB storage, 50K reads/day',
      config: {
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.FIREBASE_PROJECT_ID || '',
      },
    },
  },

  // External APIs for testing and integration
  externalAPIs: {
    jsonplaceholder: {
      name: 'JSONPlaceholder',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      description: 'Fake REST API for testing',
      requiresApiKey: false,
      endpoints: [
        { path: '/posts', method: 'GET', description: 'Get all posts' },
        { path: '/users', method: 'GET', description: 'Get all users' },
        { path: '/comments', method: 'GET', description: 'Get all comments' },
      ],
    },
    
    openweather: {
      name: 'OpenWeatherMap',
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      description: 'Weather data API',
      requiresApiKey: true,
      freeLimit: '1000 calls/day',
      signupUrl: 'https://openweathermap.org/api',
    },
    
    newsapi: {
      name: 'NewsAPI',
      baseUrl: 'https://newsapi.org/v2',
      description: 'News articles API',
      requiresApiKey: true,
      freeLimit: '1000 requests/day',
      signupUrl: 'https://newsapi.org/register',
    },
    
    github: {
      name: 'GitHub API',
      baseUrl: 'https://api.github.com',
      description: 'GitHub repositories and user data',
      requiresApiKey: false,
      freeLimit: '60 requests/hour (unauthenticated)',
    },
    
    restcountries: {
      name: 'REST Countries',
      baseUrl: 'https://restcountries.com/v3.1',
      description: 'Country information API',
      requiresApiKey: false,
      freeLimit: 'Unlimited',
    },
    
    httpbin: {
      name: 'HTTPBin',
      baseUrl: 'https://httpbin.org',
      description: 'HTTP testing service',
      requiresApiKey: false,
      freeLimit: 'Unlimited',
    },
  },

  // Email services
  emailServices: {
    emailjs: {
      name: 'EmailJS',
      description: 'Send emails from frontend',
      freeLimit: '200 emails/month',
      signupUrl: 'https://www.emailjs.com/',
    },
  },

  // Automation services
  automationServices: {
    zapier: {
      name: 'Zapier',
      description: 'Workflow automation',
      freeLimit: '100 tasks/month',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/',
    },
    
    ifttt: {
      name: 'IFTTT',
      description: 'Simple automation',
      freeLimit: '2 applets',
      webhookUrl: 'https://maker.ifttt.com/trigger/',
    },
  },

  // Deployment platforms
  deployment: {
    vercel: {
      name: 'Vercel',
      description: 'Frontend deployment',
      freeLimit: '100GB bandwidth/month',
      features: ['Serverless Functions', 'Edge Network', 'Analytics'],
    },
    
    netlify: {
      name: 'Netlify',
      description: 'Alternative deployment',
      freeLimit: '100GB bandwidth/month',
      features: ['Forms', 'Functions', 'Identity'],
    },
  },

  // Default agent templates
  agentTemplates: [
    {
      id: 'chatbot',
      name: 'چت‌بات ساده',
      description: 'یک چت‌بات پایه برای پاسخ به سوالات',
      type: 'chatbot',
      config: {
        systemPrompt: 'شما یک دستیار مفید هستید که به سوالات کاربران پاسخ می‌دهید.',
        temperature: 0.7,
        maxTokens: 1000,
      },
      tools: [],
    },
    
    {
      id: 'weather-bot',
      name: 'ربات آب و هوا',
      description: 'دریافت اطلاعات آب و هوا از OpenWeatherMap',
      type: 'api_connector',
      config: {
        systemPrompt: 'شما یک ربات آب و هوا هستید که اطلاعات آب و هوا را ارائه می‌دهید.',
        temperature: 0.3,
        maxTokens: 500,
      },
      tools: ['openweather'],
    },
    
    {
      id: 'news-summarizer',
      name: 'خلاصه‌ساز اخبار',
      description: 'دریافت و خلاصه‌سازی آخرین اخبار',
      type: 'data_processor',
      config: {
        systemPrompt: 'شما اخبار را خلاصه می‌کنید و نکات مهم را استخراج می‌کنید.',
        temperature: 0.5,
        maxTokens: 800,
      },
      tools: ['newsapi'],
    },
    
    {
      id: 'scheduler',
      name: 'زمان‌بند خودکار',
      description: 'اجرای خودکار وظایف در زمان‌های مشخص',
      type: 'scheduler',
      config: {
        systemPrompt: 'شما وظایف را در زمان‌های مشخص اجرا می‌کنید.',
        temperature: 0.1,
        maxTokens: 300,
      },
      tools: [],
      triggers: [
        { type: 'schedule', cron: '0 9 * * *', description: 'روزانه ساعت 9 صبح' }
      ],
    },
  ],

  // UI Configuration
  ui: {
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
      },
    },
    
    animations: {
      duration: 200,
      easing: 'ease-in-out',
    },
    
    layout: {
      sidebarWidth: 280,
      headerHeight: 64,
      maxContentWidth: 1200,
    },
  },

  // Feature flags
  features: {
    teamCollaboration: true,
    agentSharing: true,
    analytics: true,
    templates: true,
    customTools: true,
    scheduling: true,
    webhooks: true,
    apiIntegration: true,
  },
};

export default config;

