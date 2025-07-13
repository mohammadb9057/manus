import { db } from '../../../lib/database.js';
import { llm7Utils } from '../../../lib/llm7.js';

// Helper function to validate agent data
function validateAgentData(data) {
  const errors = [];
  
  if (data.name && data.name.trim().length < 3) {
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

// GET /api/agents/[id] - Get specific agent
async function getAgent(req, res) {
  try {
    const { id } = req.query;
    const { userId } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    const agent = await db.agent.findFirst({
      where: {
        id: id,
        OR: [
          { userId: userId },
          { isPublic: true }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        executions: {
          take: 10,
          orderBy: {
            startedAt: 'desc'
          },
          select: {
            id: true,
            status: true,
            startedAt: true,
            finishedAt: true,
            duration: true,
            error: true
          }
        },
        _count: {
          select: {
            executions: true
          }
        }
      }
    });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent یافت نشد'
      });
    }
    
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت اطلاعات Agent'
    });
  }
}

// PUT /api/agents/[id] - Update agent
async function updateAgent(req, res) {
  try {
    const { id } = req.query;
    const { userId } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
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
    
    // Check if agent exists and user has permission
    const existingAgent = await db.agent.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        error: 'Agent یافت نشد یا شما مجوز ویرایش آن را ندارید'
      });
    }
    
    // Prepare update data
    const updateData = {};
    const allowedFields = [
      'name', 'description', 'type', 'systemPrompt', 
      'temperature', 'maxTokens', 'model', 'tools', 
      'triggers', 'isPublic', 'status'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Trim string fields
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.systemPrompt) updateData.systemPrompt = updateData.systemPrompt.trim();
    
    // Update agent
    const updatedAgent = await db.agent.update({
      where: { id: id },
      data: updateData,
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
    
    res.status(200).json({
      success: true,
      data: updatedAgent,
      message: 'Agent با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Agent با این نام قبلاً وجود دارد'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی Agent'
    });
  }
}

// DELETE /api/agents/[id] - Delete agent
async function deleteAgent(req, res) {
  try {
    const { id } = req.query;
    const { userId } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Check if agent exists and user has permission
    const existingAgent = await db.agent.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        error: 'Agent یافت نشد یا شما مجوز حذف آن را ندارید'
      });
    }
    
    // Delete agent (this will cascade delete related records)
    await db.agent.delete({
      where: { id: id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Agent با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف Agent'
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
        return await getAgent(req, res);
      case 'PUT':
        return await updateAgent(req, res);
      case 'DELETE':
        return await deleteAgent(req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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

