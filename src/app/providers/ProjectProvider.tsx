import React, { createContext, useContext, useState } from 'react';
import { Project } from '../../types';
import { mockProjects } from '../../mock';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProjectId: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectIdState] = useState<string>(mockProjects[0].id);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
  };

  return (
    <ProjectContext.Provider value={{ projects, activeProject, setActiveProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
