"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  MoreHorizontal, 
  Trash, 
  Loader2,
  FileEdit,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
  };
  onDelete: (id: string) => void;
}

export function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/blogs/${blog._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }

        toast({
          title: "Blog deleted",
          description: "Your blog has been deleted successfully",
        });
        
        onDelete(blog._id);
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast({
          title: "Failed to delete",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Truncate content for preview by removing HTML tags
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const preview = stripHtml(blog.content).substring(0, 120) + 
    (stripHtml(blog.content).length > 120 ? "..." : "");

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-4">
            {blog.status === "draft" ? (
              <Badge variant="outline" className="mr-2">
                <FileEdit className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            ) : (
              <Badge variant="secondary" className="mr-2">
                <FileText className="h-3 w-3 mr-1" />
                Published
              </Badge>
            )}
            <p className="text-xs text-muted-foreground">
              Updated {format(new Date(blog.updatedAt), "MMM d, yyyy")}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/editor/${blog._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Link href={`/editor/${blog._id}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {blog.title || "Untitled"}
          </h2>
        </Link>
        
        <p className="text-muted-foreground mb-4">{preview}</p>
        
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {blog.tags.length === 0 && (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/editor/${blog._id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}