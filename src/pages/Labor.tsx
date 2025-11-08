import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Lightbulb, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Labor = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [learnMode, setLearnMode] = useState(false);
  
  const [laborCosts, setLaborCosts] = useState({
    labor: [350],
    electrical: [150],
    plumbing: [120],
    painting: [50],
    flooring: [100],
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("currentProject");
    if (!saved) {
      toast.error("Please complete materials estimation first");
      navigate("/materials");
      return;
    }
    const data = JSON.parse(saved);
    setProjectData(data);
  }, [navigate]);

  useEffect(() => {
    if (!projectData) return;
    const area = projectData.area;
    const newTotal = 
      laborCosts.labor[0] * area +
      laborCosts.electrical[0] * area +
      laborCosts.plumbing[0] * area +
      laborCosts.painting[0] * area +
      laborCosts.flooring[0] * area;
    setTotal(newTotal);
  }, [laborCosts, projectData]);

  const handleSubmit = () => {
    const savedData = { ...projectData, laborCosts, laborTotal: total };
    localStorage.setItem("currentProject", JSON.stringify(savedData));
    navigate("/results");
  };

  if (!projectData) return null;

  const LaborSection = ({ 
    title, 
    icon, 
    description, 
    educational, 
    value, 
    onChange, 
    min, 
    max 
  }: any) => (
    <div className="card-soft space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Per sq.ft</p>
          <p className="text-2xl font-bold text-primary">₹{value[0]}</p>
        </div>
      </div>

      {learnMode && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 text-sm animate-fade-in">
          <div className="flex gap-2">
            <Lightbulb className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-foreground">{educational}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Slider
          value={value}
          onValueChange={onChange}
          min={min}
          max={max}
          step={10}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{min}</span>
          <span className="font-semibold text-primary">
            Total: ₹{(value[0] * projectData.area).toLocaleString('en-IN')}
          </span>
          <span>₹{max}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Labor & Finishing</h1>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="learn-mode" className="text-sm cursor-pointer flex items-center gap-2">
                {learnMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                Learn Mode
              </Label>
              <Switch id="learn-mode" checked={learnMode} onCheckedChange={setLearnMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <ProgressIndicator currentStep={3} totalSteps={5} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Live Total */}
          <div className="card-elevated bg-gradient-to-br from-secondary to-secondary-light text-secondary-foreground p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Labor & Finishing Total</p>
                <p className="text-4xl font-bold count-up">₹{(total / 100000).toFixed(2)}L</p>
                <p className="text-sm opacity-75 mt-1">For {projectData.area} sq.ft</p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-black/10 px-4 py-2 rounded-lg">
                <Lightbulb className="w-4 h-4" />
                <span>Adjust rates below</span>
              </div>
            </div>
          </div>

          <LaborSection
            title="General Labor"
            icon="👷"
            description="Masons, helpers, carpenters, and site workers"
            educational="Labor includes skilled masons for brickwork, plastering, and carpentry. Helpers assist in material handling. Premium projects need more skilled workers."
            value={laborCosts.labor}
            onChange={(val: number[]) => setLaborCosts(prev => ({ ...prev, labor: val }))}
            min={250}
            max={500}
          />

          <LaborSection
            title="Electrical Work"
            icon="⚡"
            description="Wiring, switches, fixtures, and electrical fittings"
            educational="Includes internal and external wiring, electrical board, switches, light points, and fan points. Premium finishing requires more circuits and points."
            value={laborCosts.electrical}
            onChange={(val: number[]) => setLaborCosts(prev => ({ ...prev, electrical: val }))}
            min={80}
            max={250}
          />

          <LaborSection
            title="Plumbing"
            icon="🚰"
            description="Water supply, drainage, and sanitary fittings"
            educational="Covers water supply lines, drainage pipes, sanitary fittings, bathroom fixtures. More bathrooms = higher cost. Premium fittings add to expense."
            value={laborCosts.plumbing}
            onChange={(val: number[]) => setLaborCosts(prev => ({ ...prev, plumbing: val }))}
            min={80}
            max={200}
          />

          <LaborSection
            title="Painting"
            icon="🎨"
            description="Interior and exterior painting with primers"
            educational="Includes primer, putty, and 2 coats of paint. Premium paints (Asian Paints Royale) cost more. Texture work increases rates by 20-30%."
            value={laborCosts.painting}
            onChange={(val: number[]) => setLaborCosts(prev => ({ ...prev, painting: val }))}
            min={30}
            max={100}
          />

          <LaborSection
            title="Flooring & Tiling"
            icon="🔲"
            description="Floor tiles, bathroom tiles, and kitchen tiles"
            educational="Basic: Ceramic tiles (₹30-50/sq.ft). Standard: Vitrified tiles (₹50-80/sq.ft). Premium: Marble/granite (₹150+/sq.ft). Labor charges separate."
            value={laborCosts.flooring}
            onChange={(val: number[]) => setLaborCosts(prev => ({ ...prev, flooring: val }))}
            min={50}
            max={250}
          />

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full btn-hero h-14 text-lg group mt-8">
            See Complete Results
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Labor;
