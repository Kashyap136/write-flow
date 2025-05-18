import { Navbar } from "@/components/layout/navbar";
import { BlogEditor } from "@/components/blog/editor";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogEditor />
    </div>
  );
}