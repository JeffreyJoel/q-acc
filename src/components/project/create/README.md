# Multi-Step Project Creation Modal

This directory contains a complete multi-step project creation modal system built with modern React patterns and shadcn/ui components.

## 🏗️ Architecture

The system is designed with separation of concerns:

- **ProjectCreationModal.tsx** - Main modal wrapper with step navigation
- **ProjectCreationForm.tsx** - Reusable form component handling all input logic
- **StepIndicator.tsx** - Visual progress indicator component
- **ProjectCreationExample.tsx** - Usage example component

## 📋 Features

### Multi-Step Navigation
- **Step 1: Basic Information** - Project name, teaser, and detailed description
- **Step 2: Social Media Links** - Optional social media connections
- **Step 3: Media Assets** - Logo and banner uploads
- **Step 4: Review & Submit** - Final review and confirmation

### User Experience
- ✅ Form validation for each step before progression
- ✅ Ability to navigate back and edit previous steps
- ✅ Visual progress indicators with completion status
- ✅ Responsive design for mobile and desktop
- ✅ Confirmation dialog when closing with unsaved changes
- ✅ Loading states and error handling
- ✅ Preview functionality for project review

### Technical Features
- ✅ TypeScript support with proper type definitions
- ✅ React Hook Form for form management and validation
- ✅ Context API for state persistence across steps
- ✅ shadcn/ui components for consistent design
- ✅ Proper accessibility features
- ✅ Modern React patterns (hooks, functional components)

## 🚀 Usage

### Basic Implementation

```tsx
import { ProjectCreationModal } from '@/components/project/create/ProjectCreationModal';
import { ProjectFormData } from '@/components/project/create/ProjectCreationForm';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = (projectData: ProjectFormData) => {
    console.log('Project created:', projectData);
    // Handle successful creation
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Create Project
      </button>
      
      <ProjectCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

### With Project Creation Context

```tsx
import { ProjectCreationProvider } from '@/contexts/projectCreation.context';

function App() {
  return (
    <ProjectCreationProvider>
      <MyComponent />
    </ProjectCreationProvider>
  );
}
```

## 🔧 Component APIs

### ProjectCreationModal Props

```tsx
interface ProjectCreationModalProps {
  isOpen: boolean;           // Controls modal visibility
  onClose: () => void;       // Called when modal should close
  onSuccess?: (project: ProjectFormData) => void; // Called on successful creation
}
```

### ProjectCreationForm Props

```tsx
interface ProjectCreationFormProps {
  currentStep: number;       // Current step number (1-4)
  onFormChange?: () => void; // Called when form data changes
  onSubmit: (data: ProjectFormData) => Promise<void>; // Submit handler
}
```

### StepIndicator Props

```tsx
interface StepIndicatorProps {
  steps: Step[];             // Array of step definitions
  currentStep: number;       // Current active step
  completedSteps: number[];  // Array of completed step numbers
  onStepClick?: (stepNumber: number) => void; // Step click handler
  className?: string;        // Additional CSS classes
}
```

## 📝 Form Data Structure

```tsx
interface ProjectFormData {
  projectName: string;
  projectTeaser: string;
  projectDescription: string;
  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  discord: string;
  telegram: string;
  instagram: string;
  reddit: string;
  youtube: string;
  farcaster: string;
  lens: string;
  github: string;
  projectAddress: string;
  addressConfirmed: boolean;
  logo: string | null;
  banner: string | null;
  team: TeamMember[];
}
```

## 🎨 Customization

### Styling
All components use Tailwind CSS classes and can be customized by:
- Modifying the className props
- Updating the component styles directly
- Using CSS modules or styled-components

### Validation Rules
Form validation can be customized in the ProjectCreationForm component:
- Update the validation rules for each field
- Add custom validation functions
- Modify error messages

### Steps Configuration
The steps can be modified by updating the `STEPS` constant:

```tsx
const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Project details' },
  { id: 2, title: 'Social Media', description: 'Connect accounts' },
  { id: 3, title: 'Media', description: 'Upload assets' },
  { id: 4, title: 'Review', description: 'Confirm & submit' },
];
```

## 🔄 State Management

The system uses React Context API for state management:
- **ProjectCreationContext** - Manages form data across steps
- **Form state** - Handled by React Hook Form
- **Modal state** - Local component state for UI interactions

## 🚨 Error Handling

The system includes comprehensive error handling:
- Form validation errors with user-friendly messages
- Network request error handling
- Graceful fallbacks for loading states
- Wallet connection requirements

## 📱 Responsive Design

The modal is fully responsive:
- **Mobile**: Stacked layout, touch-friendly interactions
- **Tablet**: Optimized spacing and grid layouts
- **Desktop**: Full-width modal with side-by-side content

## 🧪 Testing

To test the components:

1. Ensure wallet connection is available
2. Verify form validation works on each step
3. Test step navigation (forward/backward)
4. Verify data persistence across steps
5. Test modal close/confirmation behavior

## 🤝 Contributing

When contributing to this system:
1. Maintain TypeScript strict mode compliance
2. Follow the existing component patterns
3. Update documentation for any API changes
4. Test across different screen sizes
5. Ensure accessibility standards are met

## 📚 Dependencies

Core dependencies used:
- React Hook Form - Form management
- shadcn/ui - UI components
- Tailwind CSS - Styling
- Lucide React - Icons
- wagmi - Web3 wallet integration 