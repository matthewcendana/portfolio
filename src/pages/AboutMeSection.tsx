import { useState } from "react";
import { motion } from "motion/react";
import { sectionAnchorId, SECTIONS } from "../config/sections";
import { useDecorativeEntrance, useStaggerContainer } from "../config/motion";
import BrandIcon from "../components/BrandIcon";
import ResumeDropdown from "../components/ResumeDropdown";
import "./AboutMeSection.css";

const TOOLBOX_SKILLS = [
  "Python",
  "SQL",
  "PostgreSQL",
  "Databricks",
  "PySpark",
  "Docker",
  "AWS",
  "REST APIs",
  "Git",
  "C++",
  "RAG / LLM Integration",
  "TypeScript",
  "React",
];

const anchorId = sectionAnchorId(
  SECTIONS.find((s) => s.table === "about_me")!.path,
);

export default function AboutMeSection() {
  const item = useDecorativeEntrance();
  const stagger = useStaggerContainer();
  const [photoBroken, setPhotoBroken] = useState(false);

  return (
    <section
      id={anchorId}
      className="about page-section"
      aria-labelledby="about-heading"
    >
      <motion.div
        className="about__hero"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="about__intro">
          <motion.h1
            id="about-heading"
            className="about__heading"
            variants={item}
          >
            About Me
          </motion.h1>
          <div className="about__bio">
            <motion.p variants={item}>
              I&rsquo;m a 4th-year student at UC Santa Cruz studying Information
              Systems and Computer Science, with a strong interest in software
              and data engineering. I enjoy turning messy, real-world data into
              reliable systems, tools, and products that are genuinely useful.
            </motion.p>
            <motion.p variants={item}>
              Previously, I worked as a Data Engineering Intern at Cooledtured
              Collections, where I built data pipelines and tools to support
              research and marketing efforts. I&rsquo;m also currently a
              Full-Stack Developer at Tech4Good, a social computing club at UCSC
              focused on using technology to address real-world social
              challenges.
            </motion.p>
          </div>

          <motion.div className="about__contact" variants={item}>
            <a
              className="about__contact-link"
              href="mailto:matthewcendana.business@gmail.com"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m4 7 8 6 8-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>matthewcendana.business@gmail.com</span>
            </a>
            <a
              className="about__contact-link"
              href="https://linkedin.com/in/matthew-cendana"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrandIcon name="linkedin" />
              <span>LinkedIn</span>
            </a>
            <a
              className="about__contact-link"
              href="https://github.com/matthewcendana"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrandIcon name="github" />
              <span>GitHub</span>
            </a>
          </motion.div>

          <motion.div className="about__toolbox" variants={item}>
            <h2 className="about__toolbox-heading">
              What&rsquo;s in my Toolbox:
            </h2>
            <div className="about__toolbox-tags">
              {TOOLBOX_SKILLS.map((skill, i) => (
                <span className="about__toolbox-tag" key={i}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div className="about__resume-wrap" variants={item}>
            <ResumeDropdown />
          </motion.div>
        </div>
        <div className="about__visuals">
          <motion.div className="about__photo" variants={item}>
            {!photoBroken ? (
              <img
                className="about__photo-img"
                src="/media/matthew-photo.jpeg"
                width={420}
                height={460}
                alt="Portrait of Matthew Cendana"
                onError={() => setPhotoBroken(true)}
              />
            ) : (
              <span className="about__photo-label" aria-hidden="true">
                [PLACEHOLDER: photo]
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
