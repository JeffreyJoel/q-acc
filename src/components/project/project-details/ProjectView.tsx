'use client';

import { FC } from 'react';
import { ProjectProvider } from '@/contexts/project.context';
import ProjectDetails from './ProjectDetails';

interface IProjectViewProps {
  slug: string;
}

export const ProjectView: FC<IProjectViewProps> = ({ slug }) => {
  return (
    <ProjectProvider slug={slug}>
      <ProjectDetails params={{ id: slug }} />
    </ProjectProvider>
  );
};
