import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { MaterialCard } from "@/components/MaterialCard";
import { toast } from "sonner";

const Materials = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [materials, setMaterials] = useState({
    cement: { quantity: 0, rate: 400, cost: 0 },
    steel: { quantity: 0, rate: 65, cost: 0 },
    sand: { quantity: 0, rate: 50, cost: 0 },
    bricks: { quantity: 0, rate: 6, cost: 0 },
    aggregate: { quantity: 0, rate: 55, cost: 0 },
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("currentProject");
    if (!saved) {
      toast.error("Please complete project details first");
      navigate("/project-details");
      return;
    }
    const data = JSON.parse(saved);
    setProjectData(data);
    
    // Calculate initial quantities based on area
    const area = data.area;
    const qualityMultiplier = data.quality === "basic" ? 0.9 : data.quality === "premium" ? 1.15 : 1;
    
    setMaterials({
      cement: { 
        quantity: Math.round((area * 0.4) * qualityMultiplier), 
        rate: 400, 
        cost: Math.round((area * 0.4) * qualityMultiplier * 400)
      },
      steel: { 
        quantity: Math.round((area * 4) * qualityMultiplier), 
        rate: 65, 
        cost: Math.round((area * 4) * qualityMultiplier * 65)
      },
      sand: { 
        quantity: Math.round((area * 1.5) * qualityMultiplier), 
        rate: 50, 
        cost: Math.round((area * 1.5) * qualityMultiplier * 50)
      },
      bricks: { 
        quantity: Math.round((area * 50) * qualityMultiplier), 
        rate: 6, 
        cost: Math.round((area * 50) * qualityMultiplier * 6)
      },
      aggregate: { 
        quantity: Math.round((area * 1.2) * qualityMultiplier), 
        rate: 55, 
        cost: Math.round((area * 1.2) * qualityMultiplier * 55)
      },
    });
  }, [navigate]);

  useEffect(() => {
    const newTotal = Object.values(materials).reduce((sum, item) => sum + item.cost, 0);
    setTotal(newTotal);
  }, [materials]);

  const updateMaterial = (key: string, field: string, value: number) => {
    setMaterials(prev => {
      const updated = { ...prev };
      (updated as any)[key] = {
        ...(updated as any)[key],
        [field]: value,
        cost: field === 'quantity' 
          ? value * (updated as any)[key].rate 
          : (updated as any)[key].quantity * value
      };
      return updated;
    });
  };

  const handleSubmit = () => {
    const savedData = { ...projectData, materials, materialsTotal: total };
    localStorage.setItem("currentProject", JSON.stringify(savedData));
    navigate("/labor");
  };

  if (!projectData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Materials Estimation</h1>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <ProgressIndicator currentStep={2} totalSteps={5} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Live Total */}
          <div className="card-elevated bg-gradient-to-br from-primary to-primary-light text-primary-foreground p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Materials Total</p>
                <p className="text-4xl font-bold count-up">₹{(total / 100000).toFixed(2)}L</p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-lg">
                <Lightbulb className="w-4 h-4" />
                <span>Updated in real-time</span>
              </div>
            </div>
          </div>

          {/* Material Cards */}
          <MaterialCard
            title="Cement (Bags)"
            icon="🏗️"
            description="Used for concrete and mortar. 1 bag = 50kg."
            educational="Premium cement ensures better strength. Typical consumption: 0.4 bags per sq.ft"
            quantity={materials.cement.quantity}
            rate={materials.cement.rate}
            cost={materials.cement.cost}
            onQuantityChange={(val) => updateMaterial('cement', 'quantity', val)}
            onRateChange={(val) => updateMaterial('cement', 'rate', val)}
            unit="bags"
            rateUnit="₹/bag"
          />

          <MaterialCard
            title="Steel (kg)"
            icon="🔩"
            description="Reinforcement steel bars for structural strength."
            educational="TMT bars are stronger and earthquake-resistant. Standard: 4kg per sq.ft"
            quantity={materials.steel.quantity}
            rate={materials.steel.rate}
            cost={materials.steel.cost}
            onQuantityChange={(val) => updateMaterial('steel', 'quantity', val)}
            onRateChange={(val) => updateMaterial('steel', 'rate', val)}
            unit="kg"
            rateUnit="₹/kg"
          />

          <MaterialCard
            title="Sand (Cubic ft)"
            icon="🏖️"
            description="Fine sand for plastering and concrete mixing."
            educational="River sand is preferred. M-sand is eco-friendly alternative. ~1.5 cft per sq.ft"
            quantity={materials.sand.quantity}
            rate={materials.sand.rate}
            cost={materials.sand.cost}
            onQuantityChange={(val) => updateMaterial('sand', 'quantity', val)}
            onRateChange={(val) => updateMaterial('sand', 'rate', val)}
            unit="cft"
            rateUnit="₹/cft"
          />

          <MaterialCard
            title="Bricks"
            icon="🧱"
            description="Standard red clay bricks for walls."
            educational="1 lorry ≈ 5000 bricks. Fly-ash bricks are eco-friendly and save 15%. ~50 bricks/sq.ft"
            quantity={materials.bricks.quantity}
            rate={materials.bricks.rate}
            cost={materials.bricks.cost}
            onQuantityChange={(val) => updateMaterial('bricks', 'quantity', val)}
            onRateChange={(val) => updateMaterial('bricks', 'rate', val)}
            unit="nos"
            rateUnit="₹/brick"
          />

          <MaterialCard
            title="Aggregate (Cubic ft)"
            icon="🪨"
            description="Coarse aggregate (gravel/crushed stone) for concrete."
            educational="20mm & 40mm sizes mixed for best concrete. Required: 1.2 cft per sq.ft"
            quantity={materials.aggregate.quantity}
            rate={materials.aggregate.rate}
            cost={materials.aggregate.cost}
            onQuantityChange={(val) => updateMaterial('aggregate', 'quantity', val)}
            onRateChange={(val) => updateMaterial('aggregate', 'rate', val)}
            unit="cft"
            rateUnit="₹/cft"
          />

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full btn-hero h-14 text-lg group mt-8">
            Next: Labor & Finishing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Materials;
