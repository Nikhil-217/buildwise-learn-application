import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { EducationalTooltip } from "@/components/EducationalTooltip";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState([1]);
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [kitchens, setKitchens] = useState("");
  const [quality, setQuality] = useState("standard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage or context
    const projectData = {
      location,
      area: parseFloat(area),
      floors: floors[0],
      rooms: parseInt(rooms),
      bathrooms: parseInt(bathrooms),
      kitchens: parseInt(kitchens),
      quality,
    };
    localStorage.setItem("currentProject", JSON.stringify(projectData));
    navigate("/materials");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Project Details</h1>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-6">
        <ProgressIndicator currentStep={1} totalSteps={5} />
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 pb-12">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Location */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <Label htmlFor="location" className="text-lg font-semibold">
                Location
              </Label>
              <EducationalTooltip content="Your project location helps us provide accurate material costs and local rates." />
            </div>
            <Select value={location} onValueChange={setLocation} required>
              <SelectTrigger id="location" className="h-12">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div className="card-soft space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2">
              <Label htmlFor="area" className="text-lg font-semibold">
                Total Built-Up Area
              </Label>
              <EducationalTooltip content="Total built-up space in square feet. This includes all floors and covered areas." />
            </div>
            <div className="relative">
              <Input
                id="area"
                type="number"
                placeholder="e.g., 1500"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="h-12 pr-16"
                required
                min="100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                sq.ft
              </span>
            </div>
          </div>

          {/* Floors */}
          <div className="card-soft space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2">
              <Label className="text-lg font-semibold">Number of Floors</Label>
              <EducationalTooltip content="Ground floor counts as 1. A ground + first floor building = 2 floors." />
            </div>
            <div className="space-y-4">
              <Slider
                value={floors}
                onValueChange={setFloors}
                min={1}
                max={4}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 Floor</span>
                <span className="font-semibold text-primary text-lg">{floors[0]} Floor{floors[0] > 1 ? 's' : ''}</span>
                <span>4 Floors</span>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="card-soft space-y-3">
              <Label htmlFor="rooms" className="text-sm font-medium">
                Bedrooms
              </Label>
              <Input
                id="rooms"
                type="number"
                placeholder="e.g., 3"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="card-soft space-y-3">
              <Label htmlFor="bathrooms" className="text-sm font-medium">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="e.g., 2"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="card-soft space-y-3">
              <Label htmlFor="kitchens" className="text-sm font-medium">
                Kitchens
              </Label>
              <Input
                id="kitchens"
                type="number"
                placeholder="e.g., 1"
                value={kitchens}
                onChange={(e) => setKitchens(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          {/* Quality Type */}
          <div className="card-soft space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Label className="text-lg font-semibold">Quality Type</Label>
              <EducationalTooltip content="Quality affects material choices and finishing standards. Standard is recommended for most residential projects." />
            </div>
            <RadioGroup value={quality} onValueChange={setQuality} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="flex-1 cursor-pointer">
                  <div className="font-medium">Basic</div>
                  <div className="text-sm text-muted-foreground">
                    Essential quality, cost-effective materials
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border-2 border-primary rounded-lg bg-primary/5 transition-colors">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                  <div className="font-medium">Standard ⭐</div>
                  <div className="text-sm text-muted-foreground">
                    Balanced quality and cost (Recommended)
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="font-medium">Premium</div>
                  <div className="text-sm text-muted-foreground">
                    High-end materials and superior finishes
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full btn-hero h-14 text-lg group">
            Next: Materials Estimation
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetails;
