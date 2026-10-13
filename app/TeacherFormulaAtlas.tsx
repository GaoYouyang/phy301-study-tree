"use client";

import { useMemo, useState } from "react";
import MathText from "./MathText";
import { formulaDerivations } from "./formula-derivations";
import { teacherFormulaLessons } from "./teacher-formula-lessons";
import sourceManifestJson from "./teacher-slide-formulas.generated.json";

type SourceFormula = {
  id: string;
  formula: string;
  note: string;
  status: string;
  routeIds: string[];
  coverage: "dedicated-supplement" | "existing-chain";
};

type SourceSlide = {
  slide: number;
  title: string;
  translation: string;
  explanation: string;
  prerequisites: string[];
  mistakes: string[];
  formulas: SourceFormula[];
};

type SourceLecture = {
  lecture: number;
  sourceFile: string;
  slideCount: number;
  formulaCount: number;
  slides: SourceSlide[];
};

type TeacherFormulaSourceManifest = {
  course: string;
  sourceLectureCount: number;
  sourceSlideCount: number;
  totalFormulaOccurrences: number;
  derivationChainCount: number;
  dedicatedTeacherSupplementCount: number;
  lectures: SourceLecture[];
};

type TeacherFormulaAtlasProps = {
  onOpenDerivation: (moduleId: string, derivationId: string) => void;
};

const sourceManifest = sourceManifestJson as TeacherFormulaSourceManifest;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const routeById = new Map<string, { moduleId: string; title: string }>([
  ...Object.entries(formulaDerivations).map(
    ([occurrence, derivation]): [string, { moduleId: string; title: string }] => [
      derivation.id,
      { moduleId: occurrence.split(":")[1], title: derivation.title },
    ],
  ),
  ...teacherFormulaLessons.map(
    (lesson): [string, { moduleId: string; title: string }] => [
      lesson.derivation.id,
      { moduleId: lesson.moduleId, title: lesson.derivation.title },
    ],
  ),
]);

function sourceFileName(sourceFile: string) {
  return sourceFile.split("/").at(-1) ?? sourceFile;
}

function sourceFileHref(sourceFile: string) {
  const publicPath = sourceFile.replace(/^public/u, "");
  return `${BASE_PATH}${publicPath.startsWith("/") ? publicPath : `/${publicPath}`}`;
}

function bilingualLectureHref(lecture: number) {
  const lectureId = String(lecture).padStart(2, "0");
  return `${BASE_PATH}/materials/lecture-${lectureId}_中英逐页精讲.pptx`;
}

function searchableSlideText(slide: SourceSlide) {
  return [
    slide.title,
    slide.translation,
    slide.explanation,
    ...slide.prerequisites,
    ...slide.mistakes,
  ]
    .join(" ")
    .toLowerCase();
}

function searchableFormulaText(formula: SourceFormula) {
  return [
    formula.formula,
    formula.note,
    ...formula.routeIds.flatMap((routeId) => {
      const route = routeById.get(routeId);
      return route ? [routeId, route.title] : [routeId];
    }),
  ]
    .join(" ")
    .toLowerCase();
}

