import React from 'react';
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
        <p className="text-gray-600 mt-1">
          مدیریت تنظیمات حساب کاربری و سیستم
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 ml-2" />
              اطلاعات کاربری
            </CardTitle>
            <CardDescription>
              ویرایش اطلاعات شخصی
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">نام</Label>
              <Input id="name" defaultValue="کاربر تست" />
            </div>
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" defaultValue="demo@aiagentbuilder.com" />
            </div>
            <Button>ذخیره تغییرات</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 ml-2" />
              اعلان‌ها
            </CardTitle>
            <CardDescription>
              تنظیم نوع اعلان‌ها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              تنظیمات اعلان‌ها در نسخه‌های بعدی اضافه خواهد شد.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

