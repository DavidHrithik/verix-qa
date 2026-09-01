import React, { createContext, useContext, useState } from 'react';
import { Project } from '../../types';
import { mockProjects } from '../../mock';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProjectId: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectIdState] = useState<string>(mockProjects[0].id);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
  };

  const addProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  return (
    <ProjectContext.Provider value={{ projects, activeProject, setActiveProjectId, addProject, updateProject }}>
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
