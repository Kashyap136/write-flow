import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog';
import { getUserFromToken, isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication
    const isAuth = await isAuthenticated(request);
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = { author: user._id };
    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    }

    // Get blogs
    const blogs = await Blog.find(query).sort({ updatedAt: -1 });

    // Group blogs by status
    const groupedBlogs = {
      draft: blogs.filter(blog => blog.status === 'draft'),
      published: blogs.filter(blog => blog.status === 'published'),
    };

    return NextResponse.json(groupedBlogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication
    const isAuth = await isAuthenticated(request);
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, tags = [], status = 'draft' } = await request.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create blog
    const blog = await Blog.create({
      title,
      content,
      tags,
      status,
      author: user._id,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}