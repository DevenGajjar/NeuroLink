import { MessageCircle, Brain, Heart, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-banner.jpg';

const Homepage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "24/7 AI-guided support for immediate help with stress, anxiety, and mental health concerns.",
      href: "/chat",
      variant: "chat" as const,
    },
    {
      icon: Brain,
      title: "Self Assessment",
      description: "Interactive quizzes to assess your mental health and get personalized recommendations.",
      href: "/assessment",
      variant: "therapeutic" as const,
    },
    {
      icon: Heart,
      title: "Wellness Hub",
      description: "Calming music, guided meditation, breathing exercises, and wellness resources.",
      href: "/wellness",
      variant: "calm" as const,
    },
    {
      icon: Calendar,
      title: "Book Sessions",
      description: "Schedule appointments with on-campus therapists using our movie-style booking system.",
      href: "/booking",
      variant: "floating" as const,
    },
  ];

  const stats = [
    { number: "24/7", label: "Support Available" },
    { number: "100%", label: "Confidential" },
    { number: "500+", label: "Students Helped" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Clean professional background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-calm opacity-95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-[0.9] tracking-tight">
                Your AI Partner for<br />
                <span className="text-gradient-hero">Mental Wellness and Growth</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                Neurolink is your AI-powered companion for mental wellness and personalized learning. 
                Designed to support, guide, and help you thrive—academically and emotionally.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                variant="default"
                size="xl"
                className="min-w-72 h-16 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary-dark shadow-therapeutic hover:shadow-glow transition-all duration-300"
              >
                <Link to="/chat">
                  <MessageCircle className="w-7 h-7" />
                  Get Started Today
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-w-56 h-14 text-base font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-soft"
              >
                <Link to="/assessment">
                  <Brain className="w-6 h-6" />
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Shield className="w-5 h-5" />
              <span className="text-sm">100% Confidential & secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-calm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-glass"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-glow/5 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-accent-foreground mb-4">
              Trusted by Students Worldwide
            </h2>
            <div className="w-24 h-1 bg-gradient-glow mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
                </div>
                <div className="text-sm md:text-base text-accent-foreground/80 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(96,179,173,0.03),transparent_70%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              ✨ Comprehensive Support Ecosystem
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight">
              Your Complete Mental
              <span className="block bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience a revolutionary approach to student mental health with our integrated platform 
              combining AI guidance, professional therapy, and personalized wellness resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Glassmorphism card */}
                <div className="relative p-8 rounded-3xl bg-gradient-glass backdrop-blur-sm border border-white/20 shadow-large hover:shadow-therapeutic transition-all duration-500 hover:-translate-y-2">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-glow opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-playfair font-bold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    <Button
                      asChild
                      variant={feature.variant}
                      size="lg"
                      className="w-full font-semibold shadow-soft hover:shadow-medium transition-all duration-300"
                    >
                      <Link to={feature.href}>
                        Explore {feature.title}
                        <div className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-gradient-glass"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-glow/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary-glow/10 rounded-full blur-xl animate-pulse-gentle"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
              🚀 Transform Your Mental Wellness Today
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight">
              Ready to Experience the
              <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                Future of Mental Health?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Join thousands of students who have revolutionized their mental wellness journey with our 
              comprehensive AI-powered platform designed specifically for your success.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="therapeutic" 
              size="xl" 
              className="min-w-64 h-16 text-lg font-semibold shadow-glow hover:shadow-therapeutic bg-white text-primary hover:bg-white/90 transition-all duration-300"
              asChild
            >
              <Link to="/assessment">
                <Brain className="w-6 h-6" />
                Begin Your Journey
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="xl" 
              className="min-w-56 h-16 text-lg font-medium bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 shadow-large"
              asChild
            >
              <Link to="/wellness">
                <Heart className="w-6 h-6" />
                Explore Wellness
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-white text-sm drop-shadow-md">
            <Shield className="w-5 h-5" />
            <span>100% Private & Secure</span>
            <span className="w-1 h-1 bg-white/70 rounded-full"></span>
            <span>HIPAA Compliant</span>
            <span className="w-1 h-1 bg-white/70 rounded-full"></span>
            <span>Student-First Design</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;