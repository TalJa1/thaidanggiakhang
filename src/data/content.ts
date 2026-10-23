// ALL visible copy for the site. Section 5 of the brief is the only source:
// do not reword, shorten or "improve" any of these strings.
import type { DocName, ImageName } from "../config/media";

export const SITE = {
  name: "Thai Dang Gia Khang",
  copyright: "© 2026 Thai Dang Gia Khang",
};

export const NAV = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT ME" },
  { to: "/passion-project", label: "PASSION PROJECT" },
  { to: "/research", label: "RESEARCH & TECH-DRIVEN PRODUCTS" },
  { to: "/community", label: "COMMUNITY" },
  { to: "/awards", label: "AWARDS" },
] as const;

/** UI strings allowed by the brief (not client copy). */
export const UI = {
  viewPdf: "View PDF",
  comingSoon: "Coming soon",
  imageComingSoon: "Image coming soon",
  expandImage: "Expand photo",
  closeImage: "Close photo",
  videoComingSoon: "Video coming soon",
  featured: "Featured",
  readMore: "Read more",
  backToTop: "Back to top",
  skip: "Skip to content",
  replay: "Replay",
  schematic: "Schematic",
  palette: "Command palette",
  search: "Type to search",
  esc: "Esc",
  connect: "Let’s Connect",
  learnMoreAqua: "Learn more about Aquarescue:",
  facebookPage: "Facebook Page",
};

/* ------------------------------------------------------------------ HOME */

export const HOME = {
  hero: {
    title: "Building Technology for a Safer World.",
    text: "I’m Thai Dang Gia Khang, a student engineer passionate about robotics, autonomous systems, and technology that addresses real-world challenges. I explore how engineering can make communities safer, smarter, and more resilient.",
    button: "About Me",
  },
  keywords: "Engineering · Robotics · Social Impact",
  intro: {
    title: "Curiosity into Creation",
    text: "I believe engineering begins with asking the right questions. From designing autonomous rescue systems to exploring AI-powered robotics, I enjoy turning ideas into practical solutions that address challenges beyond the classroom.",
    about: "About",
  },
  featuredLabel: "RESEARCH & TECH-DRIVEN PRODUCTS",
  cardButton: "Explore RESEARCH & TECH-DRIVEN PRODUCTS",
  cards: [
    { id: "rescue", name: "Autonomous Rescue Quadcopter", image: "research-rescue-2" },
    { id: "flood", name: "IoT Flood Monitoring & Warning System", image: "research-flood-1" },
    { id: "romad", name: "ROMAD — AI Museum Guide Robot", image: "research-romad-2" },
    { id: "cantho", name: "Flood Risk Research in Can Tho", image: "research-cantho-1" },
  ] as { id: ProjectId; name: string; image: ImageName }[],
  purpose: {
    title: "Engineering with Purpose",
    text: "My goal is to develop engineering solutions that combine technical innovation with meaningful social impact. I am especially interested in robotics, autonomous systems, embedded technology, and applications that improve public safety.",
    button: "Let’s Connect",
  },
};

/* ----------------------------------------------------------------- ABOUT */

export const ABOUT = {
  title: "A Student. A Builder. A Problem Solver.",
  cards: [
    "Robotics & Autonomous Systems",
    "Embedded Systems & IoT",
    "Artificial Intelligence",
    "Engineering Design",
    "Disaster Prevention & Public Safety",
    "Technology for Social Impact",
  ],
  philosophy: {
    title: "What Drives My Work",
    text: "I am motivated by the idea that technology should do more than demonstrate what is possible. It should help solve problems that matter. Through engineering, I hope to build systems that are useful, accessible, and responsive to real human needs.",
  },
};

/* -------------------------------------------------------------- RESEARCH */

export type ProjectId = "rescue" | "flood" | "romad" | "cantho";

export interface Project {
  id: ProjectId;
  num: string;
  label: string;
  title: string;
  fields: string;
  description: string;
  images: [ImageName, ImageName];
  doc?: DocName;
  highlight?: { value: string; caption: string };
  stats?: string[];
}

export const RESEARCH = {
  title: "RESEARCH & TECH-DRIVEN PRODUCTS",
  paper: { label: "Research Paper:", title: "Student Research Paper" },
};

