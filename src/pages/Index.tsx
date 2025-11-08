import { Link } from "react-router-dom";
import { Construction, Calculator, MessageCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-construction.jpg";

const Index = () => {
  return (
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
              Your Dream Home,<br />
              <span className="text-primary">Calculated Right</span> 🏡
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every Brick. Every Bag. Explained Clearly.
            </p>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-4xl mt-8 animate-bounce-in">
            <img
              src={heroImage}
              alt="Construction site with workers, crane, and building materials"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
            <Link to="/project-details" className="flex-1">
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
            <div className="card-soft text-left space-y-3 slide-up">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Accurate Estimates</h3>
              <p className="text-muted-foreground text-sm">
                Get precise cost breakdowns for materials, labor, and finishes based on your location.
              </p>
            </div>

            <div className="card-soft text-left space-y-3 slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Learn As You Build</h3>
              <p className="text-muted-foreground text-sm">
                Educational tooltips and explanations help you understand every material and process.
              </p>
            </div>

            <div className="card-soft text-left space-y-3 slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-construction-green/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-construction-green" />
              </div>
              <h3 className="text-lg font-semibold">Save & Compare</h3>
              <p className="text-muted-foreground text-sm">
                Save multiple estimates, compare options, and export detailed PDF reports.
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
  );
};

export default Index;
