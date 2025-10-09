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
  difficultyLevel?: string;
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
    // Validate required fields
    if (!requestData.userId) {
      throw new Error('User ID is required');
    }
    if (!requestData.subjects || requestData.subjects.trim() === '') {
      throw new Error('At least one subject is required');
    }
    if (!requestData.startDate || !requestData.endDate) {
      throw new Error('Start date and end date are required');
    }
    if (!requestData.studygoal || requestData.studygoal.trim() === '') {
      throw new Error('Study goal is required');
    }
    
    console.log('Sending request data:', requestData);
    console.log('Request data keys:', Object.keys(requestData));
    console.log('Backend URL:', backendUrl);
    console.log('Full request URL:', `${backendUrl}/api/study-plans/generate`);
    
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
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    console.error('Request config:', error.config);
    
    // Handle different error scenarios
    if (error.response?.data) {
      const backendError = error.response.data;
      console.error('Full backend error object:', backendError);
      
      // Try to get the most specific error message
      const errorMessage = 
        backendError.message || 
        backendError.error || 
        backendError.details || 
        JSON.stringify(backendError) ||
        `HTTP ${error.response.status}: Failed to generate study plan`;
      
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error - please check your connection and ensure backend is running');
    } else {
      throw new Error('An unexpected error occurred: ' + error.message);
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

// Add interface for detailed study plan response
interface StudyPlanDetailResponse {
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

// Add function to fetch a specific study plan by ID
export const getStudyPlanById = async (planId: number): Promise<StudyPlanDetailResponse> => {
  try {
    console.log('Fetching study plan:', planId);
    
    const { data } = await axios.get(
      `${backendUrl}/api/study-plans/plan/${planId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    console.log('Study plan detail response:', data);
    
    if (data && data.success !== undefined) {
      return data;
    } else if (data) {
      return {
        success: true,
        data: data
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error: any) {
    console.error('Fetch study plan detail error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data) {
      const errorMessage = error.response.data.message || 
                          error.response.data.error || 
                          `Failed to fetch study plan: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error('An unexpected error occurred: ' + error.message);
    }
  }
};

// Add function to delete a study plan by ID
export const deleteStudyPlan = async (planId: number): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Deleting study plan:', planId);
    
    const { data } = await axios.delete(
      `${backendUrl}/api/study-plans/delete-plan/${planId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    console.log('Delete study plan response:', data);
    
    if (data && data.success !== undefined) {
      return data;
    } else {
      return {
        success: true,
        message: 'Study plan deleted successfully'
      };
    }
  } catch (error: any) {
    console.error('Delete study plan error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data) {
      const errorMessage = error.response.data.message || 
                          error.response.data.error || 
                          `Failed to delete study plan: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error('An unexpected error occurred: ' + error.message);
    }
  }
};

// Add transformation function to convert API response to StudyPlanDisplay format
export const transformApiResponseToStudyPlan = (apiData: StudyPlanDetailResponse['data']) => {
  // Group tasks by date
  const tasksByDate = apiData.tasks.reduce((acc: any, task: any) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      id: task.id.toString(),
      subject: task.title.split(':')[0] || 'Study',
      topic: task.title,
      duration: task.durationMinutes / 60, // Convert minutes to hours
      type: task.type as "study" | "review" | "practice" | "break",
      completed: false,
      description: task.description,
    });
    return acc;
  }, {});

  // Convert to schedule format
  const schedule = Object.entries(tasksByDate)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, dayTasks]: [string, any], index) => {
      const totalHours = dayTasks.reduce((sum: number, task: any) => sum + task.duration, 0);
      
      return {
        date: new Date(date).toLocaleDateString(),
        dayName: `Day ${index + 1}`,
        tasks: dayTasks,
        totalHours: Math.round(totalHours * 10) / 10,
      };
    });

  // Calculate duration
  const startDate = new Date(apiData.startDate);
  const endDate = new Date(apiData.endDate);
  const daysDifference = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const durationText = daysDifference <= 7
    ? `${daysDifference} days`
    : daysDifference <= 30
    ? `${Math.ceil(daysDifference / 7)} weeks`
    : `${Math.ceil(daysDifference / 30)} months`;

  // Generate tips based on learning style
  const generateTips = (learningStyle: string) => {
    const styles = learningStyle.split(', ');
    const tips = [
      `Your plan is optimized for ${learningStyle.toLowerCase()} learning.`,
    ];
    
    if (styles.includes('Visual')) {
      tips.push('Use diagrams, charts, mind maps, and color-coding to organize information visually.');
    }
    if (styles.includes('Auditory')) {
      tips.push('Record yourself explaining concepts and listen back, or discuss topics with study partners.');
    }
    if (styles.includes('Kinesthetic')) {
      tips.push('Use hands-on practice, write notes by hand, and take movement breaks during study sessions.');
    }
    
    tips.push(
      'Take regular breaks as scheduled to maintain focus and retention.',
      'Track your progress daily and adjust the plan if needed.',
      'Use active recall techniques - test yourself regularly instead of just re-reading.'
    );
    
    return tips;
  };

  return {
    title: apiData.title,
    duration: durationText,
    totalHours: Math.round(daysDifference * apiData.dailyHours),
    subjects: apiData.subjects.split(',').map((s: string) => s.trim()),
    schedule: schedule,
    tips: generateTips(apiData.learningStyle),
  };
};

export default { generateStudyPlan, getUserStudyPlans, getStudyPlanById, transformApiResponseToStudyPlan, deleteStudyPlan };