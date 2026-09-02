import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIConfig {
  azureEndpoint: string;
  azureApiKey: string;
  deploymentName: string;
  apiVersion: string;
}

interface AIConfigContextType {
  config: AIConfig;
  setConfig: (config: AIConfig) => void;
  isConfigured: boolean;
}

const defaultConfig: AIConfig = {
  azureEndpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  azureApiKey: import.meta.env.VITE_AZURE_API_KEY || '',
  deploymentName: import.meta.env.VITE_AZURE_DEPLOYMENT || 'gpt-6.6-sol',
  apiVersion: import.meta.env.VITE_AZURE_API_VERSION || '2024-02-01',
};

const AIConfigContext = createContext<AIConfigContextType | undefined>(undefined);

export const AIConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('verix_azure_ai_config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const setConfig = (newConfig: AIConfig) => {
    setConfigState(newConfig);
    localStorage.setItem('verix_azure_ai_config', JSON.stringify(newConfig));
  };

  const isConfigured = Boolean(config.azureEndpoint && config.azureApiKey && config.deploymentName);

  return (
    <AIConfigContext.Provider value={{ config, setConfig, isConfigured }}>
      {children}
    </AIConfigContext.Provider>
  );
};

export const useAIConfig = () => {
  const context = useContext(AIConfigContext);
  if (context === undefined) {
    throw new Error('useAIConfig must be used within an AIConfigProvider');
  }
  return context;
};
