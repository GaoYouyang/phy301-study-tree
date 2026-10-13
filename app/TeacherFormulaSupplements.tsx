import FormulaWalkthrough from "./FormulaWalkthrough";
import MathText from "./MathText";
import { teacherFormulaLessonsByModule } from "./teacher-formula-lessons";

type TeacherFormulaSupplementsProps = {
  moduleId: string;
};

function slideLabel(slides: number[]) {
  return slides.length === 1 ? `第 ${slides[0]} 页` : `第 ${slides.join("、")} 页`;
}

export default function TeacherFormulaSupplements({
  moduleId,
}: TeacherFormulaSupplementsProps) {
  const lessons = teacherFormulaLessonsByModule.get(moduleId) ?? [];

  if (lessons.length === 0) return null;

  return (
    <section className="teacher-formula-supplements">
      <div className="reader-section-heading teacher-formula-heading">
        <span>TEACHER SLIDE GAP-FILL</span>
        <h2>老师课件漏步补丁</h2>
        <p>
          这里专门补齐课件中从“上一行”跳到“下一行”的代数、微积分与物理理由。原式先照录，再把中间步骤逐行展开；这一区始终保留在页面中，因此公式地图可以直接定位到对应推导。
        </p>
      </div>

      <div className="teacher-supplement-list">
        {lessons.map((lesson) => (
          <article className="teacher-supplement-card" key={lesson.derivation.id}>
            <header>
              <div>
                <span>
                  LECTURE {String(lesson.lecture).padStart(2, "0")} · {slideLabel(lesson.slides)}
                </span>
                <h3>{lesson.sourceTitle}</h3>
              </div>
              <small>{lesson.sourceFormulas.length} 条课件原式</small>
            </header>

            <div className="teacher-source-formulas" aria-label="老师课件原始公式">
              <b>课件原式</b>
              {lesson.sourceFormulas.map((formula, index) => (
                <div key={`${lesson.derivation.id}-source-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <MathText text={formula} display />
                </div>
              ))}
            </div>

            <FormulaWalkthrough
              id={`derivation-${lesson.derivation.id}`}
              derivation={lesson.derivation}
              compact
            />
          </article>
        ))}
      </div>
    </section>
  );
}
