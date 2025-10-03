import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// TypeScript interfaces for group data
interface GroupMember {
  userId: string;
  name: string;
}

interface GroupContextType {
  // State
  groupMembers: GroupMember[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchGroupMembers: (groupId: string) => Promise<void>;
}

// Create context with default values
const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Provider props interface
interface GroupProviderProps {
  children: ReactNode;
}

// Group Context Provider component
export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all members in a specific group
  const fetchGroupMembers = useCallback(async (groupId: string) => {
    if (!groupId) {
      setError("Group ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/get-group-members/${groupId}`
      );

      if (response.data) {
        const members = response.data.data || response.data.members || [];
        setGroupMembers(members);
        console.log(
          `Fetched ${members.length} members for group ${groupId}:`,
          members
        );
      } else {
        throw new Error(
          response.data.message || "Failed to fetch group members"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch group members";
      setError(errorMessage);
      setGroupMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value object
  const value: GroupContextType = {
    // State
    groupMembers,
    loading,
    error,
    // Actions
    fetchGroupMembers,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};

// Custom hook to use the Group Context
export const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);

  if (context === undefined) {
    throw new Error("useGroup must be used within a GroupProvider");
  }

  return context;
};

// Export the context for advanced use cases
export { GroupContext };

// Export types for use in other components
export type { GroupMember, GroupContextType };
