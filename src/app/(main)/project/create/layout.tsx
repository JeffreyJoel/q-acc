'use client';
import { ProjectCreationProvider } from '@/contexts/projectCreation.context';

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectCreationProvider>
      <section>{children}</section>
    </ProjectCreationProvider>
  );
}
