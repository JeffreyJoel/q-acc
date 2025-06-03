'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectCreationForm, ProjectFormData } from './ProjectCreationForm';
import { useProjectCreationContext } from '@/contexts/projectCreation.context';
import { CheckCircle, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepIndicator } from './StepIndicator';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (project: ProjectFormData) => void;
}

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Project name and description' },
  { id: 2, title: 'Social Links', description: 'Connect your social media' },
  { id: 3, title: 'Media Assets', description: 'Upload logo and banner' },
  { id: 4, title: 'Review & Submit', description: 'Confirm and create project' },
];

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const { formData, setFormData } = useProjectCreationContext();
  const { isConnected } = useAccount();

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCompletedSteps([]);
      setHasFormChanges(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (hasFormChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleStepValidation = (step: number): boolean => {
    const data = formData.project;
    
    switch (step) {
      case 1:
        return !!(
          data.projectName?.trim() &&
          data.projectTeaser?.trim() &&
          data.projectDescription?.trim() &&
          data.projectDescription.length >= 200
        );
      case 2:
        // Social links are optional, so this step is always valid
        return true;
      case 3:
        // Media assets are optional, so this step is always valid
        return true;
      case 4:
        return completedSteps.includes(1); // At minimum, step 1 must be completed
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (handleStepValidation(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to completed steps or the next step
    if (stepNumber <= currentStep || completedSteps.includes(stepNumber - 1)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleFormChange = () => {
    setHasFormChanges(true);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      // Here you would normally call your API to create the project
      setFormData({ project: data });
      onSuccess?.(data);
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (!isConnected) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-neutral-900 rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Connect Wallet Required</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">
              Please connect your wallet to create a project.
            </p>
            <Button 
              onClick={handleClose}
              className="bg-peach-400 hover:bg-peach-300 text-black rounded-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-neutral-900 rounded-[24px] overflow-hidden flex flex-col">
        <DialogHeader className="relative">
     
          <DialogTitle className="text-2xl font-bold">
            Create Your Project
          </DialogTitle>
          
          {/* Progress indicator */}
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
              </span>
              <span className="text-gray-400">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step indicators */}
          {/* <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            className="mt-6"
          /> */}
        </DialogHeader>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto py-6">
          <ProjectCreationForm
            currentStep={currentStep}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-700">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 border-neutral-700 hover:bg-neutral-800"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <div className="text-sm text-gray-400">
            {STEPS[currentStep - 1]?.description}
          </div>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNextStep}
              disabled={!handleStepValidation(currentStep)}
              className="flex items-center gap-2 bg-peach-400 hover:bg-peach-300 text-black rounded-full"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              form="project-creation-form"
              disabled={!handleStepValidation(currentStep)}
              className="bg-peach-400 hover:bg-peach-300 text-black rounded-full"
            >
              Create Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 