import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Lightbulb, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Labor = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [learnMode, setLearnMode] = useState(false);
  
  // Labor costs (daily wages)
  const [laborWages, setLaborWages] = useState({
    mason: [800],
    helper: [600],
    carpenter: [900],
    days: 60,
  });

  // Service costs (per floor or per unit)
  const [serviceCosts, setServiceCosts] = useState({
    electricalPerFloor: [15000],
    plumbingPerUnit: [8000],
    paintingPerFloor: [12000],
  });

  // Materials
  const [materials, setMaterials] = useState({
    electricalWire: { quantity: 0, rate: 15, cost: 0 }, // per meter
    electricalSwitches: { quantity: 0, rate: 150, cost: 0 }, // per piece
    pipes: { quantity: 0, rate: 80, cost: 0 }, // per meter
    sanitaryFittings: { quantity: 0, rate: 3000, cost: 0 }, // per set
    paintBuckets: { quantity: 0, rate: 2500, cost: 0 }, // per 20L bucket
    tileAdhesive: { quantity: 0, rate: 400, cost: 0 }, // per bag
    tileGrout: { quantity: 0, rate: 350, cost: 0 }, // per bag
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

    // Auto-calculate material quantities based on project data
    if (data) {
      const floors = data.floors || 1;
      const totalBathrooms = data.totalBathrooms || 0;
      const totalKitchens = data.totalKitchens || 0;
      const area = data.area || 0;

      setMaterials({
        electricalWire: { quantity: floors * 200, rate: 15, cost: floors * 200 * 15 },
        electricalSwitches: { quantity: floors * 20, rate: 150, cost: floors * 20 * 150 },
        pipes: { quantity: (totalBathrooms + totalKitchens) * 30, rate: 80, cost: (totalBathrooms + totalKitchens) * 30 * 80 },
        sanitaryFittings: { quantity: totalBathrooms + totalKitchens, rate: 3000, cost: (totalBathrooms + totalKitchens) * 3000 },
        paintBuckets: { quantity: Math.ceil(area / 150), rate: 2500, cost: Math.ceil(area / 150) * 2500 },
        tileAdhesive: { quantity: Math.ceil(area / 80), rate: 400, cost: Math.ceil(area / 80) * 400 },
        tileGrout: { quantity: Math.ceil(area / 100), rate: 350, cost: Math.ceil(area / 100) * 350 },
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (!projectData) return;
    
    const floors = projectData.floors || 1;
    const totalBathrooms = projectData.totalBathrooms || 0;
    const totalKitchens = projectData.totalKitchens || 0;

    // Labor cost calculation
    const laborTotal = 
      (laborWages.mason[0] + laborWages.helper[0] + laborWages.carpenter[0]) * laborWages.days;

    // Service costs
    const electricalTotal = serviceCosts.electricalPerFloor[0] * floors;
    const plumbingTotal = serviceCosts.plumbingPerUnit[0] * (totalBathrooms + totalKitchens);
    const paintingTotal = serviceCosts.paintingPerFloor[0] * floors;

    // Material costs
    const materialTotal = Object.values(materials).reduce((sum, mat) => sum + mat.cost, 0);

    const newTotal = laborTotal + electricalTotal + plumbingTotal + paintingTotal + materialTotal;
    setTotal(newTotal);
  }, [laborWages, serviceCosts, materials, projectData]);

  const handleSubmit = () => {
    const savedData = { 
      ...projectData, 
      laborWages,
      serviceCosts,
      materials,
      laborTotal: total 
    };
    localStorage.setItem("currentProject", JSON.stringify(savedData));
    navigate("/results");
  };

  const updateMaterial = (key: string, field: 'quantity' | 'rate', value: number) => {
    setMaterials(prev => {
      const updated = { ...prev };
      updated[key as keyof typeof materials] = {
        ...updated[key as keyof typeof materials],
        [field]: value,
        cost: field === 'quantity' 
          ? value * updated[key as keyof typeof materials].rate
          : updated[key as keyof typeof materials].quantity * value
      };
      return updated;
    });
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
    max,
    suffix = ""
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
          <p className="text-sm text-muted-foreground">{suffix}</p>
          <p className="text-2xl font-bold text-primary">₹{value[0]}</p>
        </div>
      </div>

      {learnMode && educational && (
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
          step={100}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{min}</span>
          <span>₹{max}</span>
        </div>
      </div>
    </div>
  );

  const MaterialRow = ({ 
    title, 
    unit, 
    quantity, 
    rate, 
    cost, 
    onQuantityChange, 
    onRateChange 
  }: any) => (
    <div className="grid grid-cols-12 gap-3 items-center py-3 border-b last:border-0">
      <div className="col-span-4">
        <p className="font-medium text-sm">{title}</p>
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
          className="h-9 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">{unit}</p>
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={rate}
          onChange={(e) => onRateChange(parseInt(e.target.value) || 0)}
          className="h-9 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">₹/{unit}</p>
      </div>
      <div className="col-span-4 text-right">
        <p className="text-lg font-bold text-primary">₹{cost.toLocaleString('en-IN')}</p>
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
                <p className="text-sm opacity-75 mt-1">
                  {projectData.floors} floors • {projectData.totalBathrooms} bathrooms • {projectData.totalKitchens} kitchens
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-black/10 px-4 py-2 rounded-lg">
                <Lightbulb className="w-4 h-4" />
                <span>Adjust below</span>
              </div>
            </div>
          </div>

          {/* Daily Wages Section */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">👷</div>
              <div>
                <h3 className="font-semibold text-lg">Daily Labor Wages</h3>
                <p className="text-sm text-muted-foreground">Skilled workers and helpers</p>
              </div>
            </div>

            {learnMode && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 text-sm animate-fade-in mb-4">
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">
                    Labor cost = Daily wage × Number of working days. Typical construction takes 60-120 days depending on size and complexity.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Mason/Day</Label>
                  <Slider
                    value={laborWages.mason}
                    onValueChange={(val) => setLaborWages(prev => ({ ...prev, mason: val }))}
                    min={600}
                    max={1200}
                    step={50}
                    className="py-4"
                  />
                  <p className="text-center text-lg font-bold text-primary">₹{laborWages.mason[0]}</p>
                </div>
                <div>
                  <Label className="text-sm">Helper/Day</Label>
                  <Slider
                    value={laborWages.helper}
                    onValueChange={(val) => setLaborWages(prev => ({ ...prev, helper: val }))}
                    min={400}
                    max={800}
                    step={50}
                    className="py-4"
                  />
                  <p className="text-center text-lg font-bold text-primary">₹{laborWages.helper[0]}</p>
                </div>
                <div>
                  <Label className="text-sm">Carpenter/Day</Label>
                  <Slider
                    value={laborWages.carpenter}
                    onValueChange={(val) => setLaborWages(prev => ({ ...prev, carpenter: val }))}
                    min={700}
                    max={1500}
                    step={50}
                    className="py-4"
                  />
                  <p className="text-center text-lg font-bold text-primary">₹{laborWages.carpenter[0]}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm">Total Working Days</Label>
                <Input
                  type="number"
                  value={laborWages.days}
                  onChange={(e) => setLaborWages(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                  className="w-full mt-2"
                />
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Labor Cost</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{((laborWages.mason[0] + laborWages.helper[0] + laborWages.carpenter[0]) * laborWages.days).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Electrical Work */}
          <LaborSection
            title="Electrical Work"
            icon="⚡"
            description={`Per floor (${projectData.floors} floors)`}
            educational="Includes wiring, electrical board, switches, light points, and fan points. Cost multiplied by number of floors."
            value={serviceCosts.electricalPerFloor}
            onChange={(val: number[]) => setServiceCosts(prev => ({ ...prev, electricalPerFloor: val }))}
            min={10000}
            max={30000}
            suffix="per floor"
          />

          {/* Electrical Materials */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔌</div>
              <div>
                <h3 className="font-semibold text-lg">Electrical Materials</h3>
                <p className="text-sm text-muted-foreground">Wires, switches, and fittings</p>
              </div>
            </div>
            <MaterialRow
              title="Electrical Wire"
              unit="meters"
              quantity={materials.electricalWire.quantity}
              rate={materials.electricalWire.rate}
              cost={materials.electricalWire.cost}
              onQuantityChange={(val: number) => updateMaterial('electricalWire', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('electricalWire', 'rate', val)}
            />
            <MaterialRow
              title="Switches & Boards"
              unit="pieces"
              quantity={materials.electricalSwitches.quantity}
              rate={materials.electricalSwitches.rate}
              cost={materials.electricalSwitches.cost}
              onQuantityChange={(val: number) => updateMaterial('electricalSwitches', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('electricalSwitches', 'rate', val)}
            />
          </div>

          {/* Plumbing */}
          <LaborSection
            title="Plumbing"
            icon="🚰"
            description={`Per unit (${projectData.totalBathrooms + projectData.totalKitchens} units)`}
            educational="Includes water supply, drainage, and sanitary work. Cost per bathroom/kitchen combined."
            value={serviceCosts.plumbingPerUnit}
            onChange={(val: number[]) => setServiceCosts(prev => ({ ...prev, plumbingPerUnit: val }))}
            min={5000}
            max={15000}
            suffix="per unit"
          />

          {/* Plumbing Materials */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚿</div>
              <div>
                <h3 className="font-semibold text-lg">Plumbing Materials</h3>
                <p className="text-sm text-muted-foreground">Pipes and fittings</p>
              </div>
            </div>
            <MaterialRow
              title="PVC/CPVC Pipes"
              unit="meters"
              quantity={materials.pipes.quantity}
              rate={materials.pipes.rate}
              cost={materials.pipes.cost}
              onQuantityChange={(val: number) => updateMaterial('pipes', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('pipes', 'rate', val)}
            />
            <MaterialRow
              title="Sanitary Fittings"
              unit="sets"
              quantity={materials.sanitaryFittings.quantity}
              rate={materials.sanitaryFittings.rate}
              cost={materials.sanitaryFittings.cost}
              onQuantityChange={(val: number) => updateMaterial('sanitaryFittings', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('sanitaryFittings', 'rate', val)}
            />
          </div>

          {/* Painting */}
          <LaborSection
            title="Painting"
            icon="🎨"
            description={`Per floor (${projectData.floors} floors)`}
            educational="Includes primer, putty, and paint for interior/exterior. Premium paints cost more."
            value={serviceCosts.paintingPerFloor}
            onChange={(val: number[]) => setServiceCosts(prev => ({ ...prev, paintingPerFloor: val }))}
            min={8000}
            max={25000}
            suffix="per floor"
          />

          {/* Painting Materials */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🪣</div>
              <div>
                <h3 className="font-semibold text-lg">Painting Materials</h3>
                <p className="text-sm text-muted-foreground">Paint, primer, and putty</p>
              </div>
            </div>
            <MaterialRow
              title="Paint Buckets (20L)"
              unit="buckets"
              quantity={materials.paintBuckets.quantity}
              rate={materials.paintBuckets.rate}
              cost={materials.paintBuckets.cost}
              onQuantityChange={(val: number) => updateMaterial('paintBuckets', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('paintBuckets', 'rate', val)}
            />
          </div>

          {/* Tile Chemicals */}
          <div className="card-soft space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🧪</div>
              <div>
                <h3 className="font-semibold text-lg">Tile Installation Materials</h3>
                <p className="text-sm text-muted-foreground">Adhesive and grout for tiles</p>
              </div>
            </div>
            <MaterialRow
              title="Tile Adhesive"
              unit="bags"
              quantity={materials.tileAdhesive.quantity}
              rate={materials.tileAdhesive.rate}
              cost={materials.tileAdhesive.cost}
              onQuantityChange={(val: number) => updateMaterial('tileAdhesive', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('tileAdhesive', 'rate', val)}
            />
            <MaterialRow
              title="Tile Grout"
              unit="bags"
              quantity={materials.tileGrout.quantity}
              rate={materials.tileGrout.rate}
              cost={materials.tileGrout.cost}
              onQuantityChange={(val: number) => updateMaterial('tileGrout', 'quantity', val)}
              onRateChange={(val: number) => updateMaterial('tileGrout', 'rate', val)}
            />
          </div>

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