export const PROJECTS: Project[] = [
  {
    id: "rescue",
    num: "01",
    label: "Project 01",
    title: "Autonomous Rescue Quadcopter",
    fields: "Robotics · Computer Vision · Search and Rescue",
    description:
      "An autonomous quadcopter designed to support water-rescue operations by navigating GPS waypoints, detecting people in distress through body-pose recognition, and delivering lifebuoys or emergency supplies. The system combines MediaPipe Pose, PID-based visual alignment, and real-time GPS communication to improve rescue delivery precision, reducing lifebuoy drop error from 143–187 cm to 40–59 cm compared with GPS-only targeting.",
    images: ["research-rescue-1", "research-rescue-2"],
    highlight: { value: "143–187 cm → 40–59 cm", caption: "lifebuoy drop error" },
  },
  {
    id: "flood",
    num: "02",
    label: "Project 02",
    title: "IoT Environmental Monitoring & Flood Warning System",
    fields: "IoT · Environmental Monitoring · Flood Detection",
    description:
      "A solar-powered environmental monitoring station designed to detect rising water levels and provide early flood warnings. Built around an ESP32 with water-level and weather sensors, the system displays real-time measurements on an onboard screen and a live web dashboard with interactive mapping. It features four water-level alert tiers, storm-pressure alerts, and a stability filter to reduce false alarms, achieving water-level measurement errors within ±0.2 cm during controlled testing.",
    images: ["research-flood-1", "research-flood-2"],
    doc: "research-flood-1",
  },
  {
    id: "romad",
    num: "03",
    label: "Project 03",
    title: "ROMAD: AI-Powered Museum Guide Robot",
    fields: "Robotics · Artificial Intelligence · Human-Robot Interaction",
    description:
      "An AI-powered museum guide robot designed to autonomously navigate museum exhibits and deliver interactive, multilingual visitor experiences. Built on an Arduino UNO R4 WiFi platform with camera, line, and laser sensors, ROMAD combines autonomous navigation, visitor recognition, and AI-powered question answering with a web-based control interface and voice interaction. The project was tested through 50+ navigation trials, visitor recognition tests with 30+ participants, and 100+ AI question-answering tests, and received a Gold Certificate at the World Robot Olympiad (WRO) 2026.",
    images: ["research-romad-1", "research-romad-2"],
    doc: "research-romad-1",
    stats: ["50+ navigation trials", "30+ participants", "100+ AI question-answering tests"],
  },
  {
    id: "cantho",
    num: "04",
    label: "Project 04",
    title: "Assessing Flood Risk under Climate Change in Can Tho City",
    fields: "Climate Change · GIS · Hydraulic Modelling · Sustainable Urban Development",
    description:
      "A research project assessing present and future urban flood risks in Can Tho City by integrating hydraulic modelling, GIS-based spatial analysis, exposure and vulnerability indicators, and field-based damage data. The study identified Tân An, An Phú, and An Cư as social-risk hotspots and examined how climate change could affect flood severity and urban vulnerability, providing insights for climate adaptation and risk-informed urban planning.",
    images: ["research-cantho-1", "research-cantho-2"],
  },
];

/** First sentence of a description, verbatim (used on the Home cards). */
export function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}

/* ------------------------------------------------------------- COMMUNITY */

export interface Initiative {
  id: string;
  num: string;
  title: string;
  role: string;
  paragraphs: string[];
  impactTitle?: string;
  list: string[];
  images: [ImageName, ImageName, ImageName];
  visual: "code" | "graph" | "piano";
}

