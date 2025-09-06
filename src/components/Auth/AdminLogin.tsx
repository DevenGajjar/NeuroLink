import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    // Handle admin login logic here
    console.log('Admin login attempt:', formData);
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-xs text-muted-foreground">Administrator Access</p>
            </div>
          </Link>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Administrator Login
            </h2>
            <p className="text-muted-foreground">
              Secure access to system administration
            </p>
          </div>
        </div>

        {/* Admin Login Form */}
        <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-orange-500/30 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 border-orange-500/30 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Access Admin Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Back to User Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back to User Login
            </Link>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="text-center p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <p className="text-sm text-orange-600 font-medium mb-1">
            🔒 Secure Administrator Access
          </p>
          <p className="text-xs text-muted-foreground">
            This portal is restricted to authorized system administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;