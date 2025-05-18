import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog';
import { getUserFromToken, isAuthenticated } from '@/lib/auth';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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

    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = await getUserFromToken(request);
    
    // Check if user is author
    if (blog.author.toString() !== user?._id.toString()) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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

    // Find blog
    const blog = await Blog.findById(params.id);
    
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

    const { title, content, tags, status } = await request.json();

    // Update blog
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;
    blog.updatedAt = new Date();

    await blog.save();

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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

    // Find blog
    const blog = await Blog.findById(params.id);
    
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

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}