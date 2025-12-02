import { useState } from "react";
import { Info, ChevronDown, ChevronUp, Plus, Minus, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { QuantityStepper } from "@/components/QuantityStepper";
import { SmartTooltip } from "@/components/SmartTooltip";

interface MaterialCardProps {
  title: string;
  icon: string;
  description: string;
  educational: string;
  quantity: number;
  rate: number;
  cost: number;
  onQuantityChange: (value: number) => void;
  onRateChange: (value: number) => void;
  unit: string;
  rateUnit: string;
}

export const MaterialCard = ({
  title,
  icon,
  description,
  educational,
  quantity,
  rate,
  cost,
  onQuantityChange,
  onRateChange,
  unit,
  rateUnit,
}: MaterialCardProps) => {
  const [showEducational, setShowEducational] = useState(false);
  const [inputMode, setInputMode] = useState<'slider' | 'stepper' | 'input'>('slider');
  
  // Smart suggestions based on material type
  const getSmartSuggestions = () => {
    const materialType = title.toLowerCase();
    if (materialType.includes('cement')) {
      return [Math.floor(quantity * 0.8), quantity, Math.floor(quantity * 1.2)];
    }
    if (materialType.includes('steel')) {
      return [Math.floor(quantity * 0.9), quantity, Math.floor(quantity * 1.1)];
    }
    return [Math.floor(quantity * 0.8), quantity, Math.floor(quantity * 1.2)];
  };
  
  const suggestions = getSmartSuggestions();
  const maxQuantity = Math.max(quantity * 2, 100);

  return (
    <Card className="card-soft animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEducational(!showEducational)}
            className="text-primary hover:text-primary-dark"
          >
            <Info className="w-4 h-4 mr-1" />
            Learn
            {showEducational ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>

        {/* Educational Content */}
        {showEducational && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm animate-fade-in">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">{educational}</p>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Quick select:
          </span>
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant={quantity === suggestion ? "default" : "outline"}
              size="sm"
              onClick={() => onQuantityChange(suggestion)}
              className="h-7 px-3 text-xs"
            >
              {suggestion} {unit}
            </Button>
          ))}
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Input mode:</span>
          <div className="flex gap-1">
            <SmartTooltip content="Use slider for quick adjustments">
              <Button
                variant={inputMode === 'slider' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('slider')}
                className="h-8 px-3 text-xs"
              >
                🎯 Slider
              </Button>
            </SmartTooltip>
            <SmartTooltip content="Use +/- buttons for precise control">
              <Button
                variant={inputMode === 'stepper' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('stepper')}
                className="h-8 px-3 text-xs"
              >
                ➕ Stepper
              </Button>
            </SmartTooltip>
            <SmartTooltip content="Type exact numbers manually">
              <Button
                variant={inputMode === 'input' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('input')}
                className="h-8 px-3 text-xs"
              >
                ⌨️ Manual
              </Button>
            </SmartTooltip>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Quantity: {quantity} {unit}
          </Label>
          
          {inputMode === 'slider' && (
            <div className="space-y-2">
              <Slider
                value={[quantity]}
                onValueChange={(value) => onQuantityChange(value[0])}
                max={maxQuantity}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxQuantity}</span>
              </div>
            </div>
          )}
          
          {inputMode === 'stepper' && (
            <QuantityStepper
              value={quantity}
              onChange={onQuantityChange}
              min={0}
              max={maxQuantity}
              step={title.toLowerCase().includes('cement') ? 1 : title.toLowerCase().includes('bricks') ? 0.1 : 1}
              unit={unit}
              size="md"
            />
          )}
          
          {inputMode === 'input' && (
            <Input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="h-10"
            />
          )}
        </div>

        {/* Rate and Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-rate`} className="text-sm">
              Rate ({rateUnit})
            </Label>
            <Input
              id={`${title}-rate`}
              type="number"
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Total Cost</Label>
            <div className="h-10 px-3 border border-input rounded-md bg-gradient-to-r from-primary/5 to-primary/10 flex items-center font-bold text-primary text-lg">
              ₹{cost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
