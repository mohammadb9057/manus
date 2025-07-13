import { llm7, LLM7_MODELS } from '../../../lib/llm7.js';

// GET /api/models - Get available LLM models
async function getModels(req, res) {
  try {
    // Try to get models from LLM7.io API
    try {
      const apiModels = await llm7.getModels();
      
      if (apiModels && apiModels.data) {
        // Transform API response to our format
        const transformedModels = apiModels.data.map(model => ({
          id: model.id,
          name: model.id,
          maxTokens: model.context_length || 4096,
          provider: 'llm7.io',
          available: true
        }));
        
        return res.status(200).json({
          success: true,
          data: transformedModels,
          count: transformedModels.length,
          source: 'api'
        });
      }
    } catch (apiError) {
      console.warn('Failed to fetch models from API, using static list:', apiError.message);
    }
    
    // Fallback to static model list
    const staticModels = LLM7_MODELS.map(model => ({
      id: model.id,
      name: model.name,
      maxTokens: model.maxTokens,
      provider: 'llm7.io',
      available: true,
      description: getModelDescription(model.id)
    }));
    
    res.status(200).json({
      success: true,
      data: staticModels,
      count: staticModels.length,
      source: 'static'
    });
    
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست مدل‌ها'
    });
  }
}

// Helper function to get model descriptions
function getModelDescription(modelId) {
  const descriptions = {
    'gpt-4o-mini-2024-07-18': 'مدل کوچک و سریع GPT-4o برای کاربردهای عمومی',
    'deepseek-r1-0528': 'مدل DeepSeek R1 برای استدلال پیشرفته',
    'deepseek-v3-0324': 'مدل DeepSeek V3 برای کاربردهای متنوع',
    'mistral-large-2411': 'مدل بزرگ Mistral برای کاربردهای پیچیده',
    'mistral-small-2503': 'مدل کوچک Mistral برای کاربردهای ساده',
    'codestral-2501': 'مدل تخصصی برای کدنویسی و برنامه‌نویسی',
    'llama-4-scout-17b-16e-instruct': 'مدل Llama 4 Scout برای دستورالعمل‌ها',
    'open-mixtral-8x22b': 'مدل Mixtral بزرگ با معماری MoE',
    'open-mixtral-8x7b': 'مدل Mixtral متوسط با معماری MoE',
    'qwen2.5-coder-32b-instruct': 'مدل Qwen تخصصی برای کدنویسی',
    'pixtral-large-2411': 'مدل چندوجهی برای متن و تصویر',
    'phi-4-multilmodal-instruct': 'مدل کوچک چندوجهی Microsoft',
    'grok-3-mini-high': 'مدل Grok Mini با کیفیت بالا',
    'openai-reasoning': 'مدل تخصصی برای استدلال منطقی'
  };
  
  return descriptions[modelId] || 'مدل هوش مصنوعی قدرتمند';
}

// GET /api/models/test - Test connection to LLM7.io
async function testConnection(req, res) {
  try {
    const result = await llm7.testConnection();
    
    res.status(200).json({
      success: result.success,
      data: result,
      message: result.success ? 'اتصال موفق' : 'اتصال ناموفق'
    });
    
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تست اتصال',
      details: error.message
    });
  }
}

// GET /api/models/categories - Get models grouped by category
async function getModelCategories(req, res) {
  try {
    const categories = {
      'general': {
        name: 'عمومی',
        description: 'مدل‌های عمومی برای کاربردهای متنوع',
        models: LLM7_MODELS.filter(m => 
          m.id.includes('gpt') || 
          m.id.includes('deepseek') || 
          m.id.includes('mistral-large') ||
          m.id.includes('llama')
        )
      },
      'coding': {
        name: 'کدنویسی',
        description: 'مدل‌های تخصصی برای برنامه‌نویسی',
        models: LLM7_MODELS.filter(m => 
          m.id.includes('codestral') || 
          m.id.includes('coder') ||
          m.id.includes('qwen')
        )
      },
      'reasoning': {
        name: 'استدلال',
        description: 'مدل‌های تخصصی برای استدلال منطقی',
        models: LLM7_MODELS.filter(m => 
          m.id.includes('reasoning') || 
          m.id.includes('grok') ||
          m.id.includes('deepseek-r1')
        )
      },
      'multimodal': {
        name: 'چندوجهی',
        description: 'مدل‌های پردازش متن و تصویر',
        models: LLM7_MODELS.filter(m => 
          m.id.includes('pixtral') || 
          m.id.includes('phi-4-multilmodal')
        )
      },
      'efficient': {
        name: 'کارآمد',
        description: 'مدل‌های کوچک و سریع',
        models: LLM7_MODELS.filter(m => 
          m.id.includes('mini') || 
          m.id.includes('small') ||
          m.id.includes('3b') ||
          m.id.includes('8b')
        )
      }
    };
    
    res.status(200).json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error getting model categories:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت دسته‌بندی مدل‌ها'
    });
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`
    });
  }
  
  try {
    const { action } = req.query;
    
    switch (action) {
      case 'test':
        return await testConnection(req, res);
      case 'categories':
        return await getModelCategories(req, res);
      default:
        return await getModels(req, res);
    }
  } catch (error) {
    console.error('Models API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
}