export const COMMUNITY = {
  title: "COMMUNITY & LEADERSHIP",
  subtitle: "Technology Beyond the Classroom",
  items: [
    {
      id: "nextgen",
      num: "01.",
      title: "NextGen Lab — Empowering Young Minds Through STEM",
      role: "Founder · January 2026 – Present",
      paragraphs: [
        "NextGen Lab is a student-led initiative that makes STEM education more accessible to children through hands-on programming lessons, creative engineering workshops, and interactive learning experiences.",
        "Through partnerships with local schools and community organizations, the project introduces students to coding, computational thinking, mathematics, and real-world engineering challenges.",
      ],
      impactTitle: "Impact at a Glance",
      list: [
        "270 children reached through 10 programming lessons at Maison Chance.",
        "VND 5 million raised for Maison Chance’s scholarship fund through handmade products and food sales.",
        "60+ students engaged in a flood-resilient engineering workshop, designing floating-house models to explore buoyancy and structural stability.",
      ],
      images: ["community-nextgen-1", "community-nextgen-2", "community-nextgen-3"],
      visual: "code",
    },
    {
      id: "giveforward",
      num: "02.",
      title: "GiveForward — Turning Community Support into Educational Opportunities",
      role: "President · January 2026 – Present",
      paragraphs: [],
      list: [
        "Organized a Golden Bell Challenge educational activity for 120+ students at Phụng Hiệp Primary School, covering subjects such as math and general knowledge",
        "Distributed 120+ gift packages of school supplies to support students’ learning and educational needs, funded through student-led fundraising campaigns and community donations",
        "Coordinated 23 volunteers on the event day, including running the quiz, sorting and handing out gifts,... for local students.",
      ],
      images: ["community-giveforward-1", "community-giveforward-2", "community-giveforward-3"],
      visual: "graph",
    },
    {
      id: "canvas",
      num: "03.",
      title: "Canvas of Sounds — Where Music Creates Meaning",
      role: "Founder · December 2025 – Present",
      paragraphs: [
        "Canvas of Sounds is a student-led music initiative that brings people together through live performances and fundraising, transforming a shared love of music into meaningful support for children in need.",
        "Through charity concerts, music performances, and merchandise sales, the initiative uses artistic expression as a platform for compassion and community engagement.",
      ],
      impactTitle: "Impact at a Glance",
      list: [
        "Organized and performed piano at Wonderland of Wishes, a charity concert attended by approximately 200 people.",
        "Generated approximately VND 21 million through ticket sales, fundraising, and merchandise.",
        "Donated 100% of event profits to fulfill children's wishes and support Bừng Sáng Shelter for the Visually Impaired.",
      ],
      images: ["community-canvas-1", "community-canvas-2", "community-canvas-3"],
      visual: "piano",
    },
  ] as Initiative[],
};

/* ---------------------------------------------------------------- AWARDS */

export type Level = "gold" | "silver" | "bronze" | "third";

export interface Award {
  title: string;
  event: string;
  category: string;
  text: string;
  image: ImageName;
  levels: { level: Level; label: string }[];
}

export const AWARDS = {
  title: "Awards & Achievements",
  intro:
    "Celebrating milestones in innovation, robotics, computer science, and sports, each achievement reflects a commitment to continuous learning, creative problem-solving, and teamwork.",
  groups: [
    {
      label: "International Competitions",
      items: [
        {
          title: "Special Award & Gold Medal",
          event: "World Invention Creativity Olympics (WICO) 2026",
          category: "International Innovation & Invention",
          text: "Recognized for innovative thinking and project development at an international competition showcasing student inventions, creative ideas, and technological solutions",
          image: "award-wico",
          levels: [{ level: "gold", label: "Gold" }],
        },
        {
          title: "Gold Award",
          event: "World Robot Olympiad (WRO) 2026",
          category: "International Robotics Competition",
          text: "Awarded for demonstrating robotics engineering, programming, and problem-solving through the development and presentation of a robotics project.",
          image: "award-wro",
          levels: [{ level: "gold", label: "Gold" }],
        },
        {
          title: "Bronze Award",
          event: "Southeast Asia Computer Science Olympiad (SEACSO) 2026",
          category: "Regional Computer Science Competition",
          text: "Recognized for computational thinking, algorithmic reasoning, and analytical problem-solving in a regional computer science competition.",
          image: "award-seacso",
          levels: [{ level: "bronze", label: "Bronze" }],
        },
      ],
    },
    {
      label: "Sports & School Achievements",
      items: [
        {
          title: "Gold & Silver Medals",
          event: "The Asian International School Sports Festival 2026",
          category: "Chess & Tug of War",
          text: "Earned gold medals in chess and tug of war, alongside a silver medal in tug of war, demonstrating strategic thinking, competitive discipline, and teamwork.",
          image: "award-sports-festival",
          levels: [
            { level: "gold", label: "Gold" },
            { level: "silver", label: "Silver" },
          ],
        },
        {
          title: "3rd Place — Chess",
          event: "The Asian International School Sports Competition 2024 & 2025",
          category: "School-Level Chess Competition",
          text: "Achieved third place in chess competitions across two consecutive years, reflecting consistent performance, strategic planning, and concentration.",
          image: "award-chess",
          levels: [{ level: "third", label: "3rd" }],
        },
      ],
    },
  ] as { label: string; items: Award[] }[],
};

