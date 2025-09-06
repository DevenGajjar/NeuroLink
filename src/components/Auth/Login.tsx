import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center group-hover:shadow-therapeutic transition-therapeutic">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl text-gradient-primary">MindCare</h1>
              <p className="text-xs text-muted-foreground">Student Mental Health</p>
            </div>
          </Link>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your mental health support dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="therapeutic-card auth-gradient text-white border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/90">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  placeholder="Enter your student email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <label htmlFor="rememberMe" className="text-sm text-white/90 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-white/90 hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>

        {/* Alternative Actions */}
        <div className="space-y-4">
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="font-medium">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26l5.91-.01c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="font-medium">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.166 1.219-5.166s-.312-.623-.312-1.543c0-1.446.839-2.524 1.883-2.524.888 0 1.317.666 1.317 1.466 0 .893-.568 2.228-.861 3.466-.245 1.035.52 1.88 1.543 1.88 1.851 0 3.275-1.951 3.275-4.768 0-2.494-1.79-4.237-4.346-4.237-2.962 0-4.702 2.218-4.702 4.513 0 .893.343 1.85.771 2.371.085.102.097.191.072.295-.079.328-.254 1.021-.288 1.164-.045.186-.148.225-.342.136-1.275-.593-2.073-2.448-2.073-3.938 0-3.278 2.383-6.288 6.866-6.288 3.606 0 6.045 2.57 6.045 6.004 0 3.583-2.26 6.466-5.395 6.466-1.054 0-2.047-.548-2.387-1.273 0 0-.522 1.988-.649 2.474-.235.898-.869 2.023-1.294 2.707.974.301 2.003.462 3.079.462 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              Microsoft
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Login Section */}
        <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm font-medium text-primary mb-2">
            Administrator Access
          </p>
          <Link
            to="/admin-login"
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors font-medium"
          >
            Admin Login Portal
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Crisis Support */}
        <div className="text-center p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
          <p className="text-sm text-destructive font-medium mb-1">
            Need immediate help?
          </p>
          <p className="text-xs text-muted-foreground">
            Call 988 (Crisis Lifeline) or{' '}
            <Link to="/chat" className="underline font-medium text-primary">
              chat with our AI support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;