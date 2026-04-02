export type SubscriptionStatus = "free" | "pro";

export type Grade = "K" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  worksheets_generated_this_month: number;
  worksheet_monthly_limit: number;
  test_prep_used_this_month: number;
  month_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  grade: Grade;
  age: number | null;
  subjects: string[];
  interests: string;
  learning_notes: string | null;
  active: boolean;
  created_at: string;
}

export interface Worksheet {
  id: string;
  user_id: string;
  child_id: string;
  subject: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  grade: Grade;
  worksheet_type: string;
  theme?: string | null;
  theme_image_url?: string | null;
  content: WorksheetContent;
  answer_key: AnswerKeyItem[];
  created_at: string;
}

export interface WorksheetVisual {
  type:
    | "clock"
    | "ruler"
    | "beaker"
    | "number_line"
    | "thermometer"
    | "balance_scale"
    | "coins"
    | "calendar"
    | "protractor"
    | "bar_graph";
  data: Record<string, unknown>;
}

export interface WorksheetContent {
  learn_it: string;
  worked_example: string;
  problems: string[];
  problem_visuals?: (WorksheetVisual | null)[];
  problem_icons?: (string | null)[];
  challenge: string;
}

export interface AnswerKeyItem {
  number: number;
  answer: string;
  explanation?: string;
}

export interface HomeworkHelpSession {
  id: string;
  user_id: string;
  child_id: string | null;
  question: string;
  response: string;
  created_at: string;
}

export interface TestVisual {
  type: "clock" | "number_line" | "fraction_model" | "shape" | "dot_array" | "bar_graph";
  data: Record<string, unknown>;
}

export interface TestQuestion {
  number: number;
  section: "A" | "B" | "C";
  type: "multiple_choice" | "short_answer" | "show_work";
  question: string;
  options?: string[];
  correct_answer: string;
  solution_steps?: string[];
  topic_tag: string;
  points: number;
  visual?: TestVisual;
}

export interface QuestionResult {
  number: number;
  correct: boolean;
  student_answer: string;
  points_earned: number;
  points_possible: number;
  feedback: string;
}

export interface TestFeedback {
  overall_summary: string;
  score: number;
  total_points: number;
  percentage: number;
  question_results: QuestionResult[];
  weak_areas: string[];
  strong_areas: string[];
  encouragement: string;
}

export interface PracticeExercise {
  number: number;
  topic: string;
  problem: string;
  hint: string;
  answer: string;
  explanation: string;
}

export interface Test {
  id: string;
  user_id: string;
  child_id: string;
  subject: string;
  topic: string;
  grade: Grade;
  title: string;
  questions: TestQuestion[];
  total_points: number;
  status: "generated" | "graded";
  created_at: string;
}

export interface TestSubmission {
  id: string;
  test_id: string;
  user_id: string;
  image_paths: string[];
  feedback: TestFeedback;
  practice_exercises: PracticeExercise[];
  created_at: string;
}

export interface CurriculumSubject {
  name: string;
  topics: string[];
}

export interface CurriculumGradeRange {
  grades: Grade[];
  subjects: CurriculumSubject[];
}
