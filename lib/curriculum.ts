import type { Grade } from "@/types";

export interface SubjectTopics {
  subject: string;
  topics: string[];
}

const K2_SUBJECTS: SubjectTopics[] = [
  {
    subject: "ELA / Phonics",
    topics: [
      "Rhyming",
      "Blending & Segmenting",
      "CVC Words",
      "Sight Words",
      "Letter-Sound Correspondence",
      "Handwriting Practice",
    ],
  },
  {
    subject: "Reading",
    topics: [
      "Reading Comprehension",
      "Sequencing",
      "Main Idea",
      "Compare & Contrast",
      "Text Features",
    ],
  },
  {
    subject: "Writing",
    topics: [
      "Complete Sentences",
      "Procedural Writing",
      "Prepositions",
      "Capitalization & Punctuation",
    ],
  },
  {
    subject: "Math",
    topics: [
      "Counting",
      "Addition & Subtraction",
      "2D & 3D Shapes",
      "Measurement",
      "Telling Time",
      "Data & Graphs",
      "Money",
    ],
  },
  {
    subject: "Science",
    topics: [
      "Plant Parts & Life Cycles",
      "Animal Structures",
      "Weather & Seasons",
      "Habitats",
    ],
  },
  {
    subject: "Social Studies",
    topics: [
      "Community Helpers",
      "Needs & Wants",
      "Maps & Globes",
      "Landforms",
      "Rules & Laws",
    ],
  },
];

const G35_SUBJECTS: SubjectTopics[] = [
  {
    subject: "ELA",
    topics: [
      "Informational Text",
      "Author's Purpose",
      "Text Structure",
      "Research Skills",
      "Vocabulary in Context",
      "Correspondence Writing",
    ],
  },
  {
    subject: "Math",
    topics: [
      "Multiplication & Division",
      "Fractions",
      "Decimals",
      "Measurement (Time, Capacity, Weight)",
      "Data Analysis",
      "Financial Literacy",
      "Geometry",
      "Area & Perimeter",
    ],
  },
  {
    subject: "Science",
    topics: [
      "Life Cycles",
      "Food Chains & Webs",
      "Ecosystems",
      "Fossils",
      "States of Matter",
      "Force & Motion",
      "Earth & Space",
    ],
  },
  {
    subject: "Social Studies",
    topics: [
      "Economics & Free Enterprise",
      "Government",
      "Geography",
      "Historical Figures",
      "Timelines",
      "Cultures",
    ],
  },
];

const G68_SUBJECTS: SubjectTopics[] = [
  {
    subject: "ELA",
    topics: [
      "Argumentative Writing",
      "Literary Analysis",
      "Research Papers",
      "Grammar & Mechanics",
      "Rhetoric",
      "Media Literacy",
    ],
  },
  {
    subject: "Math",
    topics: [
      "Ratios & Proportions",
      "Expressions & Equations",
      "Integers",
      "Geometry",
      "Statistics & Probability",
      "Linear Functions",
      "Pythagorean Theorem",
    ],
  },
  {
    subject: "Science",
    topics: [
      "Cells & Body Systems",
      "Genetics",
      "Chemistry Basics",
      "Physics (Force & Energy)",
      "Earth Science",
      "Ecology",
    ],
  },
  {
    subject: "Social Studies",
    topics: [
      "Ancient Civilizations",
      "US History",
      "World Geography",
      "Civics & Government",
      "Economics",
    ],
  },
];

export function getSubjectsForGrade(grade: Grade): SubjectTopics[] {
  if (grade === "K" || grade === "1" || grade === "2") {
    return K2_SUBJECTS;
  }
  if (grade === "3" || grade === "4" || grade === "5") {
    return G35_SUBJECTS;
  }
  return G68_SUBJECTS;
}

export function getTopicsForSubjectAndGrade(
  grade: Grade,
  subject: string
): string[] {
  const subjects = getSubjectsForGrade(grade);
  const found = subjects.find((s) => s.subject === subject);
  return found?.topics ?? [];
}

export const ALL_GRADES: Grade[] = ["K", "1", "2", "3", "4", "5", "6", "7", "8"];

export function gradeLabel(grade: Grade): string {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}
