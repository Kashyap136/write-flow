"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Loader2 } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export function BlogList() {
  const [blogs, setBlogs] = useState<{ draft: Blog[]; published: Blog[] }>({
    draft: [],
    published: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast({
          title: "Failed to load blogs",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user, router, toast]);

  const handleDelete = (id: string) => {
    // Update local state after successful deletion
    setBlogs({
      draft: blogs.draft.filter(blog => blog._id !== id),
      published: blogs.published.filter(blog => blog._id !== id),
    });
  };

  const getBlogsToDisplay = () => {
    switch (activeTab) {
      case "draft":
        return blogs.draft;
      case "published":
        return blogs.published;
      default:
        return [...blogs.draft, ...blogs.published];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your drafts and published posts
          </p>
        </div>
        
        <Button
          className="mt-4 md:mt-0"
          onClick={() => router.push("/editor")}
        >
          <PenSquare className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">
            All ({blogs.draft.length + blogs.published.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({blogs.draft.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({blogs.published.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your blogs...</p>
              </div>
            </div>
          ) : getBlogsToDisplay().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getBlogsToDisplay().map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border rounded-lg bg-muted/30">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No blogs found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "draft"
                    ? "You don't have any draft posts yet."
                    : activeTab === "published"
                    ? "You haven't published any posts yet."
                    : "Get started by creating your first blog post."}
                </p>
                <Button onClick={() => router.push("/editor")}>
                  <PenSquare className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}