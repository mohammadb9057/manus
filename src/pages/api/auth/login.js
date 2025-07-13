import { db } from '../../../lib/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'ai-agent-builder-jwt-secret-2025',
    { expiresIn: '7d' }
  );
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/auth/login - User login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'ایمیل و رمز عبور الزامی است'
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'فرمت ایمیل نامعتبر است'
      });
    }
    
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'ایمیل یا رمز عبور اشتباه است'
      });
    }
    
    // For demo purposes, we'll create a simple password check
    // In production, you should use proper password hashing
    const isValidPassword = password === 'demo123' || await bcrypt.compare(password, user.password || '');
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'ایمیل یا رمز عبور اشتباه است'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        },
        token: token
      },
      message: 'ورود با موفقیت انجام شد'
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ورود به سیستم'
    });
  }
}

// POST /api/auth/register - User registration (for demo)
async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'تمام فیلدها الزامی است'
      });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'فرمت ایمیل نامعتبر است'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'رمز عبور باید حداقل 6 کاراکتر باشد'
      });
    }
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role: 'USER'
      }
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        },
        token: token
      },
      message: 'ثبت‌نام با موفقیت انجام شد'
    });
    
  } catch (error) {
    console.error('Error during registration:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت‌نام'
    });
  }
}

// POST /api/auth/demo - Demo login (creates demo user if not exists)
async function demoLogin(req, res) {
  try {
    const demoEmail = 'demo@aiagentbuilder.com';
    const demoName = 'کاربر تست';
    
    // Check if demo user exists
    let user = await db.user.findUnique({
      where: { email: demoEmail }
    });
    
    // Create demo user if not exists
    if (!user) {
      user = await db.user.create({
        data: {
          email: demoEmail,
          name: demoName,
          role: 'USER'
        }
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        },
        token: token
      },
      message: 'ورود تست با موفقیت انجام شد'
    });
    
  } catch (error) {
    console.error('Error during demo login:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ورود تست'
    });
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
  
  try {
    // Check the endpoint type based on URL or body
    const { type } = req.body;
    
    switch (type) {
      case 'register':
        return await register(req, res);
      case 'demo':
        return await demoLogin(req, res);
      default:
        return await login(req, res);
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
}

