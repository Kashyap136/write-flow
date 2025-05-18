import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Set token in cookie
export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
};

// Get user from token
export const getUserFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

// Middleware to protect routes
export const isAuthenticated = async (request: NextRequest) => {
  const user = await getUserFromToken(request);
  
  if (!user) {
    return false;
  }
  
  return true;
};