import { Navbar } from "@/components/layout/navbar";
import { BlogList } from "@/components/blog/blog-list";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogList />
    </div>
  );
}