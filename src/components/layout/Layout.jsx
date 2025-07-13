import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export default function Layout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={cn(
        "flex flex-col transition-all duration-300",
        sidebarOpen ? "mr-72" : "mr-16"
      )}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span>© 2025 AI Agent Builder</span>
              <span>•</span>
              <span>ساخته شده با ❤️ توسط Manus AI</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <a href="#" className="hover:text-gray-700 transition-colors">
                راهنما
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">
                پشتیبانی
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">
                API مستندات
              </a>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
}

