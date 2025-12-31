import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@assets/IMG_2935_1766607954733.jpeg";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/programs", label: "Service Programs" },
    { href: "/events", label: "Events & News" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="p-1 rounded-full group-hover:bg-primary/5 transition-colors">
              <img src={logoImg} alt="Maranatha SDA Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-primary tracking-tight">Maranatha SDA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "text-sm font-medium transition-colors hover:text-primary cursor-pointer px-3 py-2 rounded-md",
                  location === link.href ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <div className="px-4 py-4 space-y-2 bg-white">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div 
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer",
                      location === link.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
