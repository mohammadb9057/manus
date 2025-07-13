import React from 'react';
import { 
  Settings, 
  Plus, 
  Search,
  Globe,
  Database,
  File,
  Webhook
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockTools = [
  {
    id: 1,
    name: 'OpenWeatherMap API',
    description: 'دریافت اطلاعات آب و هوا',
    type: 'API',
    isBuiltIn: true,
    isActive: true
  },
  {
    id: 2,
    name: 'PostgreSQL Connector',
    description: 'اتصال به پایگاه داده PostgreSQL',
    type: 'DATABASE',
    isBuiltIn: true,
    isActive: true
  }
];

export default function Tools() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ابزارها</h1>
          <p className="text-gray-600 mt-1">
            مدیریت ابزارها و اتصالات
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 ml-2" />
          ابزار جدید
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجو در ابزارها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 ml-2" />
                {tool.name}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {tool.type}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

