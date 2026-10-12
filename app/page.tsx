import type { Metadata } from "next";
import StudyGuide from "./StudyGuide";

export const metadata: Metadata = {
  title: "统计物理从零学习路线",
  description:
    "一条从数学、热力学前置到经典系综、量子统计与非平衡的无跳步 PHY301 学习树。",
};

export default function Home() {
  return <StudyGuide />;
}
