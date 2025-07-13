import { db } from '../../../lib/database.js';

// Helper function to validate workflow data
function validateWorkflowData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('نام Workflow باید حداقل 3 کاراکتر باشد');
  }
  
  if (data.status && !['DRAFT', 'ACTIVE', 'INACTIVE', 'ERROR'].includes(data.status)) {
    errors.push('وضعیت Workflow نامعتبر است');
  }
  
  return errors;
}

// GET /api/workflows - Get all workflows for user
async function getWorkflows(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const workflows = await db.workflow.findMany({
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
        steps: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                type: true,
                status: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: {
            executions: true,
            steps: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Transform data for frontend
    const transformedWorkflows = workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      config: workflow.config,
      triggers: workflow.triggers,
      isPublic: workflow.isPublic,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      stepCount: workflow._count.steps,
      executionCount: workflow._count.executions,
      steps: workflow.steps,
      user: workflow.user
    }));
    
    res.status(200).json({
      success: true,
      data: transformedWorkflows,
      count: transformedWorkflows.length
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست Workflowها'
    });
  }
}

// POST /api/workflows - Create new workflow
async function createWorkflow(req, res) {
  try {
    const {
      name,
      description,
      status = 'DRAFT',
      config = {},
      triggers = [],
      steps = [],
      isPublic = false,
      userId
    } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Validate input data
    const validationErrors = validateWorkflowData(req.body);
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
    
    // Create workflow with steps in a transaction
    const workflow = await db.$transaction(async (prisma) => {
      // Create workflow
      const newWorkflow = await prisma.workflow.create({
        data: {
          name: name.trim(),
          description: description?.trim(),
          status,
          config,
          triggers,
          isPublic,
          userId
        }
      });
      
      // Create steps if provided
      if (steps && steps.length > 0) {
        const stepData = steps.map((step, index) => ({
          name: step.name,
          type: step.type,
          config: step.config || {},
          position: step.position || index,
          workflowId: newWorkflow.id,
          agentId: step.agentId || null
        }));
        
        await prisma.workflowStep.createMany({
          data: stepData
        });
      }
      
      // Return workflow with steps
      return await prisma.workflow.findUnique({
        where: { id: newWorkflow.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          steps: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  status: true
                }
              }
            },
            orderBy: {
              position: 'asc'
            }
          }
        }
      });
    });
    
    res.status(201).json({
      success: true,
      data: workflow,
      message: 'Workflow با موفقیت ایجاد شد'
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Workflow با این نام قبلاً وجود دارد'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد Workflow'
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
        return await getWorkflows(req, res);
      case 'POST':
        return await createWorkflow(req, res);
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

