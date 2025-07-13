import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Workflow, 
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

// Mock data
const mockWorkflows = [
  {
    id: 1,
    name: 'پردازش خودکار ایمیل‌ها',
    description: 'دریافت، تحلیل و پاسخ خودکار به ایمیل‌های مشتریان',
    status: 'ACTIVE',
    steps: 4,
    lastRun: '10 دقیقه پیش',
    executions: 89,
    successRate: 94,
    createdAt: '2025-01-10'
  },
  {
    id: 2,
    name: 'گزارش‌گیری روزانه',
    description: 'تولید گزارش‌های روزانه از داده‌های فروش',
    status: 'ACTIVE',
    steps: 6,
    lastRun: '1 ساعت پیش',
    executions: 156,
    successRate: 98,
    createdAt: '2025-01-08'
  }
];

export default function Workflows() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflowها</h1>
          <p className="text-gray-600 mt-1">
            مدیریت گردش کارهای خودکار
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 ml-2" />
          Workflow جدید
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجو در Workflowها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  فعال
                </Badge>
                <div className="text-sm text-gray-600">
                  {workflow.steps} مرحله • {workflow.executions} اجرا
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

