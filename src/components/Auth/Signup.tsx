import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    year: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    allowEmergencyContact: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      year: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const benefits = [
    'Access to 24/7 AI mental health support',
    'Book sessions with licensed therapists',
    'Track your mental wellness journey',
    'Access exclusive wellness resources',
    'Connect with peer support community',
    'Completely confidential and secure'
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
                <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center group-hover:shadow-therapeutic transition-therapeutic">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-2xl text-gradient-primary">Neurolink</h1>
                  <p className="text-xs text-muted-foreground">Student Mental Health</p>
                </div>
              </Link>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-poppins font-bold text-foreground">
                  Join Neurolink
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Take the first step towards better mental health with comprehensive support designed specifically for students.
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-lg font-poppins font-semibold text-foreground">
                What you'll get:
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <Card className="therapeutic-card bg-accent/30 border-accent/40">
              <div className="space-y-3">
                <p className="text-accent-foreground italic">
                  "Neurolink helped me manage my anxiety during finals week. The AI support was available when I needed it most, and booking a session with a therapist was so easy."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-accent-foreground">Sarah K.</p>
                    <p className="text-sm text-muted-foreground">Psychology Major, Class of 2024</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Signup Form */}
          <div className="space-y-6">
            <Card className="therapeutic-card">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-poppins font-bold text-foreground mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-muted-foreground">
                    All information is kept strictly confidential
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Student Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="your.email@university.edu"
                    />
                  </div>
                </div>

                {/* Student ID and Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="studentId" className="text-sm font-medium text-foreground">
                      Student ID *
                    </label>
                    <Input
                      id="studentId"
                      name="studentId"
                      type="text"
                      required
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="Student ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="year" className="text-sm font-medium text-foreground">
                      Academic Year *
                    </label>
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freshman">Freshman</SelectItem>
                        <SelectItem value="sophomore">Sophomore</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="(Optional) For emergency contact"
                    />
                  </div>
                </div>

                {/* Family Details Section */}
                <div className="space-y-4 p-4 bg-accent/20 rounded-xl border border-accent/30">
                  <h4 className="text-lg font-semibold text-primary mb-3">Family & Emergency Contact Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="parentGuardianName" className="text-sm font-medium text-foreground">
                        Parent/Guardian Name *
                      </label>
                      <Input
                        id="parentGuardianName"
                        name="parentGuardianName"
                        type="text"
                        required
                        placeholder="Enter parent/guardian name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="relationship" className="text-sm font-medium text-foreground">
                        Relationship *
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="emergencyContact" className="text-sm font-medium text-foreground">
                        Emergency Contact Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          type="tel"
                          required
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="familyAddress" className="text-sm font-medium text-foreground">
                        Family Address
                      </label>
                      <Input
                        id="familyAddress"
                        name="familyAddress"
                        type="text"
                        placeholder="Enter family address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="courseProgram" className="text-sm font-medium text-foreground">
                      Course/Program *
                    </label>
                    <Input
                      id="courseProgram"
                      name="courseProgram"
                      type="text"
                      required
                      placeholder="e.g., Computer Science, Psychology"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="medicalHistory" className="text-sm font-medium text-foreground">
                      Relevant Medical/Mental Health History <span className="text-muted-foreground">(Optional & Confidential)</span>
                    </label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      className="w-full h-20 px-3 py-2 border border-input bg-background rounded-lg text-sm resize-none transition-therapeutic focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Any relevant medical or mental health information that might help our support team provide better care..."
                    />
                    <p className="text-xs text-muted-foreground">This information is encrypted and only accessible to licensed professionals when needed.</p>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        placeholder="Create a secure password"
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

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="allowEmergencyContact"
                      checked={formData.allowEmergencyContact}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, allowEmergencyContact: checked as boolean }))
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="allowEmergencyContact" className="text-sm text-muted-foreground cursor-pointer">
                      I consent to be contacted in case of mental health emergency
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="therapeutic"
                  className="w-full font-semibold py-3 text-base"
                  size="lg"
                  disabled={!formData.agreeToTerms}
                >
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Card>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
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
      </div>
    </div>
  );
};

export default Signup;