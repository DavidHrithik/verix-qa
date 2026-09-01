import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../../types';
import { mockProjects } from '../../mock';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProjectId: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
}

const STORAGE_KEY_PROJECTS = 'verix_projects_v1';
const STORAGE_KEY_ACTIVE = 'verix_active_project_id_v1';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize projects from localStorage if available, otherwise mockProjects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load projects from localStorage:', err);
    }
    return mockProjects;
  });

  // Initialize activeProjectId from localStorage or first project
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (savedActive) {
        return savedActive;
      }
    } catch (err) {
      console.warn('Failed to load activeProjectId from localStorage:', err);
    }
    return mockProjects[0].id;
  });

  // Persist projects to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (err) {
      console.warn('Failed to save projects to localStorage:', err);
    }
  }, [projects]);

  // Persist active project to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeProjectId);
    } catch (err) {
      console.warn('Failed to save activeProjectId to localStorage:', err);
    }
  }, [activeProjectId]);

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
