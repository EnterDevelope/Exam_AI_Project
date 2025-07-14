export interface Question {
  id: string
  type: 'multiple' | 'short'
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
  concept?: string
}

export interface QuizData {
  questions: Question[]
}

export interface QuizResult {
  quizId: string
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  wrongAnswersCount: number
}

export interface QuizCompleteRequest {
  questions: Question[]
  userAnswers: string[]
  correctAnswers: number
  totalQuestions: number
  subject: string
  week: string
}

export interface WrongAnswer {
  quiz_id: string
  user_id: string
  question_index: number
  user_answer: string
  correct_answer: string
  explanation?: string
}

export interface QuizFeedback {
  isCorrect: boolean
  explanation?: string
  correctAnswer?: string
} 