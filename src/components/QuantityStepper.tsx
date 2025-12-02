import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantityStepper = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit = '',
  size = 'md'
}: QuantityStepperProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    const numValue = parseFloat(inputVal);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const inputSizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${sizeClasses[size]} p-0 hover:bg-destructive/10 hover:text-destructive`}
      >
        <Minus className="w-4 h-4" />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          step={step}
          className={`${inputSizeClasses[size]} text-center font-semibold`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${sizeClasses[size]} p-0 hover:bg-primary/10 hover:text-primary`}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};