import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';


// Types for quiz attempt
export interface QuizAttemptResponse {
  attemptId: string;
  quizId: string;
  userId: string;
  startedAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface Question {
  id: string;
  question: string;
  questionType: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  options?: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
  }>;
  correctAnswer: string;
}

export interface QuizDetails {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  instructions: string;
  questions: Question[];
  createdAt: string;
}

export interface AnswerSubmission {
  attemptId: string;
  questionId: string;
  selectedOptionId?: string; 
  userAnswer?: string; 
}

export interface SaveAnswerResponse {
  success: boolean;
  data: {
    attemptAnswerId: string;
    attemptId: string;
    questionId: string;
    selectedOptionId?: string;
    userAnswer?: string;
    isCorrect: boolean;
  };
  message: string;
}

export interface QuizCompletionResponse {
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
  }>;
}

export interface AttemptDetails {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number; 
  startedAt: string;
  completedAt: string;
  timeTaken: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface UserAttempts {
  attempts: AttemptDetails[];
  bestScore: number;
  averageScore: number;
  totalAttempts: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
  rank: number;
}


const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});


const activeRequests = new Map<string, Promise<any>>();

export const QuizAttemptService = {
  
  async getQuizDetails(quizId: string): Promise<QuizDetails> {
    try {
      
      
      const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}`, {
        headers: getAuthHeaders()
      });
      
      
      const backendData = response.data;
      
      const quizData = backendData.success ? backendData.data : backendData;
      
      const transformedQuiz: QuizDetails = {
        id: quizData.quizId || quizData.id || quizId,
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        timeLimit: quizData.timeLimit,
        instructions: quizData.instructions || 'Complete all questions to the best of your knowledge.',
        questions: (quizData.questions || []).map((q: any) => ({
          id: q.questionId || q.id,
          question: q.question,
          questionType: q.questionType,
          points: q.points || 1,
          options: (q.questionOptions || q.options || []).map((opt: any) => ({
            id: opt.optionId || opt.id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect
          })),
          correctAnswer: q.correctAnswer
        })),
        createdAt: quizData.createdAt || new Date().toISOString()
      };
      
      
      return transformedQuiz;
    } catch (error: any) {
      console.error('Error fetching quiz details:', error);
      console.error('Request URL:', `${API_BASE_URL}/quiz/${quizId}`);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data);
      console.error('Full error:', error);
      
      throw this.handleApiError(error, 'Failed to fetch quiz details');
    }
  },

  
  async startQuizAttempt(quizId: string): Promise<QuizAttemptResponse> {
    const requestKey = `startQuizAttempt_${quizId}`;
    
    
    if (activeRequests.has(requestKey)) {
      console.log('Reusing existing quiz attempt request for quiz:', quizId);
      return activeRequests.get(requestKey);
    }

    const requestPromise = this.performStartQuizAttempt(quizId);
    
    
    activeRequests.set(requestKey, requestPromise);
  
    requestPromise
      .finally(() => {
        activeRequests.delete(requestKey);
      });
    
    return requestPromise;
  },


  async performStartQuizAttempt(quizId: string): Promise<QuizAttemptResponse> {
    try {
      
      const requestBody = {
        quizId: quizId,
        userId: localStorage.getItem('userId') 
      };
      
    
      const response = await axios.post(
        `${API_BASE_URL}/quiz/attempt/start`,
        requestBody,
        { headers: getAuthHeaders() }
      );
      
      
      const responseData = response.data;
      
      
      const attemptData = responseData.success ? responseData.data : responseData;
      
    
      if (!attemptData.attemptId && attemptData.id) {
        
        attemptData.attemptId = attemptData.id;
      }
      
      if (!attemptData.attemptId) {
        
        throw new Error('Backend did not return a valid attempt ID');
      }
      
      return attemptData;
      
    } catch (error: any) {
      console.error('Error starting quiz attempt:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });
      
      
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      
     
      if (error.response?.data) {
        console.error('Full backend response:', error.response.data);
      }
      
      throw this.handleApiError(error, 'Failed to start quiz attempt');
    }
  },


  async saveAnswer(answerData: AnswerSubmission): Promise<SaveAnswerResponse> {
    try {
      console.log('Saving answer:', answerData);
      
      const requestBody: any = {
        attemptId: answerData.attemptId,
        questionId: answerData.questionId
      };

      // Add the appropriate field based on question type
      if (answerData.selectedOptionId) {
        requestBody.selectedOptionId = answerData.selectedOptionId;
      }
      if (answerData.userAnswer) {
        requestBody.userAnswer = answerData.userAnswer;
      }
      
      console.log('Save answer request body:', requestBody);
      
      const response = await axios.post(
        `${API_BASE_URL}/quiz/attempt/save-answer`,
        requestBody,
        { headers: getAuthHeaders() }
      );
      
      
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        console.log('Extracting data from success wrapper:', responseData.data);
        return responseData;
      } else {
        console.log('Using direct response data:', responseData);
        return responseData;
      }
    } catch (error: any) {
      console.error('Error saving answer:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw this.handleApiError(error, 'Failed to save answer');
    }
  },

 
  async completeQuiz(attemptId: string): Promise<QuizCompletionResponse> {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      if (!attemptId) {
        throw new Error('Attempt ID is required to complete quiz');
      }

      const requestBody = {
        userId: userId,
        attemptId: attemptId
      };

      

      const response = await axios.put(
        `${API_BASE_URL}/quiz/attempt/complete`,
        requestBody,
        { headers: getAuthHeaders() }
      );
      
   
      
      const responseData = response.data;
      
      let finalData;
      if (responseData.success && responseData.data) {
        
        finalData = responseData.data;
      } else {
;
        finalData = responseData;
      }
    
      if (!finalData.results) {
        
        finalData.results = [];
      }
      
     
      if (!Array.isArray(finalData.results)) {
        
        finalData.results = [];
      }
      
      return finalData;
    } catch (error: any) {
      console.error('🔍 Error completing quiz:', error);
      console.error('🔍 Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw this.handleApiError(error, 'Failed to complete quiz');
    }
  },


  
  async getUserQuizAttempts(userId: string, quizId: string): Promise<UserAttempts> {
    try {
      console.log('Fetching user quiz attempts for userId:', userId, 'quizId:', quizId);
      
      const response = await axios.get(
        `${API_BASE_URL}/quiz/attempts/user/${userId}/quiz/${quizId}`,
        { headers: getAuthHeaders() }
      );
      
        
      
      const responseData = response.data;
      
      let data;
      
      if (responseData.success && responseData.data) {
        console.log('Extracting data from success wrapper:', responseData.data);
        data = responseData.data;
      } else {
        console.log('Using direct response data:', responseData);
        data = responseData;
      }
      
     
      const transformedData: UserAttempts = {
        attempts: (data.attempts || []).map((attempt: any) => ({
          ...attempt,
          percentage: typeof attempt.percentage === 'string' 
            ? parseFloat(attempt.percentage) 
            : attempt.percentage
        })),
        bestScore: data.bestScore || 0,
        averageScore: data.averageScore || 0,
        totalAttempts: data.totalAttempts || 0
      };
      
      console.log('Transformed user attempts data:', transformedData);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching user attempts:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw this.handleApiError(error, 'Failed to fetch user attempts');
    }
  },


 
  handleApiError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error(defaultMessage);
    }
  }
};
