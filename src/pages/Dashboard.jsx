import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Workflow, 
  Zap, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data - در پروژه واقعی از API دریافت می‌شود
const mockStats = {
  agents: { total: 12, active: 8, inactive: 4 },
  workflows: { total: 6, active: 4, draft: 2 },
  executions: { today: 45, thisWeek: 312, success: 89 },
  team: { members: 3, online: 2 }
};

const mockRecentAgents = [
  { id: 1, name: 'چت‌بات پشتیبانی', type: 'CHATBOT', status: 'ACTIVE', lastRun: '5 دقیقه پیش', executions: 23 },
  { id: 2, name: 'خلاصه‌ساز اخبار', type: 'DATA_PROCESSOR', status: 'ACTIVE', lastRun: '15 دقیقه پیش', executions: 12 },
  { id: 3, name: 'ربات آب و هوا', type: 'API_CONNECTOR', status: 'INACTIVE', lastRun: '2 ساعت پیش', executions: 8 },
  { id: 4, name: 'مانیتور سیستم', type: 'MONITOR', status: 'ACTIVE', lastRun: '1 دقیقه پیش', executions: 156 }
];

const mockRecentExecutions = [
  { id: 1, agent: 'چت‌بات پشتیبانی', status: 'SUCCESS', duration: '1.2s', time: '2 دقیقه پیش' },
  { id: 2, agent: 'خلاصه‌ساز اخبار', status: 'SUCCESS', duration: '3.4s', time: '5 دقیقه پیش' },
  { id: 3, agent: 'ربات آب و هوا', status: 'FAILED', duration: '0.8s', time: '10 دقیقه پیش' },
  { id: 4, agent: 'مانیتور سیستم', status: 'SUCCESS', duration: '0.5s', time: '15 دقیقه پیش' }
];

const StatCard = ({ title, value, description, icon: Icon, trend, color = 'blue' }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 text-${color}-600`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>
      {trend && (
        <div className="flex items-center mt-2">
          <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
          <span className="text-xs text-green-600">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AgentTypeIcon = ({ type }) => {
  const icons = {
    CHATBOT: Bot,
    DATA_PROCESSOR: BarChart3,
    API_CONNECTOR: Zap,
    MONITOR: Activity,
    AUTOMATION: Workflow
  };
  const Icon = icons[type] || Bot;
  return <Icon className="h-4 w-4" />;
};

const StatusBadge = ({ status }) => {
  const variants = {
    ACTIVE: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    INACTIVE: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    SUCCESS: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    FAILED: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
  };
  
  const config = variants[status] || variants.INACTIVE;
  
  return (
    <Badge {...config}>
      {status === 'ACTIVE' && 'فعال'}
      {status === 'INACTIVE' && 'غیرفعال'}
      {status === 'SUCCESS' && 'موفق'}
      {status === 'FAILED' && 'ناموفق'}
    </Badge>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            خوش آمدید! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            مدیریت و نظارت بر Agentهای هوش مصنوعی شما
          </p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 ml-2" />
            گزارش هفتگی
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 ml-2" />
            Agent جدید
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="کل Agentها"
          value={mockStats.agents.total}
          description={`${mockStats.agents.active} فعال، ${mockStats.agents.inactive} غیرفعال`}
          icon={Bot}
          trend="+2 این هفته"
          color="blue"
        />
        <StatCard
          title="Workflowها"
          value={mockStats.workflows.total}
          description={`${mockStats.workflows.active} فعال، ${mockStats.workflows.draft} پیش‌نویس`}
          icon={Workflow}
          trend="+1 این هفته"
          color="purple"
        />
        <StatCard
          title="اجراهای امروز"
          value={mockStats.executions.today}
          description={`${mockStats.executions.success}% موفق`}
          icon={Zap}
          trend="+12% نسبت به دیروز"
          color="green"
        />
        <StatCard
          title="اعضای تیم"
          value={mockStats.team.members}
          description={`${mockStats.team.online} آنلاین`}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Agents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agentهای اخیر</CardTitle>
                <CardDescription>
                  فعالیت و وضعیت آخرین Agentهای شما
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agents">
                  مشاهده همه
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AgentTypeIcon type={agent.type} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-500">
                          آخرین اجرا: {agent.lastRun}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.executions} اجرا
                        </div>
                        <StatusBadge status={agent.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Executions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
              <CardDescription>
                دسترسی سریع به عملیات مهم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/agents/new">
                  <Plus className="h-4 w-4 ml-2" />
                  ایجاد Agent جدید
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/workflows/new">
                  <Workflow className="h-4 w-4 ml-2" />
                  ایجاد Workflow جدید
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/tools">
                  <Zap className="h-4 w-4 ml-2" />
                  مرور ابزارها
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/team">
                  <Users className="h-4 w-4 ml-2" />
                  دعوت اعضای تیم
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card>
            <CardHeader>
              <CardTitle>اجراهای اخیر</CardTitle>
              <CardDescription>
                آخرین فعالیت‌های سیستم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentExecutions.map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <StatusBadge status={execution.status} />
                      <span className="text-gray-900">{execution.agent}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-gray-600">{execution.duration}</div>
                      <div className="text-xs text-gray-500">{execution.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                <Link to="/executions">
                  مشاهده همه اجراها
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>نمای کلی عملکرد</CardTitle>
          <CardDescription>
            آمار عملکرد سیستم در 7 روز گذشته
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">نرخ موفقیت</span>
                <span className="text-sm font-bold text-green-600">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">میانگین زمان پاسخ</span>
                <span className="text-sm font-bold text-blue-600">1.8s</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">استفاده از منابع</span>
                <span className="text-sm font-bold text-purple-600">64%</span>
              </div>
              <Progress value={64} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

