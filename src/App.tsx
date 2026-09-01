import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { ProjectProvider } from './app/providers/ProjectProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import { CommandPaletteProvider } from './app/providers/CommandPaletteProvider';
import { AppRoutes } from './app/routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              <AppRoutes />
            </CommandPaletteProvider>
          </ToastProvider>
        </ProjectProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