export default function TeacherFormulaAtlas({
  onOpenDerivation,
}: TeacherFormulaAtlasProps) {
  const [selectedLectureNumber, setSelectedLectureNumber] = useState(
    sourceManifest.lectures[0]?.lecture ?? 1,
  );
  const [query, setQuery] = useState("");
  const selectedLecture =
    sourceManifest.lectures.find(
      (lecture) => lecture.lecture === selectedLectureNumber,
    ) ?? sourceManifest.lectures[0];
  const normalizedQuery = query.trim().toLowerCase();

  const visibleSlides = useMemo(() => {
    if (!selectedLecture) return [];
    if (!normalizedQuery) return selectedLecture.slides;

    return selectedLecture.slides.flatMap((slide) => {
      const slideMatches = searchableSlideText(slide).includes(normalizedQuery);
      const formulas = slideMatches
        ? slide.formulas
        : slide.formulas.filter((formula) =>
            searchableFormulaText(formula).includes(normalizedQuery),
          );
      return formulas.length > 0 ? [{ ...slide, formulas }] : [];
    });
  }, [normalizedQuery, selectedLecture]);

  const visibleFormulaCount = visibleSlides.reduce(
    (sum, slide) => sum + slide.formulas.length,
    0,
  );

  if (!selectedLecture) return null;

  return (
    <section className="teacher-formula-atlas" aria-labelledby="teacher-formula-atlas-title">
      <header className="teacher-atlas-heading">
        <div>
          <span>TEACHER SOURCE ATLAS</span>
          <h2 id="teacher-formula-atlas-title">按老师课件原页查公式</h2>
          <p>
            这里逐条保留 10 讲课件中的 629 个公式与符号条目，并把每条原式送到相关的完整推导链。定义、公设与数量级会解释物理来源，不会伪造成可由代数证明的结论。
          </p>
        </div>
        <div className="teacher-atlas-stat" aria-label="老师课件公式覆盖统计">
          <strong>{sourceManifest.totalFormulaOccurrences}/629</strong>
          <span>课件原式条目可追溯</span>
          <small>{sourceManifest.sourceSlideCount} 页 · {sourceManifest.derivationChainCount} 条推导链</small>
        </div>
      </header>

      <div className="teacher-lecture-picker" aria-label="选择课件讲次">
        {sourceManifest.lectures.map((lecture) => (
          <button
            type="button"
            className={lecture.lecture === selectedLecture.lecture ? "active" : ""}
            aria-pressed={lecture.lecture === selectedLecture.lecture}
            key={lecture.lecture}
            onClick={() => {
              setSelectedLectureNumber(lecture.lecture);
              setQuery("");
            }}
          >
            <b>L{String(lecture.lecture).padStart(2, "0")}</b>
            <span>{lecture.formulaCount} 条</span>
          </button>
        ))}
      </div>

      <div className="teacher-atlas-toolbar">
        <div>
          <span>当前课件</span>
          <b>Lecture {String(selectedLecture.lecture).padStart(2, "0")}</b>
          <small>
            {sourceFileName(selectedLecture.sourceFile)} · 全课件 {selectedLecture.slideCount} 页 · 含公式页 {selectedLecture.slides.length} 页
          </small>
          <div className="teacher-atlas-source-actions">
            <a href={sourceFileHref(selectedLecture.sourceFile)} download>
              下载英文原课件
            </a>
            <a href={bilingualLectureHref(selectedLecture.lecture)} download>
              下载中英逐页精讲
            </a>
          </div>
        </div>
        <label>
          <span className="sr-only">在当前讲次搜索课件公式</span>
          <input
            type="search"
            value={query}
            placeholder="在本讲搜索公式、标题、中文解释…"
            onChange={(event) => setQuery(event.target.value)}
          />
          <small>{visibleFormulaCount}/{selectedLecture.formulaCount} 条当前可见</small>
        </label>
      </div>

      {visibleSlides.length > 0 ? (
        <div className="teacher-slide-list" aria-live="polite">
          {visibleSlides.map((slide) => (
            <article className="teacher-slide-card" key={`${selectedLecture.lecture}-${slide.slide}`}>
              <header>
                <div className="teacher-slide-index">
                  <span>原课件页</span>
                  <strong>{String(slide.slide).padStart(2, "0")}</strong>
                </div>
                <div>
                  <small>LECTURE {String(selectedLecture.lecture).padStart(2, "0")}</small>
                  <h3>{slide.title || "未命名课件页"}</h3>
                  <p>{slide.translation}</p>
                </div>
              </header>

              <div className="teacher-slide-explanation">
                <span>这页在讲什么</span>
                <p><MathText text={slide.explanation} /></p>
              </div>

              {(slide.prerequisites.length > 0 || slide.mistakes.length > 0) && (
                <div className="teacher-slide-context">
                  <div>
                    <b>先修与回链</b>
                    {slide.prerequisites.length > 0 ? (
                      <ul>
                        {slide.prerequisites.map((item) => (
                          <li key={item}><MathText text={item} /></li>
                        ))}
                      </ul>
                    ) : (
                      <p>本页没有额外前置要求。</p>
                    )}
                  </div>
                  <div>
                    <b>常见误读</b>
                    {slide.mistakes.length > 0 ? (
                      <ul>
                        {slide.mistakes.map((item) => (
                          <li key={item}><MathText text={item} /></li>
                        ))}
                      </ul>
                    ) : (
                      <p>按本页说明与推导条件核对即可。</p>
                    )}
                  </div>
                </div>
              )}

              <div className="teacher-slide-formulas">
                {slide.formulas.map((formula, formulaIndex) => (
                  <article id={`teacher-source-${formula.id}`} key={formula.id}>
                    <div className="teacher-source-line">
                      <span>{String(formulaIndex + 1).padStart(2, "0")}</span>
                      <small>
                        {formula.coverage === "dedicated-supplement"
                          ? "已补专门漏步推导"
                          : "已连接相关推导链"}
                      </small>
                    </div>
                    <MathText text={formula.formula} display />
                    <p><MathText text={formula.note} /></p>
                    <div className="teacher-formula-routes">
                      <b>去看推导与解释</b>
                      <div>
                        {formula.routeIds.flatMap((routeId) => {
                          const route = routeById.get(routeId);
                          if (!route) return [];
                          return [
                            <a
                              href={`#derivation-${routeId}`}
                              key={routeId}
                              onClick={(event) => {
                                if (
                                  event.metaKey ||
                                  event.ctrlKey ||
                                  event.shiftKey ||
                                  event.altKey
                                )
                                  return;
                                event.preventDefault();
                                onOpenDerivation(route.moduleId, routeId);
                              }}
                            >
                              {route.title} →
                            </a>,
                          ];
                        })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state teacher-atlas-empty" aria-live="polite">
          <b>本讲没有匹配的课件原式</b>
          <p>试试公式符号、英文页标题、中文概念或推导链名称。</p>
          <button type="button" onClick={() => setQuery("")}>清除本讲搜索</button>
        </div>
      )}
    </section>
  );
}

export { sourceManifest as teacherFormulaSourceManifest };
