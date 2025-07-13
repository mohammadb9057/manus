import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Share,
  Activity,
  Calendar,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data - در پروژه واقعی از API دریافت می‌شود
const mockAgents = [
  {
    id: 1,
    name: 'چت‌بات پشتیبانی مشتریان',
    description: 'پاسخ‌دهی خودکار به سوالات متداول مشتریان',
    type: 'CHATBOT',
    status: 'ACTIVE',
    model: 'gpt-4o-mini-2024-07-18',
    lastRun: '5 دقیقه پیش',
    executions: 156,
    successRate: 94,
    createdAt: '2025-01-10',
    isPublic: false
  },
  {
    id: 2,
    name: 'خلاصه‌ساز اخبار روزانه',
    description: 'جمع‌آوری و خلاصه‌سازی اخبار مهم روز',
    type: 'DATA_PROCESSOR',
    status: 'ACTIVE',
    model: 'mistral-large-2411',
    lastRun: '15 دقیقه پیش',
    executions: 89,
    successRate: 98,
    createdAt: '2025-01-08',
    isPublic: true
  },
  {
    id: 3,
    name: 'ربات آب و هوا',
    description: 'ارائه اطلاعات آب و هوا بر اساس موقعیت',
    type: 'API_CONNECTOR',
    status: 'INACTIVE',
    model: 'deepseek-v3-0324',
    lastRun: '2 ساعت پیش',
    executions: 45,
    successRate: 87,
    createdAt: '2025-01-05',
    isPublic: false
  },
  {
    id: 4,
    name: 'مانیتور سیستم',
    description: 'نظارت بر وضعیت سرورها و ارسال هشدار',
    type: 'MONITOR',
    status: 'ACTIVE',
    model: 'llama-4-scout-17b-16e-instruct',
    lastRun: '1 دقیقه پیش',
    executions: 234,
    successRate: 91,
    createdAt: '2025-01-03',
    isPublic: false
  },
  {
    id: 5,
    name: 'اتوماسیون ایمیل',
    description: 'ارسال خودکار ایمیل‌های بازاریابی',
    type: 'AUTOMATION',
    status: 'PAUSED',
    model: 'codestral-2501',
    lastRun: '1 روز پیش',
    executions: 67,
    successRate: 89,
    createdAt: '2025-01-01',
    isPublic: false
  },
  {
    id: 6,
    name: 'تحلیلگر داده‌های فروش',
    description: 'تجزیه و تحلیل داده‌های فروش و تولید گزارش',
    type: 'DATA_PROCESSOR',
    status: 'ACTIVE',
    model: 'qwen2.5-coder-32b-instruct',
    lastRun: '30 دقیقه پیش',
    executions: 123,
    successRate: 96,
    createdAt: '2024-12-28',
    isPublic: true
  }
];

const AgentTypeIcon = ({ type }) => {
  const icons = {
    CHATBOT: Bot,
    DATA_PROCESSOR: Activity,
    API_CONNECTOR: Settings,
    MONITOR: Activity,
    AUTOMATION: Settings,
    CUSTOM: Settings
  };
  const Icon = icons[type] || Bot;
  return <Icon className="h-4 w-4" />;
};

const StatusBadge = ({ status }) => {
  const variants = {
    ACTIVE: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100', text: 'فعال' },
    INACTIVE: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100', text: 'غیرفعال' },
    PAUSED: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', text: 'متوقف' },
    ERROR: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100', text: 'خطا' }
  };
  
  const config = variants[status] || variants.INACTIVE;
  
  return (
    <Badge {...config}>
      {config.text}
    </Badge>
  );
};

const AgentCard = ({ agent }) => {
  const handleAction = (action) => {
    console.log(`${action} agent:`, agent.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AgentTypeIcon type={agent.type} />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="mt-1">
                {agent.description}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('run')}>
                <Play className="h-4 w-4 ml-2" />
                اجرا
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('edit')}>
                <Edit className="h-4 w-4 ml-2" />
                ویرایش
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('duplicate')}>
                <Copy className="h-4 w-4 ml-2" />
                کپی
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('share')}>
                <Share className="h-4 w-4 ml-2" />
                اشتراک‌گذاری
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleAction('delete')}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Status and Model */}
          <div className="flex items-center justify-between">
            <StatusBadge status={agent.status} />
            <span className="text-sm text-gray-500">{agent.model}</span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{agent.executions}</div>
              <div className="text-xs text-gray-500">اجرا</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{agent.successRate}%</div>
              <div className="text-xs text-gray-500">موفقیت</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{agent.lastRun}</div>
              <div className="text-xs text-gray-500">آخرین اجرا</div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 space-x-reverse pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleAction('run')}
            >
              <Play className="h-3 w-3 ml-1" />
              اجرا
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction('edit')}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction('settings')}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Agents() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesType = typeFilter === 'all' || agent.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agentها</h1>
          <p className="text-gray-600 mt-1">
            مدیریت و نظارت بر Agentهای هوش مصنوعی شما
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
          <Link to="/agents/new">
            <Plus className="h-4 w-4 ml-2" />
            Agent جدید
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="جستجو در Agentها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="ACTIVE">فعال</SelectItem>
                <SelectItem value="INACTIVE">غیرفعال</SelectItem>
                <SelectItem value="PAUSED">متوقف</SelectItem>
                <SelectItem value="ERROR">خطا</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="CHATBOT">چت‌بات</SelectItem>
                <SelectItem value="DATA_PROCESSOR">پردازشگر داده</SelectItem>
                <SelectItem value="API_CONNECTOR">اتصال API</SelectItem>
                <SelectItem value="MONITOR">مانیتور</SelectItem>
                <SelectItem value="AUTOMATION">اتوماسیون</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل Agentها</p>
                <p className="text-2xl font-bold text-gray-900">{mockAgents.length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">فعال</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockAgents.filter(a => a.status === 'ACTIVE').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">اجراهای امروز</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockAgents.reduce((sum, agent) => sum + agent.executions, 0)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">میانگین موفقیت</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(mockAgents.reduce((sum, agent) => sum + agent.successRate, 0) / mockAgents.length)}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                هیچ Agent یافت نشد
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'فیلترهای خود را تغییر دهید یا Agent جدیدی ایجاد کنید.'
                  : 'شروع کنید با ایجاد اولین Agent خود.'
                }
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
                <Link to="/agents/new">
                  <Plus className="h-4 w-4 ml-2" />
                  Agent جدید
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

