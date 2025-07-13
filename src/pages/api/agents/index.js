import { db } from '../../../lib/database.js';
import { llm7Utils } from '../../../lib/llm7.js';

// Helper function to validate agent data
function validateAgentData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('نام Agent باید حداقل 3 کاراکتر باشد');
  }
  
  if (data.type && !['CHATBOT', 'AUTOMATION', 'DATA_PROCESSOR', 'API_CONNECTOR', 'SCHEDULER', 'MONITOR', 'CUSTOM'].includes(data.type)) {
    errors.push('نوع Agent نامعتبر است');
  }
  
  if (data.model && !llm7Utils.isValidModel(data.model)) {
    errors.push('مدل انتخاب شده نامعتبر است');
  }
  
  if (data.temperature !== undefined && (data.temperature < 0 || data.temperature > 2)) {
    errors.push('مقدار temperature باید بین 0 و 2 باشد');
  }
  
  if (data.maxTokens !== undefined && (data.maxTokens < 1 || data.maxTokens > 100000)) {
    errors.push('مقدار maxTokens باید بین 1 و 100000 باشد');
  }
  
  return errors;
}

// GET /api/agents - Get all agents for user
async function getAgents(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const agents = await db.agent.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            executions: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Transform data for frontend
    const transformedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      config: agent.config,
      systemPrompt: agent.systemPrompt,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      model: agent.model,
      tools: agent.tools,
      triggers: agent.triggers,
      isPublic: agent.isPublic,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      executionCount: agent._count.executions,
      user: agent.user
    }));
    
    res.status(200).json({
      success: true,
      data: transformedAgents,
      count: transformedAgents.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست Agentها'
    });
  }
}

// POST /api/agents - Create new agent
async function createAgent(req, res) {
  try {
    const {
      name,
      description,
      type = 'CHATBOT',
      systemPrompt,
      temperature = 0.7,
      maxTokens = 1000,
      model = 'gpt-4',
      tools = [],
      triggers = [],
      isPublic = false,
      userId
    } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Validate input data
    const validationErrors = validateAgentData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'داده‌های ورودی نامعتبر',
        details: validationErrors
      });
    }
    
    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }
    
    // Create agent
    const agent = await db.agent.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        type,
        systemPrompt: systemPrompt?.trim(),
        temperature,
        maxTokens,
        model,
        tools,
        triggers,
        isPublic,
        userId,
        status: 'INACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json({
      success: true,
      data: agent,
      message: 'Agent با موفقیت ایجاد شد'
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Agent با این نام قبلاً وجود دارد'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد Agent'
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
    switch (req.method) {
      case 'GET':
        return await getAgents(req, res);
      case 'POST':
        return await createAgent(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
}

