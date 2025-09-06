import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, User, Home, Brain, Calendar, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Chat Support', href: '/chat', icon: MessageCircle },
    { name: 'Self Assessment', href: '/assessment', icon: Brain },
    { name: 'Wellness Hub', href: '/wellness', icon: Heart },
    { name: 'Tracking', href: '/mood-tracking', icon: BarChart3 },
    { name: 'Book Session', href: '/booking', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center group-hover:shadow-therapeutic transition-therapeutic">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-poppins font-bold text-xl text-gradient-primary">Neurolink</h1>
              <p className="text-xs text-muted-foreground">Student Mental Health</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-therapeutic",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="therapeutic" size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-therapeutic",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="flex space-x-3 px-4 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="therapeutic" size="sm" className="flex-1" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;