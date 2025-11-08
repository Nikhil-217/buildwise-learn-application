import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-quantity`} className="text-sm">
              Quantity ({unit})
            </Label>
            <Input
              id={`${title}-quantity`}
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="h-10"
            />
          </div>

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
            <div className="h-10 px-3 border border-input rounded-md bg-muted flex items-center font-semibold text-primary">
              ₹{cost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
