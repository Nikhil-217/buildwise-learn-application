import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Lightbulb, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { MaterialCard } from "@/components/MaterialCard";
import { Slider } from "@/components/ui/slider";
import { SmartWarnings } from "@/components/SmartWarnings";
import { toast } from "sonner";

const Materials = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [materials, setMaterials] = useState({
    cement: { quantity: 0, rate: 378, cost: 0 },
    steel: { quantity: 0, rate: 59, cost: 0 },
    sand: { quantity: 0, rate: 1200, cost: 0 },
    bricks: { quantity: 0, rate: 8, cost: 0 },
    aggregate: { quantity: 0, rate: 1500, cost: 0 },
    tiles: { quantity: 0, rate: 60, cost: 0 },
    carpentry: { quantity: 1, rate: 166400, cost: 166400 },
    plumbing: { quantity: 1, rate: 83200, cost: 83200 },
    electrical: { quantity: 1, rate: 62400, cost: 62400 },
    paints: { quantity: 1, rate: 83200, cost: 83200 },
    transport: { quantity: 1, rate: 25000, cost: 25000 },
  });
  const [total, setTotal] = useState(0);
  const [originalMaterials, setOriginalMaterials] = useState<any>(null);
  const [bulkAdjustment, setBulkAdjustment] = useState(100);

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
    
    const calculatedMaterials = {
      cement: { 
        quantity: Math.round((area * 0.49) * qualityMultiplier), 
        rate: 378, 
        cost: Math.round((area * 0.49) * qualityMultiplier * 378)
      },
      steel: { 
        quantity: Math.round((area * 2.6) * qualityMultiplier), 
        rate: 59, 
        cost: Math.round((area * 2.6) * qualityMultiplier * 59)
      },
      sand: { 
        quantity: Math.round((area * 0.128) * qualityMultiplier), 
        rate: 1200, 
        cost: Math.round((area * 0.128) * qualityMultiplier * 1200)
      },
      bricks: { 
        quantity: Math.round((area * 35) * qualityMultiplier), 
        rate: 8, 
        cost: Math.round((area * 35) * qualityMultiplier * 8)
      },
      aggregate: { 
        quantity: Math.round((area * 0.051) * qualityMultiplier), 
        rate: 1500, 
        cost: Math.round((area * 0.051) * qualityMultiplier * 1500)
      },
      tiles: {
        quantity: Math.round((area * 2.56) * qualityMultiplier),
        rate: 60,
        cost: Math.round((area * 2.56) * qualityMultiplier * 60)
      },
      carpentry: {
        quantity: 1,
        rate: Math.round(area * 123),
        cost: Math.round(area * 123)
      },
      plumbing: {
        quantity: 1,
        rate: Math.round(area * 62),
        cost: Math.round(area * 62)
      },
      electrical: {
        quantity: 1,
        rate: Math.round(area * 46),
        cost: Math.round(area * 46)
      },
      paints: {
        quantity: 1,
        rate: Math.round(area * 62),
        cost: Math.round(area * 62)
      },
      transport: {
        quantity: 1,
        rate: Math.round(area * 18),
        cost: Math.round(area * 18)
      },
    };
    
    setMaterials(calculatedMaterials);
    setOriginalMaterials(calculatedMaterials);
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
      
      // Auto-save to localStorage
      setTimeout(() => {
        const savedData = { ...projectData, materials: updated, materialsTotal: Object.values(updated).reduce((sum, item) => sum + item.cost, 0) };
        localStorage.setItem("currentProject", JSON.stringify(savedData));
      }, 500);
      
      return updated;
    });
  };
  
  const applyBulkAdjustment = (percentage: number) => {
    if (!originalMaterials) return;
    
    const multiplier = percentage / 100;
    const adjustedMaterials = { ...materials };
    
    Object.keys(adjustedMaterials).forEach(key => {
      const original = (originalMaterials as any)[key];
      (adjustedMaterials as any)[key] = {
        ...original,
        quantity: Math.round(original.quantity * multiplier),
        cost: Math.round(original.quantity * multiplier * original.rate)
      };
    });
    
    setMaterials(adjustedMaterials);
    setBulkAdjustment(percentage);
  };
  
  const resetToOriginal = () => {
    if (originalMaterials) {
      setMaterials({ ...originalMaterials });
      setBulkAdjustment(100);
      toast.success("Reset to AI-calculated quantities");
    }
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
                <p className="text-xs opacity-75 mt-1">₹{total.toLocaleString('en-IN')} total</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-lg mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>AI-optimized</span>
                </div>
                <div className="text-xs opacity-75">
                  ₹{Math.round(total / (projectData?.area || 1))} per sq.ft
                </div>
              </div>
            </div>
          </div>
          
          {/* Bulk Controls */}
          <div className="card-soft bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Bulk Adjustment
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToOriginal}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to AI
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Adjust all quantities:</Label>
                  <div className="flex items-center gap-2">
                    {bulkAdjustment < 100 && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {bulkAdjustment > 100 && <TrendingUp className="w-4 h-4 text-green-500" />}
                    <span className="font-semibold text-lg">{bulkAdjustment}%</span>
                  </div>
                </div>
                
                <Slider
                  value={[bulkAdjustment]}
                  onValueChange={(value) => applyBulkAdjustment(value[0])}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50% (Minimal)</span>
                  <span>100% (AI Recommended)</span>
                  <span>150% (Extra Buffer)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyBulkAdjustment(80)}
                    className="text-xs flex items-center gap-1 hover:bg-red-50"
                  >
                    <TrendingDown className="w-3 h-3" />
                    Budget (-20%)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyBulkAdjustment(100)}
                    className="text-xs hover:bg-blue-50"
                  >
                    🎯 Standard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyBulkAdjustment(120)}
                    className="text-xs flex items-center gap-1 hover:bg-green-50"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Buffer (+20%)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyBulkAdjustment(110)}
                    className="text-xs hover:bg-yellow-50"
                  >
                    🔒 Safe (+10%)
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 font-medium mb-2">💡 Quick Tips:</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Budget: For cost-conscious builds</li>
                    <li>• Standard: AI-recommended quantities</li>
                    <li>• Safe: 10% buffer for peace of mind</li>
                    <li>• Buffer: 20% extra for premium quality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Material Cards */}
          <MaterialCard
            title="Cement (Bags)"
            icon="🏗️"
            description="Used for concrete and mortar. 1 bag = 50kg."
            educational="Premium cement ensures better strength. ~660 bags for 1350 sqft project"
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
            description="TMT bars for structural strength. ~3.5 tonnes total."
            educational="High-grade TMT bars ensure earthquake resistance. 2.6kg per sq.ft for multi-story"
            quantity={materials.steel.quantity}
            rate={materials.steel.rate}
            cost={materials.steel.cost}
            onQuantityChange={(val) => updateMaterial('steel', 'quantity', val)}
            onRateChange={(val) => updateMaterial('steel', 'rate', val)}
            unit="kg"
            rateUnit="₹/kg"
          />

          <MaterialCard
            title="Sand (m³)"
            icon="🏖️"
            description="Fine sand for concrete and plastering. ~173 m³ total."
            educational="River sand preferred. M-sand is sustainable alternative. 0.128 m³ per sq.ft"
            quantity={materials.sand.quantity}
            rate={materials.sand.rate}
            cost={materials.sand.cost}
            onQuantityChange={(val) => updateMaterial('sand', 'quantity', val)}
            onRateChange={(val) => updateMaterial('sand', 'rate', val)}
            unit="m³"
            rateUnit="₹/m³"
          />

          <MaterialCard
            title="Bricks (nos)"
            icon="🧱"
            description="Standard clay bricks. ~47,000 bricks total."
            educational="Quality bricks ensure durability. 35 bricks per sq.ft for walls"
            quantity={materials.bricks.quantity}
            rate={materials.bricks.rate}
            cost={materials.bricks.cost}
            onQuantityChange={(val) => updateMaterial('bricks', 'quantity', val)}
            onRateChange={(val) => updateMaterial('bricks', 'rate', val)}
            unit="nos"
            rateUnit="₹/brick"
          />

          <MaterialCard
            title="Aggregate (m³)"
            icon="🪨"
            description="Stone aggregate for concrete. ~69 m³ total."
            educational="20mm & 40mm mixed for optimal concrete strength. 0.051 m³ per sq.ft"
            quantity={materials.aggregate.quantity}
            rate={materials.aggregate.rate}
            cost={materials.aggregate.cost}
            onQuantityChange={(val) => updateMaterial('aggregate', 'quantity', val)}
            onRateChange={(val) => updateMaterial('aggregate', 'rate', val)}
            unit="m³"
            rateUnit="₹/m³"
          />

          <MaterialCard
            title="Tiles (sqft)"
            icon="🔲"
            description="Floor and wall tiles. ~3,450 sqft including wastage."
            educational="Includes flooring, bathroom, and kitchen tiles with 10% wastage buffer"
            quantity={materials.tiles.quantity}
            rate={materials.tiles.rate}
            cost={materials.tiles.cost}
            onQuantityChange={(val) => updateMaterial('tiles', 'quantity', val)}
            onRateChange={(val) => updateMaterial('tiles', 'rate', val)}
            unit="sqft"
            rateUnit="₹/sqft"
          />

          <MaterialCard
            title="Carpentry Materials"
            icon="🚪"
            description="Doors, windows, cabinets, and woodwork."
            educational="Includes all wooden fixtures, doors, windows, kitchen cabinets, wardrobes"
            quantity={materials.carpentry.quantity}
            rate={materials.carpentry.rate}
            cost={materials.carpentry.cost}
            onQuantityChange={(val) => updateMaterial('carpentry', 'quantity', val)}
            onRateChange={(val) => updateMaterial('carpentry', 'rate', val)}
            unit="project"
            rateUnit="₹/project"
          />

          <MaterialCard
            title="Plumbing Materials"
            icon="🚿"
            description="Pipes, fittings, and bathroom fixtures."
            educational="Complete plumbing system for 7 bathrooms and 6 kitchens"
            quantity={materials.plumbing.quantity}
            rate={materials.plumbing.rate}
            cost={materials.plumbing.cost}
            onQuantityChange={(val) => updateMaterial('plumbing', 'quantity', val)}
            onRateChange={(val) => updateMaterial('plumbing', 'rate', val)}
            unit="project"
            rateUnit="₹/project"
          />

          <MaterialCard
            title="Electrical Materials"
            icon="⚡"
            description="Wiring, switches, and electrical fittings."
            educational="Complete electrical system with modern fittings and safety measures"
            quantity={materials.electrical.quantity}
            rate={materials.electrical.rate}
            cost={materials.electrical.cost}
            onQuantityChange={(val) => updateMaterial('electrical', 'quantity', val)}
            onRateChange={(val) => updateMaterial('electrical', 'rate', val)}
            unit="project"
            rateUnit="₹/project"
          />

          <MaterialCard
            title="Paints & Chemicals"
            icon="🎨"
            description="Paints, primers, tile adhesives, and chemicals."
            educational="Interior and exterior paints, waterproofing, tile adhesives"
            quantity={materials.paints.quantity}
            rate={materials.paints.rate}
            cost={materials.paints.cost}
            onQuantityChange={(val) => updateMaterial('paints', 'quantity', val)}
            onRateChange={(val) => updateMaterial('paints', 'rate', val)}
            unit="project"
            rateUnit="₹/project"
          />

          <MaterialCard
            title="Transport & Logistics"
            icon="🚚"
            description="Transportation for tiles, dust, bricks, plumber tools etc."
            educational="Includes delivery charges for all materials, tools, and equipment. Calculated at ₹25 per sq.ft of construction area."
            quantity={materials.transport.quantity}
            rate={materials.transport.rate}
            cost={materials.transport.cost}
            onQuantityChange={(val) => updateMaterial('transport', 'quantity', val)}
            onRateChange={(val) => updateMaterial('transport', 'rate', val)}
            unit="project"
            rateUnit="₹/project"
          />
          
          {/* Smart Warnings */}
          <div className="card-soft">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              🧠 Smart Analysis
            </h3>
            <SmartWarnings materials={materials} projectArea={projectData?.area || 1} />
          </div>

          {/* Submit */}
          <div className="space-y-4 mt-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">💾 Auto-saved</span>
                <span className="text-xs text-green-600">Changes saved automatically</span>
              </div>
              <div className="text-xs text-green-700">
                Total: ₹{(total / 100000).toFixed(2)}L | Per sq.ft: ₹{Math.round(total / (projectData?.area || 1))}
              </div>
            </div>
            
            <Button onClick={handleSubmit} className="w-full btn-hero h-14 text-lg group">
              Next: Labor & Finishing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
