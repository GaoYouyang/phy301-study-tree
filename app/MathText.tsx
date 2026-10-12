import katex from "katex";
import type { ReactNode } from "react";

type MathTextProps = {
  text: string;
  display?: boolean;
  className?: string;
};

type Segment = {
  kind: "text" | "math";
  value: string;
  display?: boolean;
  literalLatex?: boolean;
};

const greekSymbols: Record<string, string> = {
  α: "\\alpha",
  β: "\\beta",
  γ: "\\gamma",
  Γ: "\\Gamma",
  δ: "\\delta",
  Δ: "\\Delta",
  ε: "\\varepsilon",
  ζ: "\\zeta",
  η: "\\eta",
  θ: "\\theta",
  Θ: "\\Theta",
  κ: "\\kappa",
  λ: "\\lambda",
  μ: "\\mu",
  ν: "\\nu",
  ξ: "\\xi",
  π: "\\pi",
  Π: "\\prod",
  ρ: "\\rho",
  σ: "\\sigma",
  Σ: "\\sum",
  τ: "\\tau",
  φ: "\\varphi",
  Φ: "\\Phi",
  χ: "\\chi",
  ψ: "\\psi",
  Ψ: "\\Psi",
  ω: "\\omega",
  Ω: "\\Omega",
  Ξ: "\\Xi",
};

const superscriptCharacters: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "-",
  "ᵀ": "\\mathsf T",
  "ᴺ": "N",
  "ᴱ": "E",
  "ᵝ": "\\beta ",
  "ⁿ": "n",
};

const subscriptCharacters: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "₊": "+",
  "₋": "-",
  "ₐ": "a",
  "ᵇ": "b",
};

const strongMathMarker =
  /[=+*/^<>≤≥≪≫≈≃∼∝±∓∂∫∇ΣΠ√∞⟨⟩→↔⇌⇒⇔−·×÷∈∉∪∩⊂⊃|½′″†Ĥū-]|[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹ᴱᵝⁿ]/u;
const substantiveMathMarker =
  /[=+*^<>≤≥≪≫≈≃∼∝±∓∂∫∇ΣΠ√∞⟨⟩⇌⇒⇔−×÷∈∉∪∩⊂⊃½′″†Ĥū]|[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹ᴱᵝⁿ]/u;
const standaloneMathToken =
  /^(?:[A-Za-z]|[A-Za-z]_[A-Za-z0-9{}]+|[α-ωΑ-Ωℏ]|d[A-Za-z]|kB(?:T)?|C[PV]|T[cD]|kF|εF|λT|ΦG|ΩG|Var|Cov|Tr|det|exp|ln|tanh|cosh|sinh|erf)$/u;
const legacyMathRun =
  /[A-Za-z0-9_α-ωΑ-Ωℏ∞∂∫∇ΣΠ√⟨⟩≤≥≪≫≈≃∼∝±∓→↔⇌⇒⇔−·×÷∈∉∪∩⊂⊃½†ṽĤū₀-₉ₐᵇ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵀᴺᴱᵝⁿ̄̇′″'{}()[\],.;:!%|/+*^=<>\\\s-]+/gu;

function convertCaretGroups(source: string) {
  let output = "";

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const opener = source[index + 1];
    if (character !== "^" || (opener !== "(" && opener !== "[")) {
      output += character;
      continue;
    }

    const closer = opener === "(" ? ")" : "]";
    let depth = 1;
    let end = index + 2;
    for (; end < source.length && depth > 0; end += 1) {
      if (source[end] === opener) depth += 1;
      if (source[end] === closer) depth -= 1;
    }

    if (depth !== 0) {
      output += character;
      continue;
    }

    output += `^{${source.slice(index + 2, end - 1)}}`;
    index = end - 1;
  }

  return output;
}

function escapeTexText(value: string) {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}%&#_$])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function convertUnicodeScripts(value: string) {
  return value
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵀᴺᴱᵝⁿ]+/gu, (run) => {
      const converted = [...run]
        .map((character) => superscriptCharacters[character] ?? character)
        .join("");
      return `^{${converted}}`;
    })
    .replace(/[₀₁₂₃₄₅₆₇₈₉₊₋ₐᵇ]+/gu, (run) => {
      const converted = [...run]
        .map((character) => subscriptCharacters[character] ?? character)
        .join("");
      return `_{${converted}}`;
    });
}

