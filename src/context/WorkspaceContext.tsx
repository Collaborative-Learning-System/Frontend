import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberCount: number;
  role: string;
}

interface WorkspaceContextType {
  workspaceData: WorkspaceData | null;
  setWorkspaceData: (data: WorkspaceData | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);

  const handleSetWorkspaceData = (data: WorkspaceData | null) => {
    console.log("WorkspaceContext: Setting workspace data:", data);
    setWorkspaceData(data);
  };

  return (
    <WorkspaceContext.Provider value={{ workspaceData, setWorkspaceData: handleSetWorkspaceData }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
