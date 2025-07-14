export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      summaries: {
        Row: {
          id: string
          user_id: string
          subject: string
          week_number: number | null
          original_text: string
          summary_content: string
          summary_style: string
          file_name: string | null
          file_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          week_number?: number | null
          original_text: string
          summary_content: string
          summary_style?: string
          file_name?: string | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          week_number?: number | null
          original_text?: string
          summary_content?: string
          summary_style?: string
          file_name?: string | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          summary_id: string
          user_id: string
          questions: any
          total_questions: number
          correct_answers: number
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          summary_id: string
          user_id: string
          questions: any
          total_questions: number
          correct_answers?: number
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          summary_id?: string
          user_id?: string
          questions?: any
          total_questions?: number
          correct_answers?: number
          completed_at?: string | null
          created_at?: string
        }
      }
      wrong_answers: {
        Row: {
          id: string
          quiz_id: string
          user_id: string
          question_index: number
          user_answer: string | null
          correct_answer: string
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id: string
          question_index: number
          user_answer?: string | null
          correct_answer: string
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string
          question_index?: number
          user_answer?: string | null
          correct_answer?: string
          explanation?: string | null
          created_at?: string
        }
      }
    }
  }
}