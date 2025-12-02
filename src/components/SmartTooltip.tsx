import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface SmartTooltipProps {
  content: string;
  children?: ReactNode;
  showIcon?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const SmartTooltip = ({ 
  content, 
  children, 
  showIcon = true, 
  side = 'top' 
}: SmartTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              <HelpCircle className="w-3 h-3 text-primary" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};