function wrapPlainLanguage(value: string) {
  return value
    .replace(/[\u3400-\u9fff]+/gu, (run) => `\\text{${escapeTexText(run)}}`)
    .replace(/(?<!\\)\b[A-Za-z]{3,}\b/g, (word) => {
      if (
        /^(?:exp|ln|log|lim|max|min|det|Var|Cov|Tr|erf|tanh|sinh|cosh|sech)$/i.test(
          word,
        )
      ) {
        return word;
      }
      if (
        /^[a-z]{3,}$/.test(word) ||
        /^(?:Carnot|Debye|Boson|Fermion|Fourier|Gaussian|Ising|Landau|Laplace|Maxwell|Boltzmann|Stirling|Waals)$/.test(
          word,
        )
      ) {
        return `\\text{${escapeTexText(word)}}`;
      }
      return word;
    });
}

/**
 * Converts the compact notation used in the course notes into valid KaTeX.
 * New content may use ordinary TeX directly between $...$ or $$...$$.
 */
export function legacyMathToLatex(source: string) {
  let value = convertCaretGroups(source.trim())
    .replace(/lnpi\b/g, "\\ln p_i")
    .replace(/ln([A-ZΩΞΔ])\b/gu, "\\ln $1")
    .replace(/Σεini/gu, "\\sum_i ε_i n_i")
    .replace(/Σninj/gu, "\\sum_{i,j} n_i n_j")
    .replace(/Σz\^NZN/gu, "\\sum_N z^N Z_N");

  value = wrapPlainLanguage(value);

  value = value
    .replace(/（/gu, "\\;(")
    .replace(/）/gu, ")")
    .replace(/；/gu, "\\qquad ")
    .replace(/，/gu, ",\\; ")
    .replace(/。/gu, "\\text{。}")
    .replace(/∫₋∞\^∞/gu, "\\int_{-\\infty}^{\\infty}")
    .replace(/∫₀∞/gu, "\\int_{0}^{\\infty}")
    .replace(/∫ₐᵇ/gu, "\\int_{a}^{b}")
    .replace(/\^εF/gu, "^{ε_{F}}")
    .replace(/d³N([pq])/gu, "d^{3N}$1")
    .replace(/Σi,α\s*εi\s*niα/gu, "\\sum_{i,α} ε_i n_{iα}")
    .replace(/Σi,α\s*niα/gu, "\\sum_{i,α} n_{iα}")
    .replace(/Σiαεi\s*niα/gu, "\\sum_{i,α} ε_i n_{iα}")
    .replace(/Σiαniα/gu, "\\sum_{i,α} n_{iα}")
    .replace(/ΣipiEi/gu, "\\sum_{i} p_i E_i")
    .replace(/Σipi/gu, "\\sum_{i} p_i")
    .replace(/Σ\\text\{ipi\}/gu, "\\sum_{i} p_i")
    .replace(/Σiεini/gu, "\\sum_{i} ε_i n_i")
    .replace(/Σεini/gu, "\\sum_{i} ε_i n_i")
    .replace(/Σini/gu, "\\sum_{i} n_i")
    .replace(/Σninj/gu, "\\sum_{i,j} n_i n_j")
    .replace(/Σni/gu, "\\sum_{i} n_i")
    .replace(/Σnp\(n\)/gu, "\\sum_n n p(n)")
    .replace(/Σpα/gu, "\\sum_{α}p_{α}")
    .replace(/Σαpα/gu, "\\sum_{α}p_{α}")
    .replace(/Σ⟨ij⟩/gu, "\\sum_{⟨ij⟩}")
    .replace(/Σi≠j/gu, "\\sum_{i≠j}")
    .replace(/Σn≥0/gu, "\\sum_{n≥0}")
    .replace(/Σn=0∞/gu, "\\sum_{n=0}^{∞}")
    .replace(/ΣN=0∞/gu, "\\sum_{N=0}^{∞}")
    .replace(/Σz\^\{N\}ZN/gu, "\\sum_N z^{N} Z_N")
    .replace(/Σ\\text\{level\}/gu, "\\sum_{\\mathrm{level}}")
    .replace(/Σ\\text\{states\}/gu, "\\sum_{\\text{states}}")
    .replace(/Σ([iNnkα])/gu, "\\sum_{$1}")
    .replace(/Πi/gu, "\\prod_{i}")
    .replace(/([A-Za-zα-ωΑ-Ω])′/gu, "$1^{\\prime}")
    .replace(/([A-Za-zα-ωΑ-Ω])″/gu, "$1^{\\prime\\prime}")
    .replace(/([A-Za-zρ])†/gu, "$1^{\\dagger}")
    .replace(/½/gu, "\\frac{1}{2}")
    .replace(/†/gu, "\\dagger ")
    .replace(/ṽ/gu, "\\dot{v}")
    .replace(/Ĥ/gu, "\\hat{H}")
    .replace(/ū/gu, "\\bar{u}")
    .replace(/([qp])̇i/gu, "\\dot{$1}_{i}")
    .replace(/∂([qp])̇/gu, "\\partial \\dot{$1}")
    .replace(/n̄([A-Za-z])/gu, "\\bar{n}_{$1}")
    .replace(/niα/gu, "n_{iα}")
    .replace(/ψα/gu, "ψ_{α}")
    .replace(/pα/gu, "p_{α}")
    .replace(/ε([iFx])/gu, "ε_{$1}")
    .replace(/σ([ijE])/gu, "σ_{$1}")
    .replace(/ρ(eq|gc|c)\b/gu, "ρ_{$1}")
    .replace(/∂([qpx])i/gu, "\\partial_{$1_i}")
    .replace(/∂²([tβμxEVPTNq])/gu, "\\partial_{$1}^{2}")
    .replace(/∂([tβμxEVPTNq])/gu, "\\partial_{$1}")
    .replace(/∇Γ/gu, "∇_{Γ}")
    .replace(/vΓ/gu, "v_{Γ}")
    .replace(/ΦG/gu, "Φ_{G}")
    .replace(/λT/gu, "λ_{T}")
    .replace(/κT/gu, "κ_{T}")
    .replace(/Ξ([BF])/gu, "Ξ_{$1}")
    .replace(/Ω\\text\{(bath|shell)\}/gu, "Ω_{\\mathrm{$1}}")
    .replace(/Ξ\\text\{ideal\}/gu, "Ξ_{\\mathrm{ideal}}")
    .replace(/\b(Zquantum|Zclassical|Uideal)\b/gu, (token) => {
      const [symbol, label] = [token[0], token.slice(1)];
      return `${symbol}_{\\mathrm{${label}}}`;
    })
    .replace(/\b([ZUp])q,1\b/gu, "$1_{q,1}")
    .replace(/\b([pE])N,i\b/gu, "$1_{N,i}")
    .replace(/\bP12(?=Ψ)/gu, "P_{12}")
    .replace(/\bD2D\b/gu, "D_{2\\mathrm D}")
    .replace(/\bfFD\b/gu, "f_{\\mathrm{FD}}")
    .replace(/\bg([35])\/2(?=\()/gu, "g_{$1/2}")
    .replace(/Pcoex/gu, "P_{\\mathrm{coex}}")
    .replace(/\bPeq\b/gu, "P_{\\mathrm{eq}}")
    .replace(/Stot/gu, "S_{\\mathrm{tot}}")
    .replace(/dE([12])/gu, "dE_{$1}")
    .replace(/\bSd-1\b/gu, "S_{d-1}")
    .replace(/\bVd(?=\()/gu, "V_d")
    .replace(/\b([AEWgnpqxy])i\b/gu, "$1_i")
    .replace(/\b([CEFNPSTan])([012])\b/gu, "$1_{$2}")
    .replace(/\bgs\b/gu, "g_s")
    .replace(/σE/gu, "σ_E")
    .replace(/\bx\*/gu, "x^{*}")
    .replace(/(?<![_^])\{([^{}]+,[^{}]+)\}/gu, "\\{$1\\}")
    .replace(/(?<!\\)%/gu, "\\%");

  value = convertUnicodeScripts(value)
    .replace(/([A-Za-z0-9}\]])\u0304/gu, "\\bar{$1}")
    .replace(/([A-Za-zα-ωΑ-Ω])\u0307/gu, "\\dot{$1}")
    .replace(/ℏ/gu, "\\hbar ")
    .replace(/∞/gu, "\\infty ")
    .replace(/∂/gu, "\\partial ")
    .replace(/∫/gu, "\\int ")
    .replace(/∇/gu, "\\nabla ")
    .replace(/√/gu, "\\sqrt")
    .replace(/⟨/gu, "\\langle ")
    .replace(/⟩/gu, "\\rangle ")
    .replace(/≤/gu, "\\le ")
    .replace(/≥/gu, "\\ge ")
    .replace(/≪/gu, "\\ll ")
    .replace(/≫/gu, "\\gg ")
    .replace(/≈|≃/gu, "\\approx ")
    .replace(/∼/gu, "\\sim ")
    .replace(/∝/gu, "\\propto ")
    .replace(/±/gu, "\\pm ")
    .replace(/∓/gu, "\\mp ")
    .replace(/→/gu, "\\longrightarrow ")
    .replace(/↔/gu, "\\longleftrightarrow ")
    .replace(/⇌/gu, "\\rightleftharpoons ")
    .replace(/⇒/gu, "\\Longrightarrow ")
    .replace(/⇔/gu, "\\Longleftrightarrow ")
    .replace(/−/gu, "-")
    .replace(/·/gu, "\\cdot ")
    .replace(/×/gu, "\\times ")
    .replace(/÷/gu, "\\div ")
    .replace(/∈/gu, "\\in ")
    .replace(/∉/gu, "\\notin ")
    .replace(/∪/gu, "\\cup ")
    .replace(/∩/gu, "\\cap ")
    .replace(/⊂/gu, "\\subset ")
    .replace(/⊃/gu, "\\supset ");

  for (const [symbol, latex] of Object.entries(greekSymbols)) {
    value = value.replaceAll(symbol, `${latex} `);
  }

  value = value
    .replace(/(?<!\\)\bpi\b/g, "p_i")
    .replace(/\bEi\b/g, "E_i")
    .replace(/\bEn\b/g, "E_n")
    .replace(/\bgi\b/g, "g_i")
    .replace(/\bni\b/g, "n_i")
    .replace(/\bqi\b/g, "q_i")
    .replace(/\bZN\b/g, "Z_N")
    .replace(/\bHint\b/g, "H_{\\mathrm{int}}")
    .replace(/kBT/g, "k_{\\mathrm B}T")
    .replace(/kB/g, "k_{\\mathrm B}")
    .replace(/CV/g, "C_V")
    .replace(/CP/g, "C_P")
    .replace(/Tc/g, "T_c")
    .replace(/TD/g, "T_D")
    .replace(/kF/g, "k_F")
    .replace(/(?<!\\operatorname\{)\bVar\b/g, "\\operatorname{Var}")
    .replace(/\bVarN\b/g, "\\operatorname{Var}(N)")
    .replace(/(?<!\\operatorname\{)\bCov\b/g, "\\operatorname{Cov}")
    .replace(/(?<!\\operatorname\{)\bTr\b/g, "\\operatorname{Tr}")
    .replace(/(?<!\\)\bdet\b/g, "\\det")
    .replace(/\bdetA\b/g, "\\det A")
    .replace(/(?<!\\)\bexp\b/g, "\\exp")
    .replace(/(?<!\\)\bln\b/g, "\\ln")
    .replace(/(?<!\\)\blog\b/g, "\\log")
    .replace(/(?<!\\)\btanh\b/g, "\\tanh")
    .replace(/(?<!\\)\bsinh\b/g, "\\sinh")
    .replace(/(?<!\\)\bcosh\b/g, "\\cosh")
    .replace(/(?<!\\)\berf\b/g, "\\operatorname{erf}")
    .replace(/(?<!\\)\blim\b/g, "\\lim")
    .replace(/(?<!\\)ln(?=[A-Z]|\\(?:Omega|Xi|Delta))/g, "\\ln ")
    .replace(/(?<![A-Za-z])or(?![A-Za-z])/g, "\\text{or}")
    .replace(/(?<![A-Za-z])to(?![A-Za-z])/g, "\\text{to}")
    .replace(/\\sqrt\(([^()]*)\)/g, "\\sqrt{$1}")
    .replace(/\\sqrt\[([^\]]*)\]/g, "\\sqrt{$1}")
    .replace(/\\sqrt([A-Za-z]+(?:\([^)]*\))?)/g, "\\sqrt{$1}");

  return value.replace(/\s{2,}/g, " ").trim();
}

function isLikelyMath(value: string) {
  const compact = value.trim();
  if (!compact) return false;
  if (/^[a-z]+(?:-[a-z]+)+$/.test(compact)) return false;
  if (/^(?:\d+\s*)?·?\s*Q\d+\b/i.test(compact)) return false;
  if (/\b[A-Za-z]{3,}\b/.test(compact) && !substantiveMathMarker.test(compact)) {
    return false;
  }
  if (strongMathMarker.test(compact)) {
    return (
      /[A-Za-z0-9α-ωΑ-Ωℏ½ṽĤū₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹ᴱᵝⁿ]/u.test(compact) ||
      /^[∂∫∇ΣΠ√∞⟨⟩≤≥±∓→↔⇌⇒⇔]+$/u.test(compact)
    );
  }
  if (standaloneMathToken.test(compact)) return true;
  if (/^[A-Z](?:,[A-Zα-ωΑ-Ω]){1,}$/u.test(compact)) return true;
  if (/^[A-Za-zα-ωΑ-Ω]+\([^)]{1,50}\)$/u.test(compact)) return true;
  return false;
}