/* ------------------------------------------------------- PASSION PROJECT */

export const PASSION = {
  title: "AQUARESCUE",
  subtitle: "Making Water Safety a Community Priority",
  tags: "Child Safety · Community Education",
  stats: "120+ students reached · 17 student volunteers · 120+ life jackets provided",
  mission: {
    label: "01 — The Mission",
    heading: "Every Child Deserves to Be Safer Around Water.",
    paragraphs: [
      "Growing up in a country where rivers and waterways are part of everyday life, I believe water safety should be more than a warning—it should be knowledge that children can understand and use.",
      "Founded in June 2025, Aquarescue is a community initiative dedicated to flood safety and drowning-prevention education for children in Can Tho, a region where water safety is an important concern for local communities.",
      "Through school-based education, public awareness materials, and community support, Aquarescue works to help children recognize water-related risks, learn basic self-rescue principles, and develop safer behaviors around water.",
      "My goal is simple: to make essential water-safety knowledge more accessible to the children who need it.",
    ],
  },
  why: {
    label: "02 — Why Aquarescue?",
    heading: "Safety Begins with Knowledge.",
    paragraphs: [
      "For children living in flood-prone areas, knowing how to behave around water can be an important part of staying safe. Yet awareness alone is not enough if children lack opportunities to learn practical safety principles or access basic protective equipment.",
      "I founded Aquarescue to address this need through three complementary approaches:",
    ],
    approaches: [
      { id: "education", title: "Education", text: "Help children understand water-related risks and learn basic drowning-prevention and self-rescue principles." },
      { id: "awareness", title: "Awareness", text: "Bring safety information beyond the classroom through posters displayed in everyday community spaces." },
      { id: "access", title: "Access", text: "Mobilize local support to provide life jackets and help restore school facilities damaged by flooding." },
    ],
    closing: "By combining these efforts, Aquarescue aims to connect knowledge with practical support.",
  },
  what: {
    label: "03 — What We Do",
    heading: "Turning Awareness into Action",
    items: [
      {
        num: "01.",
        title: "Water-Safety Education",
        paragraphs: [
          "I led a team of 17 student volunteers in organizing two drowning-prevention sessions for more than 120 primary school students in flood-prone areas of Can Tho.",
          "The sessions covered floating, self-rescue, and safe behavior near water, helping students build awareness of how to respond more safely around waterways.",
        ],
        images: ["aquarescue-education-2"] as ImageName[],
        video: true,
      },
      {
        num: "02.",
        title: "Public Awareness Campaign",
        paragraphs: [
          "To extend the message beyond our sessions, I designed and printed 40 drowning-prevention posters covering self-rescue and what to do when someone falls into the water.",
          "The posters were displayed at five community locations, including schools, commune health stations, ferry docks, and markets in flood-prone areas of Can Tho.",
        ],
        images: ["aquarescue-posters-1", "aquarescue-posters-2"] as ImageName[],
      },
      {
        num: "03.",
        title: "Life-Jacket Support",
        paragraphs: [
          "Recognizing that safety education should be accompanied by access to protective equipment, I mobilized VND 5 million from local sponsors to provide more than 120 life jackets to Phung Hiep Primary School.",
        ],
        images: ["aquarescue-lifejackets-1", "aquarescue-lifejackets-2"] as ImageName[],
      },
      {
        num: "04.",
        title: "School Recovery Support",
        paragraphs: [
          "Flooding can disrupt not only daily life but also children's learning environments. In partnership with the local Youth Union, I contributed VND 7 million toward restoring classroom facilities damaged by floods.",
        ],
        images: ["aquarescue-school-1", "aquarescue-school-2"] as ImageName[],
      },
    ],
  },
  impact: {
    label: "04 — The Impact",
    heading: "Small Actions. Meaningful Reach.",
    intro: "Aquarescue brings together student leadership, local sponsorship, and community partnerships to turn a shared concern into practical action.",
    stats: [
      { value: "17", label: "Student volunteers led" },
      { value: "120+", label: "Primary school students reached through two education sessions" },
      { value: "40", label: "Drowning-prevention posters designed and printed" },
      { value: "5", label: "Community locations displaying safety messages" },
      { value: "120+", label: "Life jackets provided to Phung Hiep Primary School" },
      { value: "VND 12 million", label: "Combined funding mobilized and contributed for life-jacket provision and flood-damaged classroom restoration" },
    ],
    note: "The VND 12 million figure combines VND 5 million mobilized from local sponsors for life jackets and VND 7 million contributed toward classroom restoration.",
    closing: "These figures reflect the activities and resources delivered through Aquarescue. The project continues to focus on making water-safety education more accessible and strengthening community support for children's safety.",
  },
  role: {
    label: "05 — My Role as Founder",
    heading: "From Concern to Collective Action",
    intro: "As Aquarescue's founder, I led a team of 17 student volunteers and coordinated activities spanning education, awareness, fundraising, and community collaboration.",
    listTitle: "My responsibilities included:",
    list: [
      "Organizing drowning-prevention education sessions for primary school students.",
      "Designing and producing public-awareness posters.",
      "Mobilizing local sponsorship to provide life jackets.",
      "Partnering with the local Youth Union to support the restoration of flood-damaged classrooms.",
    ],
    closing: "Leading Aquarescue has taught me that meaningful community initiatives require more than a good idea. They depend on clear planning, teamwork, resource mobilization, and the ability to bring different people together around a shared goal.",
  },
  learned: {
    label: "06 — What I Learned",
    heading: "Leadership Means Making Things Happen.",
    paragraphs: [
      "Aquarescue has changed how I understand leadership. I learned that identifying a problem is only the beginning; making progress requires turning concern into concrete actions and building partnerships that help those actions reach people.",
      "I also came to see community impact as a combination of awareness and access. Teaching children about water safety matters, but so does helping schools obtain protective equipment and recover learning spaces after floods.",
      "Most importantly, Aquarescue has strengthened my belief that young people do not have to wait until they have all the answers to begin contributing. They can start by understanding a need, working with others, and taking responsibility for what they can do.",
    ],
  },
  ahead: {
    label: "07 — Looking Ahead",
    heading: "Continuing the Mission",
    paragraphs: [
      "Aquarescue's next steps are guided by the same commitment that inspired its founding: helping children become more aware of water-related risks and supporting safer communities in flood-prone areas.",
      "I hope to continue expanding access to drowning-prevention education, strengthening local partnerships, and finding practical ways to reach more children and schools.",
      "For me, Aquarescue is not simply a volunteer initiative. It is an ongoing commitment to turning awareness into action—and to making children's safety a shared community responsibility.",
    ],
  },
  join: {
    label: "Join the Mission",
    heading: "Safer Waters Start with Us.",
    text: "Every child deserves access to knowledge that can help them stay safe. Through education, community partnerships, and collective action, we can help make water safety a more visible and accessible priority.",
  },
};

/* ------------------------------------------------------------------- SEO */

export const META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Thai Dang Gia Khang | Building Technology for a Safer World.",
    description: HOME.hero.text,
  },
  "/about": {
    title: "ABOUT ME | Thai Dang Gia Khang",
    description: ABOUT.philosophy.text,
  },
  "/passion-project": {
    title: "AQUARESCUE | Making Water Safety a Community Priority",
    description: PASSION.mission.paragraphs[1],
  },
  "/research": {
    title: "RESEARCH & TECH-DRIVEN PRODUCTS | Thai Dang Gia Khang",
    description: HOME.intro.text,
  },
  "/community": {
    title: "COMMUNITY & LEADERSHIP | Thai Dang Gia Khang",
    description: COMMUNITY.items[0].paragraphs[0],
  },
  "/awards": {
    title: "Awards & Achievements | Thai Dang Gia Khang",
    description: AWARDS.intro,
  },
};
