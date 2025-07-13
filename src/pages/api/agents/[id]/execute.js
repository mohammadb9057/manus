import { db } from '../../../../lib/database.js';
import { llm7 } from '../../../../lib/llm7.js';

// Execute agent with given input
async function executeAgent(req, res) {
  try {
    const { id } = req.query;
    const { input, userId, stream = false } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Get agent
    const agent = await db.agent.findFirst({
      where: {
        id: id,
        OR: [
          { userId: userId },
          { isPublic: true }
        ]
      }
    });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent یافت نشد'
      });
    }
    
    if (agent.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        error: 'Agent غیرفعال است'
      });
    }
    
    // Create execution record
    const execution = await db.execution.create({
      data: {
        type: 'AGENT',
        status: 'RUNNING',
        input: { message: input },
        userId: userId,
        agentId: id
      }
    });
    
    try {
      // Prepare messages for LLM
      const messages = [];
      
      // Add system prompt if exists
      if (agent.systemPrompt) {
        messages.push({
          role: 'system',
          content: agent.systemPrompt
        });
      }
      
      // Add user input
      messages.push({
        role: 'user',
        content: input
      });
      
      // Log execution start
      await db.executionLog.create({
        data: {
          level: 'INFO',
          message: 'شروع اجرای Agent',
          data: {
            agentId: id,
            model: agent.model,
            temperature: agent.temperature,
            maxTokens: agent.maxTokens
          },
          executionId: execution.id
        }
      });
      
      const startTime = Date.now();
      
      // Execute with LLM7
      const response = await llm7.chatCompletion({
        model: agent.model,
        messages: messages,
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
        stream: stream
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Extract response content
      const output = response.choices[0]?.message?.content || '';
      
      // Update execution record
      await db.execution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          output: { 
            message: output,
            usage: response.usage,
            model: response.model
          },
          finishedAt: new Date(),
          duration: duration
        }
      });
      
      // Log execution success
      await db.executionLog.create({
        data: {
          level: 'INFO',
          message: 'اجرای Agent با موفقیت تکمیل شد',
          data: {
            duration: duration,
            usage: response.usage,
            outputLength: output.length
          },
          executionId: execution.id
        }
      });
      
      // Record analytics
      await db.analytics.create({
        data: {
          type: 'EXECUTION',
          data: {
            agentId: id,
            userId: userId,
            model: agent.model,
            duration: duration,
            inputTokens: response.usage?.prompt_tokens || 0,
            outputTokens: response.usage?.completion_tokens || 0,
            totalTokens: response.usage?.total_tokens || 0
          },
          userId: userId,
          agentId: id
        }
      });
      
      res.status(200).json({
        success: true,
        data: {
          executionId: execution.id,
          output: output,
          usage: response.usage,
          duration: duration,
          model: response.model
        },
        message: 'Agent با موفقیت اجرا شد'
      });
      
    } catch (llmError) {
      console.error('LLM Error:', llmError);
      
      // Update execution record with error
      await db.execution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: llmError.message,
          finishedAt: new Date(),
          duration: Date.now() - execution.startedAt.getTime()
        }
      });
      
      // Log execution error
      await db.executionLog.create({
        data: {
          level: 'ERROR',
          message: 'خطا در اجرای Agent',
          data: {
            error: llmError.message,
            stack: llmError.stack
          },
          executionId: execution.id
        }
      });
      
      // Record error analytics
      await db.analytics.create({
        data: {
          type: 'ERROR',
          data: {
            agentId: id,
            userId: userId,
            error: llmError.message,
            errorType: 'LLM_ERROR'
          },
          userId: userId,
          agentId: id
        }
      });
      
      return res.status(500).json({
        success: false,
        error: 'خطا در اجرای Agent',
        details: llmError.message,
        executionId: execution.id
      });
    }
    
  } catch (error) {
    console.error('Error executing agent:', error);
    
    // Record error analytics if possible
    try {
      await db.analytics.create({
        data: {
          type: 'ERROR',
          data: {
            agentId: id,
            userId: userId,
            error: error.message,
            errorType: 'SYSTEM_ERROR'
          },
          userId: userId,
          agentId: id
        }
      });
    } catch (analyticsError) {
      console.error('Error recording analytics:', analyticsError);
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در اجرای Agent'
    });
  }
}

// Stream agent execution
async function streamAgentExecution(req, res) {
  try {
    const { id } = req.query;
    const { input, userId } = req.body;
    
    if (!id || !input || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get agent
    const agent = await db.agent.findFirst({
      where: {
        id: id,
        OR: [
          { userId: userId },
          { isPublic: true }
        ]
      }
    });
    
    if (!agent || agent.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        error: 'Agent یافت نشد یا غیرفعال است'
      });
    }
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Create execution record
    const execution = await db.execution.create({
      data: {
        type: 'AGENT',
        status: 'RUNNING',
        input: { message: input },
        userId: userId,
        agentId: id
      }
    });
    
    // Prepare messages
    const messages = [];
    if (agent.systemPrompt) {
      messages.push({ role: 'system', content: agent.systemPrompt });
    }
    messages.push({ role: 'user', content: input });
    
    const startTime = Date.now();
    let fullContent = '';
    
    try {
      // Stream response
      await llm7.streamChatCompletion({
        model: agent.model,
        messages: messages,
        temperature: agent.temperature,
        max_tokens: agent.maxTokens
      }, (chunk, accumulated) => {
        fullContent = accumulated;
        
        // Send chunk to client
        res.write(`data: ${JSON.stringify({
          type: 'chunk',
          content: chunk,
          accumulated: accumulated
        })}\n\n`);
      });
      
      const duration = Date.now() - startTime;
      
      // Update execution record
      await db.execution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          output: { message: fullContent },
          finishedAt: new Date(),
          duration: duration
        }
      });
      
      // Send completion event
      res.write(`data: ${JSON.stringify({
        type: 'complete',
        executionId: execution.id,
        duration: duration,
        fullContent: fullContent
      })}\n\n`);
      
    } catch (error) {
      // Update execution with error
      await db.execution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: error.message,
          finishedAt: new Date(),
          duration: Date.now() - startTime
        }
      });
      
      // Send error event
      res.write(`data: ${JSON.stringify({
        type: 'error',
        error: error.message,
        executionId: execution.id
      })}\n\n`);
    }
    
    res.end();
    
  } catch (error) {
    console.error('Error streaming agent execution:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: 'خطا در اجرای Agent'
    })}\n\n`);
    res.end();
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`
    });
  }
  
  // Check if streaming is requested
  if (req.body.stream === true) {
    return await streamAgentExecution(req, res);
  } else {
    return await executeAgent(req, res);
  }
}

