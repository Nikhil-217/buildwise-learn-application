import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EducationalTooltipProps {
  content: string;
}

export const EducationalTooltip = ({ content }: EducationalTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="text-primary hover:text-primary-dark transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="tooltip-educational max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