function splitLegacyText(value: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of value.matchAll(legacyMathRun)) {
    const start = match.index ?? 0;
    const raw = match[0];
    const leading = raw.match(/^\s*/u)?.[0] ?? "";
    const trailing = raw.match(/\s*$/u)?.[0] ?? "";
    const candidate = raw.slice(leading.length, raw.length - trailing.length);
    const mathStart = start + leading.length;

    if (!candidate || !isLikelyMath(candidate)) continue;
    if (mathStart > cursor) {
      segments.push({ kind: "text", value: value.slice(cursor, mathStart) });
    }
    segments.push({ kind: "math", value: candidate });
    cursor = start + raw.length - trailing.length;
  }

  if (cursor < value.length) {
    segments.push({ kind: "text", value: value.slice(cursor) });
  }

  return segments.length ? segments : [{ kind: "text", value }];
}

export function splitMathText(value: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const start = value.indexOf("$", cursor);
    if (start === -1) {
      segments.push(...splitLegacyText(value.slice(cursor)));
      break;
    }
    if (start > cursor) {
      segments.push(...splitLegacyText(value.slice(cursor, start)));
    }

    const display = value.startsWith("$$", start);
    const delimiter = display ? "$$" : "$";
    const end = value.indexOf(delimiter, start + delimiter.length);
    if (end === -1) {
      segments.push(...splitLegacyText(value.slice(start)));
      break;
    }

    segments.push({
      kind: "math",
      value: value.slice(start + delimiter.length, end),
      display,
      literalLatex: true,
    });
    cursor = end + delimiter.length;
  }

  return segments;
}

function KatexFragment({
  source,
  display = false,
  literalLatex = false,
}: {
  source: string;
  display?: boolean;
  literalLatex?: boolean;
}) {
  const latex = literalLatex ? source.trim() : legacyMathToLatex(source);
  const html = katex.renderToString(latex, {
    displayMode: display,
    throwOnError: false,
    strict: "warn",
    trust: false,
    output: "htmlAndMathml",
  });

  return (
    <span
      className={display ? "katex-expression katex-expression-display" : "katex-expression"}
      data-math-source={source}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function MathText({ text, display = false, className }: MathTextProps) {
  if (display) {
    return (
      <span className={["math-text", "math-text-display", className].filter(Boolean).join(" ")}>
        <KatexFragment source={text.replace(/^\$\$?|\$\$?$/g, "")} display />
      </span>
    );
  }

  const children: ReactNode[] = splitMathText(text).map((segment, index) =>
    segment.kind === "math" ? (
      <KatexFragment
        key={`${segment.value}-${index}`}
        source={segment.value}
        display={segment.display}
        literalLatex={segment.literalLatex}
      />
    ) : (
      segment.value
    ),
  );

  return (
    <span className={["math-text", className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
