export interface StaarCategory {
  name: string;
  shortName: string;
  worksheetTopic: string;
}

export const STAAR_MATH_CATEGORIES: StaarCategory[] = [
  {
    name: "Numerical Representations & Relationships",
    shortName: "Number Sense",
    worksheetTopic: "Fractions, Decimals & Number Relationships",
  },
  {
    name: "Computations & Algebraic Reasoning",
    shortName: "Computation & Algebra",
    worksheetTopic: "Operations, Equations & Algebraic Thinking",
  },
  {
    name: "Geometry & Measurement",
    shortName: "Geometry",
    worksheetTopic: "Geometry, Area, Perimeter & Measurement",
  },
  {
    name: "Data Analysis & Financial Literacy",
    shortName: "Data & Money",
    worksheetTopic: "Graphs, Tables & Financial Literacy",
  },
];

export const STAAR_GRADES = ["3", "4", "5", "6", "7", "8"] as const;
export type StaarGrade = (typeof STAAR_GRADES)[number];

export function isStaarGrade(grade: string): grade is StaarGrade {
  return (STAAR_GRADES as readonly string[]).includes(grade);
}

export interface CategoryScore {
  category: string;
  shortName: string;
  worksheetTopic: string;
  correct: number;
  total: number;
  pct: number;
}

export interface StaarGapReport {
  staar: true;
  grade: string;
  subject: string;
  category_scores: CategoryScore[];
  total_correct: number;
  total_questions: number;
  overall_pct: number;
}

export function getMastery(pct: number): {
  label: string;
  textColor: string;
  barColor: string;
  badgeClass: string;
} {
  if (pct >= 75)
    return {
      label: "Strong",
      textColor: "text-emerald-700",
      barColor: "bg-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  if (pct >= 50)
    return {
      label: "Developing",
      textColor: "text-amber-700",
      barColor: "bg-amber-400",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    };
  return {
    label: "Needs work",
    textColor: "text-red-700",
    barColor: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  };
}

export const STAAR_TOPIC = "STAAR Math Readiness";
export const STAAR_PRACTICE_TOPIC = "STAAR Math Practice";
