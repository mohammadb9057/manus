import { db } from '../../../lib/database.js';

// Helper function to validate tool data
function validateToolData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('نام ابزار باید حداقل 2 کاراکتر باشد');
  }
  
  if (data.type && !['API', 'WEBHOOK', 'DATABASE', 'FILE', 'CUSTOM'].includes(data.type)) {
    errors.push('نوع ابزار نامعتبر است');
  }
  
  return errors;
}

// GET /api/tools - Get all available tools
async function getTools(req, res) {
  try {
    const { category, isBuiltIn, isActive } = req.query;
    
    // Build where clause
    const where = {};
    
    if (category) {
      where.type = category.toUpperCase();
    }
    
    if (isBuiltIn !== undefined) {
      where.isBuiltIn = isBuiltIn === 'true';
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    const tools = await db.tool.findMany({
      where,
      orderBy: [
        { isBuiltIn: 'desc' },
        { name: 'asc' }
      ]
    });
    
    // Transform data for frontend
    const transformedTools = tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      type: tool.type,
      config: tool.config,
      schema: tool.schema,
      isBuiltIn: tool.isBuiltIn,
      isActive: tool.isActive,
      createdAt: tool.createdAt,
      updatedAt: tool.updatedAt,
      // Add usage statistics if needed
      usageCount: 0 // Placeholder - could be calculated from agent tools
    }));
    
    res.status(200).json({
      success: true,
      data: transformedTools,
      count: transformedTools.length
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست ابزارها'
    });
  }
}

// POST /api/tools - Create new custom tool
async function createTool(req, res) {
  try {
    const {
      name,
      description,
      type = 'CUSTOM',
      config = {},
      schema = null
    } = req.body;
    
    // Validate input data
    const validationErrors = validateToolData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'داده‌های ورودی نامعتبر',
        details: validationErrors
      });
    }
    
    // Check if tool with same name exists
    const existingTool = await db.tool.findUnique({
      where: { name: name.trim().toLowerCase() }
    });
    
    if (existingTool) {
      return res.status(409).json({
        success: false,
        error: 'ابزاری با این نام قبلاً وجود دارد'
      });
    }
    
    // Create tool
    const tool = await db.tool.create({
      data: {
        name: name.trim().toLowerCase(),
        description: description?.trim(),
        type,
        config,
        schema,
        isBuiltIn: false,
        isActive: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: tool,
      message: 'ابزار با موفقیت ایجاد شد'
    });
  } catch (error) {
    console.error('Error creating tool:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'ابزاری با این نام قبلاً وجود دارد'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد ابزار'
    });
  }
}

// GET /api/tools/categories - Get tool categories
async function getToolCategories(req, res) {
  try {
    const categories = {
      'API': {
        name: 'API',
        description: 'ابزارهای اتصال به سرویس‌های خارجی',
        icon: 'Globe',
        examples: ['OpenWeatherMap', 'NewsAPI', 'GitHub API']
      },
      'WEBHOOK': {
        name: 'Webhook',
        description: 'ابزارهای دریافت و ارسال webhook',
        icon: 'Webhook',
        examples: ['Zapier', 'Discord Webhook', 'Slack Webhook']
      },
      'DATABASE': {
        name: 'پایگاه داده',
        description: 'ابزارهای اتصال به پایگاه‌های داده',
        icon: 'Database',
        examples: ['PostgreSQL', 'MongoDB', 'Redis']
      },
      'FILE': {
        name: 'فایل',
        description: 'ابزارهای پردازش فایل',
        icon: 'File',
        examples: ['CSV Reader', 'PDF Parser', 'Image Processor']
      },
      'CUSTOM': {
        name: 'سفارشی',
        description: 'ابزارهای سفارشی ساخته شده توسط کاربران',
        icon: 'Settings',
        examples: ['Custom Script', 'Custom API', 'Custom Function']
      }
    };
    
    // Get count for each category
    const counts = await db.tool.groupBy({
      by: ['type'],
      _count: {
        id: true
      },
      where: {
        isActive: true
      }
    });
    
    // Add counts to categories
    counts.forEach(count => {
      if (categories[count.type]) {
        categories[count.type].count = count._count.id;
      }
    });
    
    // Set default count to 0 for categories without tools
    Object.keys(categories).forEach(key => {
      if (!categories[key].count) {
        categories[key].count = 0;
      }
    });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting tool categories:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت دسته‌بندی ابزارها'
    });
  }
}

// GET /api/tools/popular - Get popular/recommended tools
async function getPopularTools(req, res) {
  try {
    // Get built-in tools as popular tools
    const popularTools = await db.tool.findMany({
      where: {
        isBuiltIn: true,
        isActive: true
      },
      take: 10,
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: popularTools,
      count: popularTools.length
    });
  } catch (error) {
    console.error('Error getting popular tools:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت ابزارهای محبوب'
    });
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { action } = req.query;
    
    switch (req.method) {
      case 'GET':
        if (action === 'categories') {
          return await getToolCategories(req, res);
        } else if (action === 'popular') {
          return await getPopularTools(req, res);
        } else {
          return await getTools(req, res);
        }
      case 'POST':
        return await createTool(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Tools API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
}

