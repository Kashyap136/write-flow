import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog';
import { getUserFromToken, isAuthenticated } from '@/lib/auth';

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

    const { id, title, content, tags = [] } = await request.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required for publishing' },
        { status: 400 }
      );
    }

    // If ID is provided, update existing blog
    if (id) {
      // Find blog
      const blog = await Blog.findById(id);
      
      if (!blog) {
        return NextResponse.json(
          { message: 'Blog not found' },
          { status: 404 }
        );
      }

      // Check if user is author
      if (blog.author.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Update blog
      blog.title = title;
      blog.content = content;
      blog.tags = tags;
      blog.status = 'published';
      blog.updatedAt = new Date();

      await blog.save();

      return NextResponse.json(blog);
    } else {
      // Create new published blog
      const blog = await Blog.create({
        title,
        content,
        tags,
        status: 'published',
        author: user._id,
      });

      return NextResponse.json(blog, { status: 201 });
    }
  } catch (error) {
    console.error('Publish blog error:', error);
    return NextResponse.json(
      { message: 'Failed to publish blog' },
      { status: 500 }
    );
  }
}