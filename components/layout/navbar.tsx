"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth-context";
import {
  BookText,
  Edit3,
  LogOut,
  Menu,
  PenSquare,
  User,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BookText className="h-4 w-4 mr-2" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/editor",
      label: "New Post",
      icon: <PenSquare className="h-4 w-4 mr-2" />,
      active: pathname === "/editor",
    },
  ];

  const navbarBg = isScrolled
    ? "bg-background/70 backdrop-blur-lg border-b"
    : "bg-background/0";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold flex items-center text-primary"
            >
              <Edit3 className="h-6 w-6 mr-2" />
              BlogEditor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      link.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            <ModeToggle />

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" /> Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      link.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            <div className="flex items-center justify-between px-3 py-2">
              <ModeToggle />

              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" /> Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}