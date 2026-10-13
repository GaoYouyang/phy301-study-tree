import { teacherFormulaLessons0103 } from "./teacher-formula-lessons-01-03";
import { teacherFormulaLessons0406 } from "./teacher-formula-lessons-04-06";
import { teacherFormulaLessons0710 } from "./teacher-formula-lessons-07-10";
import type { TeacherFormulaLesson } from "./teacher-formula-types";

export const teacherFormulaLessons: TeacherFormulaLesson[] = [
  ...teacherFormulaLessons0103,
  ...teacherFormulaLessons0406,
  ...teacherFormulaLessons0710,
];

export const teacherFormulaLessonById = new Map(
  teacherFormulaLessons.map((lesson) => [lesson.derivation.id, lesson]),
);

export const teacherFormulaLessonsByModule = new Map<
  string,
  TeacherFormulaLesson[]
>();
for (const lesson of teacherFormulaLessons) {
  const current = teacherFormulaLessonsByModule.get(lesson.moduleId) ?? [];
  teacherFormulaLessonsByModule.set(lesson.moduleId, [...current, lesson]);
}
