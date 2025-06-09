import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectFormData } from '@/types/project.type';

interface FormData {
  project: ProjectFormData;
  // team: TeamMember[]; // Ensure team is an array of TeamMember objects
}

interface CreateContextType {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
}

const ProjectCreationContext = createContext<CreateContextType | undefined>(undefined);

export const ProjectCreationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormDataState] = useState<FormData>({
    project: {
      projectName: '',
      projectTeaser: '',
      projectDescription: '',
      website: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      discord: '',
      telegram: '',
      instagram: '',
      reddit: '',
      youtube: '',
      farcaster: '',
      lens: '',
      github: '',
      projectAddress: '',
      addressConfirmed: false,
      logo: null,
      banner: null,
      team: [],
    },
    // team: [], // Initialize team as an empty array
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState(prevData => ({
      ...prevData,
      ...data,
      // team: data.team || prevData.team, // Ensure team array is merged correctly
    }));
  };

  return (
    <ProjectCreationContext.Provider value={{ formData, setFormData }}>
      {children}
    </ProjectCreationContext.Provider>
  );
};

export const useProjectCreationContext = () => {
  const context = useContext(ProjectCreationContext);
  if (!context) {
    throw new Error('useProjectCreationContext must be used within a ProjectCreationProvider');
  }
  return context;
};
