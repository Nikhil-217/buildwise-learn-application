import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  "Details",
  "Materials",
  "Labor",
  "Results",
  "Save"
];

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center relative">
        {/* Connecting Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 ease-out -z-10"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isIncomplete = stepNumber > currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "progress-step",
                  isActive && "progress-step-active",
                  isComplete && "progress-step-complete",
                  isIncomplete && "progress-step-incomplete"
                )}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors hidden sm:block",
                  isActive && "text-primary",
                  isComplete && "text-secondary",
                  isIncomplete && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
