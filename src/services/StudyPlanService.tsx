import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface StudyPlanRequest {
  userId: string;
  subjects: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  preferredTimeSlots: string[] | string;
  includeRegularBreaks: boolean;
  studygoal: string;
  learningstyle: string;
}

interface StudyPlanResponse {
  success: boolean;
  data: {
    planId: number;
    userId: string;
    title: string;
    subjects: string;
    studyGoal: string;
    learningStyle: string;
    difficultyLevel: string;
    startDate: string;
    endDate: string;
    dailyHours: number;
    preferredTimeSlots: string[];
    includeRegularBreaks: boolean;
    createdAt: string;
    tasks: Array<{
      id: number;
      date: string;
      title: string;
      description: string;
      type: "study" | "review" | "practice" | "break";
      durationMinutes: number;
      startTime: string;
      endTime: string;
    }>;
  };
  message?: string;
}

export const generateStudyPlan = async (requestData: StudyPlanRequest): Promise<StudyPlanResponse> => {
  try {
    console.log('Sending request data:', requestData);
    
    const { data } = await axios.post(
      `${backendUrl}/api/study-plans/generate`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // For authorization cookies
      }
    );
    
    console.log('Raw API response:', data);
    
    // Handle different response formats
    if (data && data.success !== undefined) {
      return data;
    } else if (data) {
      // If the backend doesn't return a success field, wrap the response
      return {
        success: true,
        data: data
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error: any) {
    console.error('Study plan generation error:', error);
    console.error('Error response:', error.response?.data);
    
    // Handle different error scenarios
    if (error.response?.data) {
      const backendMessage = error.response.data.message || error.response.data.error || 'Failed to generate study plan';
      throw new Error(backendMessage);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

interface UserStudyPlan {
  planId: number;
  title: string;
  subjects: string;
  studyGoal: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  createdAt: string;
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
}

interface UserStudyPlansResponse {
  success: boolean;
  data: UserStudyPlan[];
  message?: string;
}

export const getUserStudyPlans = async (userId: string): Promise<UserStudyPlansResponse> => {
  try {
    console.log('Fetching study plans for user:', userId);
    
    const { data } = await axios.get(
      `${backendUrl}/api/study-plans/user/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    console.log('User study plans response:', data);
    
    // Handle different response formats
    if (data && data.success !== undefined) {
      return data;
    } else if (data) {
      // If the backend doesn't return a success field, wrap the response
      return {
        success: true,
        data: Array.isArray(data) ? data : [data]
      };
    } else {
      return {
        success: true,
        data: []
      };
    }
  } catch (error: any) {
    console.error('Fetch study plans error:', error);
    console.error('Error response:', error.response?.data);
    
    // Return empty array instead of throwing error to prevent dashboard from breaking
    return {
      success: false,
      data: [],
      message: 'Failed to load study plans'
    };
  }
};

export default { generateStudyPlan, getUserStudyPlans };