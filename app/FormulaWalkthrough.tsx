import MathText from "./MathText";
import type { FormulaDerivation } from "./formula-derivation-types";

type FormulaWalkthroughProps = {
  derivation: FormulaDerivation;
  id?: string;
  compact?: boolean;
  exampleAvailable?: boolean;
};

const walkthroughAction: Record<FormulaDerivation["kind"], string> = {
  定义: "逐项拆开定义",
  "公设 / 经验定律": "说明物理来源与后续计算",
  恒等式: "逐行验证恒等变形",
  模型: "说明建模来源与计算链",
  近似: "补全近似条件与推导",
  推导结果: "补全中间推导",
  解题框架: "逐步执行解题链",
};

export default function FormulaWalkthrough({
  derivation,
  id,
  compact = false,
  exampleAvailable = false,
}: FormulaWalkthroughProps) {
  return (
    <details
      id={id}
      className={`formula-walkthrough${compact ? " compact" : ""}`}
    >
      <summary>
        <span>
          <b>{walkthroughAction[derivation.kind]}</b>
          <small>
            {derivation.kind} · {derivation.steps.length} 个连续步骤
          </small>
        </span>
      </summary>
      <div className="formula-walkthrough-body">
        <div className="formula-origin">
          <span>{derivation.kind}</span>
          <div>
            <b>{derivation.title} · 这条式子从哪里来</b>
            <p><MathText text={derivation.origin} /></p>
          </div>
        </div>

        {derivation.symbols.length > 0 && (
          <div className="formula-symbols">
            <b>先认清每个符号</b>
            <dl>
              {derivation.symbols.map((item) => (
                <div key={`${item.symbol}-${item.meaning}`}>
                  <dt><MathText text={item.symbol} /></dt>
                  <dd><MathText text={item.meaning} /></dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="formula-conditions">
          <div>
            <b>先会什么</b>
            <ul>
              {derivation.prerequisites.map((item) => (
                <li key={item}><MathText text={item} /></li>
              ))}
            </ul>
          </div>
          <div>
            <b>成立条件</b>
            <ul>
              {derivation.assumptions.map((item) => (
                <li key={item}><MathText text={item} /></li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="formula-proof-steps">
          {derivation.steps.map((step, index) => (
            <li key={`${step.title}-${step.formula}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <b>{step.title}</b>
                <MathText text={step.formula} display />
                <p><MathText text={step.explanation} /></p>
              </div>
            </li>
          ))}
        </ol>

        <div className="formula-conclusion">
          <b>最后得到</b>
          <p><MathText text={derivation.conclusion} /></p>
        </div>

        <div className="formula-proof-checks">
          <b>不要急着背，先检查</b>
          <ul>
            {derivation.checks.map((item) => (
              <li key={item}><MathText text={item} /></li>
            ))}
          </ul>
          {exampleAvailable && (
            <p>推导看完后，继续做紧接在下方的“完整例题”，把公式真正算一遍。</p>
          )}
        </div>

        {derivation.evidence && derivation.evidence.length > 0 && (
          <div className="formula-evidence">
            <b>老师材料锚点</b>
            <p>{derivation.evidence.join(" · ")}</p>
          </div>
        )}
      </div>
    </details>
  );
}
