import { Navbar } from "@/components/layout/navbar";
import { BlogEditor } from "@/components/blog/editor";

interface BlogEditorPageProps {
  params: { id: string };
}

async function getBlog(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blogs/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogEditorPage({ params }: BlogEditorPageProps) {
  const { id } = params;
  const blog = await getBlog(id);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogEditor blog={blog} />
    </div>
  );
}