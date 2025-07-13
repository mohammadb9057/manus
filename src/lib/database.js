import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma;

// Function to create or get the Prisma client instance
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  }
  return prisma;
}

// Export the Prisma client instance
export const db = getPrismaClient();

// Graceful shutdown
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

// Database utility functions
export const dbUtils = {
  // Test database connection
  async testConnection() {
    try {
      await db.$queryRaw`SELECT 1`;
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get database statistics
  async getStats() {
    try {
      const [
        userCount,
        agentCount,
        workflowCount,
        executionCount,
        teamCount
      ] = await Promise.all([
        db.user.count(),
        db.agent.count(),
        db.workflow.count(),
        db.execution.count(),
        db.team.count()
      ]);

      return {
        users: userCount,
        agents: agentCount,
        workflows: workflowCount,
        executions: executionCount,
        teams: teamCount
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  },

  // Clean up old data
  async cleanup(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Delete old execution logs
      const deletedLogs = await db.executionLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      // Delete old analytics data
      const deletedAnalytics = await db.analytics.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      return {
        deletedLogs: deletedLogs.count,
        deletedAnalytics: deletedAnalytics.count
      };
    } catch (error) {
      throw new Error(`Failed to cleanup database: ${error.message}`);
    }
  },

  // Seed initial data
  async seed() {
    try {
      // Create default tools
      const defaultTools = [
        {
          name: 'openweather',
          description: 'OpenWeatherMap API for weather data',
          type: 'API',
          config: {
            baseUrl: 'https://api.openweathermap.org/data/2.5',
            requiresApiKey: true,
            endpoints: [
              { path: '/weather', method: 'GET', description: 'Current weather' },
              { path: '/forecast', method: 'GET', description: '5-day forecast' }
            ]
          },
          isBuiltIn: true
        },
        {
          name: 'newsapi',
          description: 'NewsAPI for latest news',
          type: 'API',
          config: {
            baseUrl: 'https://newsapi.org/v2',
            requiresApiKey: true,
            endpoints: [
              { path: '/top-headlines', method: 'GET', description: 'Top headlines' },
              { path: '/everything', method: 'GET', description: 'Search articles' }
            ]
          },
          isBuiltIn: true
        },
        {
          name: 'github',
          description: 'GitHub API for repository data',
          type: 'API',
          config: {
            baseUrl: 'https://api.github.com',
            requiresApiKey: false,
            endpoints: [
              { path: '/repos/{owner}/{repo}', method: 'GET', description: 'Get repository' },
              { path: '/users/{username}', method: 'GET', description: 'Get user' }
            ]
          },
          isBuiltIn: true
        },
        {
          name: 'jsonplaceholder',
          description: 'JSONPlaceholder for testing',
          type: 'API',
          config: {
            baseUrl: 'https://jsonplaceholder.typicode.com',
            requiresApiKey: false,
            endpoints: [
              { path: '/posts', method: 'GET', description: 'Get posts' },
              { path: '/users', method: 'GET', description: 'Get users' }
            ]
          },
          isBuiltIn: true
        }
      ];

      // Upsert tools
      for (const tool of defaultTools) {
        await db.tool.upsert({
          where: { name: tool.name },
          update: tool,
          create: tool
        });
      }

      return { message: 'Database seeded successfully', toolsCreated: defaultTools.length };
    } catch (error) {
      throw new Error(`Failed to seed database: ${error.message}`);
    }
  }
};

export default db;

