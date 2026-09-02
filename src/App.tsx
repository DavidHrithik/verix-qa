import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { ProjectProvider } from './app/providers/ProjectProvider';
import { DataProvider } from './app/providers/DataProvider';
import { AIConfigProvider } from './app/providers/AIConfigProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import { CommandPaletteProvider } from './app/providers/CommandPaletteProvider';
import { AppRoutes } from './app/routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectProvider>
          <DataProvider>
            <AIConfigProvider>
              <ToastProvider>
                <CommandPaletteProvider>
                  <AppRoutes />
                </CommandPaletteProvider>
              </ToastProvider>
            </AIConfigProvider>
          </DataProvider>
        </ProjectProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

