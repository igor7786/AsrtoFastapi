import { Button } from '@rcomp/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@rcomp/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@rcomp/theme-toggle-button/ThemeModeToogle';
import { navigate } from 'astro:transitions/client';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import LogoutButton from '@rcomp/LogoutButton';
import type { User } from '@db/types';
import { $nanoUser } from '@/lib/stores/user';
import Link from 'astro-typesafe-routes/link/react';
type NavbarProps = {
  user: User | null;
};
const navLinks = [
  {
    href: '#about',
    label: 'About',
  },
  {
    href: '#features',
    label: 'Features',
  },
  {
    href: '#ready',
    label: 'Ready',
  },
];
const Navbar = ({ user }: NavbarProps) => {
  $nanoUser.set(user);
  const [active, setActive] = useState<string | null>('#about');
  const [isUser, setIsUser] = useState<User | null>(user);
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    navigate('/#about', { history: 'replace' });
  }, []); // empty dependency array → runs once on mount
  // Handle clicks outside the nav container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActive(null); // reset active link
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <nav className="animate-fade-in border-border/50 bg-background/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient">Apex</span>
          </div>
          {/* Desktop Navigation */}
          <div ref={navRef} className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to="/"
                hash={link.href}
                onClick={() => setActive(link.href)}
                className={`text-sm transition-colors ${
                  active === link.href
                    ? 'text-foreground underline decoration-emerald-500 underline-offset-8'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {isUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm leading-none font-medium">Hello {isUser.name}</span>
              </div>
            ) : null}
            {isUser ? (
              <LogoutButton />
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="text-primary-foreground bg-emerald-700 md:inline-flex"
              >
                Login
              </Button>
            )}
            <ModeToggle className="hidden md:inline-flex" />
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background w-70">
                <SheetTitle className="sr-only">Mobile navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation links for the mobile menu.
                </SheetDescription>

                <nav ref={navRef} className="mt-8 flex flex-col items-center justify-center gap-6">
                  <ModeToggle className="mx-auto pt-4" />

                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to="/"
                      hash={link.href}
                      onClick={() => setActive(link.href)}
                      className={`text-sm transition-colors ${
                        active === link.href
                          ? 'text-foreground underline decoration-emerald-500 underline-offset-8'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <Button className="bg-primary text-primary-foreground mx-auto mt-4 hover:opacity-90">
                    Get Started
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </ThemeProvider>
  );
};
export default Navbar;
