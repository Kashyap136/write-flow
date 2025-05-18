"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputTags } from "@/components/ui/input-tags";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface BlogEditorProps {
  blog?: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    status: "draft" | "published";
  };
}

export function BlogEditor({ blog }: BlogEditorProps) {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [status, setStatus] = useState<"draft" | "published">(
    blog?.status || "draft"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Debounced auto-save function
  const saveDraft = debounce(async () => {
    if (!title && !content) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/blogs/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: blog?.id,
          title,
          content,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      const savedBlog = await response.json();
      
      // Update blog ID if new blog
      if (!blog?.id) {
        router.replace(`/editor/${savedBlog._id}`);
      }
      
      setLastSaved(new Date());
      toast({
        title: "Draft saved",
        description: `Last saved at ${new Date().toLocaleTimeString()}`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Failed to save draft",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, 5000);

  // Auto-save on content change
  useEffect(() => {
    if (title || content) {
      saveDraft();
    }
    
    return () => {
      saveDraft.cancel();
    };
  }, [title, content, tags, saveDraft]);

  const handlePublish = async () => {
    if (!title || !content) {
      toast({
        title: "Cannot publish",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch("/api/blogs/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: blog?.id,
          title,
          content,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish blog");
      }

      const publishedBlog = await response.json();
      
      toast({
        title: "Blog published",
        description: "Your blog has been published successfully",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast({
        title: "Failed to publish",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 mt-16">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="text-2xl font-bold border-none p-0 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            
            <div className="min-h-[400px] rounded-md border">
              {typeof window !== "undefined" && (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                  className="h-[400px] overflow-y-auto"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Tags</p>
              <InputTags
                value={tags}
                onChange={setTags}
                placeholder="Add tags (press Enter or comma to add)"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Tags help readers discover your content
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {lastSaved && (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                )}
                {isSaving && (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Saving...
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => saveDraft()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !title || !content}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}