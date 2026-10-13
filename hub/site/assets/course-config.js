export const COURSES = Object.freeze([
  Object.freeze({
    slug: "phy301",
    code: "PHY301",
    titleZh: "热力学与统计物理",
    titleEn: "Thermodynamics and Statistical Physics",
    route: "/phy301/",
    expectedNodes: 19,
    stateSource: "granular",
    availability: "ready",
  }),
  Object.freeze({
    slug: "phy408",
    code: "PHY408",
    titleZh: "数据密集型科学",
    titleEn: "Data Intensive Science",
    route: "/phy408/",
    expectedNodes: 31,
    stateSource: "compatibility",
    availability: "ready",
  }),
  Object.freeze({
    slug: "phy309",
    code: "PHY309",
    titleZh: "光子学与光电子学",
    titleEn: "Photonics and Optoelectronics",
    route: "/phy309/",
    expectedNodes: 83,
    stateSource: "compatibility",
    availability: "ready",
  }),
  Object.freeze({
    slug: "mat107",
    code: "MAT107",
    titleZh: "概率论",
    titleEn: "Probability Theory",
    route: "/mat107/",
    expectedNodes: 56,
    stateSource: "compatibility",
    availability: "ready",
  }),
]);

export const COURSE_BY_SLUG = new Map(COURSES.map((course) => [course.slug, course]));

const AVAILABILITY_PRESENTATIONS = Object.freeze({
  ready: Object.freeze({
    label: "内容已上线",
    className: "course-state--ready",
  }),
  building: Object.freeze({
    label: "学习站建设中",
    className: "course-state--building",
  }),
});

export function courseAvailabilityPresentation(availability) {
  return AVAILABILITY_PRESENTATIONS[availability] ?? AVAILABILITY_PRESENTATIONS.building;
}
