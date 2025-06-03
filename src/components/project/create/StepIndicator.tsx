'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className,
}) => {
  const handleStepClick = (step: Step) => {
    if (onStepClick && (step.id <= currentStep || completedSteps.includes(step.id))) {
      onStepClick(step.id);
    }
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => handleStepClick(step)}
            className={cn(
              'flex flex-col items-center space-y-2 transition-colors',
              (step.id <= currentStep || completedSteps.includes(step.id))
                ? 'cursor-pointer hover:opacity-80'
                : 'cursor-not-allowed opacity-50'
            )}
            disabled={step.id > currentStep && !completedSteps.includes(step.id - 1)}
          >
            {/* Step Circle */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                completedSteps.includes(step.id)
                  ? 'bg-green-500 border-green-500 text-white shadow-lg'
                  : step.id === currentStep
                  ? 'border-blue-500 text-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 text-gray-400 bg-white'
              )}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle size={20} />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>

            {/* Step Info */}
            <div className="text-center max-w-[120px]">
              <div
                className={cn(
                  'text-xs font-medium transition-colors',
                  step.id === currentStep
                    ? 'text-blue-600'
                    : completedSteps.includes(step.id)
                    ? 'text-green-600'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">
                {step.description}
              </div>
            </div>
          </button>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div
                className={cn(
                  'h-0.5 transition-all duration-300',
                  completedSteps.includes(step.id)
                    ? 'bg-green-500'
                    : step.id < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator; 