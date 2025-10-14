import axios from "axios";
import type { Question } from "../components/QuestionBuilder";

interface QuizMetadata {
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  instructions: string;
}

interface CreateQuizPayload {
  groupId: string;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: string;
  instructions: string;
  questions: Array<{
    question: string;
    questionType: string;
    points: number;
    correctAnswer: string;
    options?: Array<{
      optionText: string;
      isCorrect: boolean;
    }>;
  }>;
}

const mapQuestionType = (type: string): string => {
  switch (type) {
    case "mcq":
      return "MCQ";
    case "true-false":
      return "TRUE_FALSE";
    case "short-answer":
      return "SHORT_ANSWER";
    default:
      return "MCQ";
  }
};

// Transform frontend questions to backend format
const transformQuestions = (questions: Question[]) => {
  return questions.map((question) => {
    const baseQuestion = {
      question: question.question,
      questionType: mapQuestionType(question.type),
      points: question.points,
      correctAnswer: "",
      options: undefined as
        | Array<{ optionText: string; isCorrect: boolean }>
        | undefined,
    };

    if (question.type === "mcq" && question.options) {
      // For MCQ, correctAnswer should be the actual text of the correct option
      const correctIndex = question.correctAnswer as number;
      baseQuestion.correctAnswer = question.options[correctIndex] || "";

      baseQuestion.options = question.options.map((option, index) => ({
        optionText: option,
        isCorrect: index === correctIndex,
      }));
    } else if (question.type === "true-false") {
      // For True/False, create options and set correctAnswer
      baseQuestion.correctAnswer =
        question.correctAnswer === true ? "True" : "False";
      baseQuestion.options = [
        {
          optionText: "True",
          isCorrect: question.correctAnswer === true,
        },
        {
          optionText: "False",
          isCorrect: question.correctAnswer === false,
        },
      ];
    } else if (question.type === "short-answer") {
      // For short answer, just set the correctAnswer
      baseQuestion.correctAnswer = question.correctAnswer as string;
    }

    return baseQuestion;
  });
};

export const QuizService = {
  async getGroupQuizzes(groupId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/group/${groupId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching quizzes:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to fetch quizzes. Please try again.");
      }
    }
  },

  async createCompleteQuiz(
    groupId: string,
    metadata: QuizMetadata,
    questions: Question[]
  ): Promise<any> {
    const payload: CreateQuizPayload = {
      groupId,
      title: metadata.title,
      description: metadata.description,
      timeLimit: metadata.timeLimit,
      difficulty: metadata.difficulty.toUpperCase(),
      instructions: metadata.instructions,
      questions: transformQuestions(questions),
    };

    console.log("Sending quiz payload:", JSON.stringify(payload, null, 2));

    payload.questions.forEach((q, index) => {
      console.log(`Question ${index + 1}:`, JSON.stringify(q, null, 2));
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/create-complete`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error creating quiz:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to create quiz. Please try again.");
      }
    }
  },
};
