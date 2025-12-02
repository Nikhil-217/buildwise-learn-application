import { Link } from "react-router-dom";
import { Construction, Calculator, MessageCircle, FolderOpen, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import heroImage from "@/assets/hero-construction.jpg";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ projects: 0, savings: 0, accuracy: 0 });

  useEffect(() => {
    setIsVisible(true);
    // Animate stats
    const timer = setTimeout(() => {
      setStats({ projects: 1250, savings: 25, accuracy: 95 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEOHead />
      <PerformanceMonitor />
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary rounded-xl p-3 shadow-lg">
              <Construction className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">BuildWise</h2>
          </div>

          {/* Hero Title */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              AI-Powered Construction<br />
              <span className="text-primary bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Cost Intelligence</span> 🏡
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Smart estimates. Real-time pricing. Educational insights. Build with confidence.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{stats.projects.toLocaleString()}+ Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{stats.accuracy}% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{stats.savings}% Avg Savings</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-4xl mt-8 animate-bounce-in">
            <img
              src={heroImage}
              alt="Modern construction site with AI-powered cost estimation technology"
              className="w-full h-auto rounded-2xl shadow-2xl"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
            <Link to="/project-templates" className="flex-1">
              <Button className="w-full btn-hero group">
                <Calculator className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start New Estimate
              </Button>
            </Link>
            <Link to="/projects" className="flex-1">
              <Button variant="outline" className="w-full btn-secondary group">
                <FolderOpen className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                View Projects
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
            <div className="card-soft text-left space-y-3 slide-up hover:scale-105 transition-transform duration-300">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI-Powered Accuracy</h3>
              <p className="text-muted-foreground text-sm">
                Machine learning algorithms analyze market data for precise cost predictions with 95% accuracy.
              </p>
            </div>

            <div className="card-soft text-left space-y-3 slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.1s" }}>
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Smart Learning Hub</h3>
              <p className="text-muted-foreground text-sm">
                Interactive BuildBot explains materials, processes, and cost optimization strategies.
              </p>
            </div>

            <div className="card-soft text-left space-y-3 slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: "0.2s" }}>
              <div className="bg-construction-green/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-construction-green" />
              </div>
              <h3 className="text-lg font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Enterprise-grade security with encrypted data storage and privacy-first design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating BuildBot Button */}
      <Link to="/buildbot">
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg pulse-gentle bg-secondary hover:bg-secondary-light text-secondary-foreground z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </Link>
      </div>
    </>
  );
};

export default Index;
