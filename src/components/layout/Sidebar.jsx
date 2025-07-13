import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Workflow, 
  Settings, 
  Users, 
  BarChart3, 
  Puzzle, 
  Calendar,
  Zap,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    name: 'داشبورد',
    href: '/',
    icon: Home,
    badge: null,
  },
  {
    name: 'Agent ها',
    href: '/agents',
    icon: Bot,
    badge: null,
  },
  {
    name: 'گردش کار',
    href: '/workflows',
    icon: Workflow,
    badge: null,
  },
  {
    name: 'ابزارها',
    href: '/tools',
    icon: Puzzle,
    badge: null,
  },
  {
    name: 'زمان‌بندی',
    href: '/scheduler',
    icon: Calendar,
    badge: null,
  },
  {
    name: 'اتوماسیون',
    href: '/automation',
    icon: Zap,
    badge: 'جدید',
  },
];

const teamNavigation = [
  {
    name: 'تیم',
    href: '/team',
    icon: Users,
    badge: null,
  },
  {
    name: 'آمار و گزارش',
    href: '/analytics',
    icon: BarChart3,
    badge: null,
  },
];

const bottomNavigation = [
  {
    name: 'تنظیمات',
    href: '/settings',
    icon: Settings,
    badge: null,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 z-50 flex flex-col bg-white border-l border-gray-200 transition-all duration-300",
      sidebarOpen ? "w-72" : "w-16"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {sidebarOpen && (
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Agent Builder</h1>
              <p className="text-xs text-gray-500">سیستم ساخت هوش مصنوعی</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2"
        >
          {sidebarOpen ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      {sidebarOpen && (
        <div className="p-4 border-b border-gray-200">
          <Button className="w-full justify-start" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            Agent جدید
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  sidebarOpen ? "w-5 h-5 ml-3" : "w-5 h-5"
                )} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Team Navigation */}
        <div className="space-y-1">
          {sidebarOpen && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              تیم و همکاری
            </h3>
          )}
          {teamNavigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  sidebarOpen ? "w-5 h-5 ml-3" : "w-5 h-5"
                )} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        {bottomNavigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <item.icon className={cn(
                "flex-shrink-0",
                sidebarOpen ? "w-5 h-5 ml-3" : "w-5 h-5"
              )} />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">ک</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                کاربر تست
              </p>
              <p className="text-xs text-gray-500 truncate">
                test@example.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

