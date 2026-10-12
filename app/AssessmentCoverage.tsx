import {
  assessmentCoverageCount,
  assessmentCoverageGroups,
} from "./assessment-coverage";
import { modules } from "./course-data";
import MathText from "./MathText";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function assetHref(href: string) {
  return href.startsWith("/") ? `${BASE_PATH}${href}` : href;
}

export default function AssessmentCoverage({
  onOpenModule,
}: {
  onOpenModule: (moduleId: string) => void;
}) {
  return (
    <section className="assessment-coverage" aria-labelledby="assessment-coverage-title">
      <div className="assessment-coverage-heading">
        <div>
          <span>SUBPART TRACEABILITY</span>
          <h2 id="assessment-coverage-title">65 个小问逐项覆盖矩阵</h2>
          <p>
            大题卡负责给路线；这里逐项核对题面、答案页、知识节点和完成标准。不要因为“大题做过”就跳过其中一个小问。
          </p>
        </div>
        <strong>{assessmentCoverageCount}/65</strong>
      </div>

      <details className="assessment-coverage-shell">
        <summary>
          展开全部小问清单
          <span>作业 1–3：50 项 · 期中：15 项</span>
        </summary>
        <div className="assessment-coverage-groups">
          {assessmentCoverageGroups.map((group) => (
            <details className={`coverage-group group-${group.id}`} key={group.id}>
              <summary>
                <b>{group.title}</b>
                <span>{group.parts.length} 项已映射</span>
              </summary>
              <div className="coverage-source-links">
                <a href={assetHref(group.questionHref)} target="_blank" rel="noreferrer">
                  打开题面 ↗
                </a>
                <a href={assetHref(group.solutionHref)} target="_blank" rel="noreferrer">
                  打开答案/评分稿 ↗
                </a>
              </div>
              <div className="coverage-part-list">
                {group.parts.map((part) => {
                  const target = modules.find((module) => module.id === part.target);
                  return (
                    <article className="coverage-part" key={part.id}>
                      <div className="coverage-part-id">{part.id}</div>
                      <div className="coverage-part-main">
                        <h3><MathText text={part.task} /></h3>
                        <p>
                          <b>完成标准：</b>
                          <MathText text={part.pass} />
                        </p>
                        {part.caution && (
                          <p className="coverage-caution">
                            <b>资料提醒：</b>
                            <MathText text={part.caution} />
                          </p>
                        )}
                      </div>
                      <div className="coverage-part-route">
                        <span>{part.questionPage}</span>
                        <span>{part.solutionPage}</span>
                        {target && (
                          <button type="button" onClick={() => onOpenModule(target.id)}>
                            回到：<MathText text={target.title} />
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </details>
    </section>
  );
}
