import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Edit3 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">BlogEditor</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>
          
          <AuthForm />
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlogEditor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}