import { motion } from 'motion/react';
import ProjectCards from '../components/ProjectCards';
import { sectionAnchorId, SECTIONS } from '../config/sections';
import { useDecorativeEntrance } from '../config/motion';
import './ProjectsSection.css';

// Drive the project list from data, not markup, so cards can be added,
// reordered, or filled in with real copy by editing this array.
const projects = [
  {
    slug: 'atlasedm',
    title: 'AtlasEDM',
    imageAlt: 'Screenshot of the AtlasEDM interactive event map',
    description:
      'An interactive map for finding upcoming EDM shows and festivals near any city. Search by location, artist, date, or age restriction and see real events plotted on a live map.',
    tags: ['C++', 'PostgreSQL', 'Docker', 'Redis', 'Next.js', 'TypeScript'],
    links: [
      { label: 'Visit Site', href: 'https://atlasedm.com', icon: 'external' as const },
      { label: 'View on GitHub', href: 'https://github.com/matthewcendana/AtlasEDM', icon: 'github' as const },
    ],
  },
  {
    slug: 'pharma-doc-qa',
    title: 'Pharmaceutical Document Q&A',
    imageAlt: 'Screenshot of the Pharmaceutical Document Q&A tool interface',
    description:
      "A tool that reads dense pharmaceutical PDFs and answers plain-English questions about them, citing the exact page every answer came from. Built during a Pfizer externship. Runs entirely offline with no API keys and provides honest answers instead of guessing when proper context isn't in the documents.",
    tags: ['Python', 'RAG', 'FAISS', 'OCR', 'Gradio'],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/matthewcendana/pfizer-document-chatbot',
        icon: 'github' as const,
      },
    ],
  },
  {
    slug: 'ai-sentiment-lakehouse',
    title: 'AI Tool Sentiment Lakehouse',
    imageAlt: 'Screenshot of the AI Tool Sentiment Lakehouse dashboard',
    description:
      'A data-ingestion pipeline that tracks what people on Reddit and Hacker News are saying about 12 AI tools, scores the sentiment, and publishes it as a public dataset and live dashboard. Built with automated data quality checks and a regression test suite to keep the numbers trustworthy.',
    tags: ['Databricks', 'PySpark', 'SQL', 'Delta Lake', 'Python'],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/matthewcendana/ai-sentiment-lakehouse',
        icon: 'github' as const,
      },
    ],
  },
  {
    slug: 'pintheslug',
    title: 'PinTheSlug',
    imageAlt: 'Screenshot of the PinTheSlug campus guessing game',
    description:
      "A GeoGuessr-style game for the UC Santa Cruz campus. You're dropped at a random campus location and have to pin where you are on the map — closer guesses score higher, just like the original game. Built with a team at CruzHacks 2026 to provide a fun experience to new students navigating campus for the first time.",
    tags: ['React', 'TypeScript', 'Google Maps API', 'Supabase'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/kdelmo1/geo_slug', icon: 'github' as const }],
  },
];

const anchorId = sectionAnchorId(SECTIONS.find((s) => s.table === 'projects')!.path);

export default function ProjectsSection() {
  return (
    <section id={anchorId} className="projects page-section" aria-labelledby="projects-heading">
      <motion.h1
        id="projects-heading"
        className="projects__heading"
        variants={useDecorativeEntrance()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Projects
      </motion.h1>
      <ProjectCards items={projects} />
    </section>
  );
}
