import { useState } from 'react';
import { motion } from 'motion/react';
import { useDecorativeCard, useHoverLift, useStaggerContainer, MICRO_TRANSITION } from '../config/motion';
import './ProjectCards.css';

// Ported from ProjectsAccordion, then de-accordioned: projects are no
// longer collapsible — every card renders fully expanded, text left and
// image right (image above text below ~768px via CSS column-reverse).
export interface ProjectLink {
  label: string;
  href: string;
  icon: 'external' | 'github';
}

interface ProjectItem {
  slug: string;
  title: string;
  imageAlt: string;
  description: string;
  tags: string[];
  /** A card renders one row of links, in order — one array so a project
   * can carry a single GitHub link or several (e.g. a live site too). */
  links: ProjectLink[];
}

interface Props {
  items: ProjectItem[];
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 3h6v6M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}

function ProjectImage({
  slug,
  title,
  alt,
  primaryLink,
}: {
  slug: string;
  title: string;
  alt: string;
  primaryLink: ProjectLink;
}) {
  const [broken, setBroken] = useState(false);
  const hoverLift = useHoverLift(0, 1.08);
  const destinationLabel = `${title} ${primaryLink.icon === 'github' ? 'GitHub repository' : 'live site'}`;

  return (
    <motion.a
      className="project-card__image"
      href={primaryLink.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={destinationLabel}
      whileHover={hoverLift}
      transition={MICRO_TRANSITION}
    >
      {!broken && (
        <img
          className="project-card__img"
          src={`/projects/${slug}.png`}
          width={1280}
          height={720}
          loading="lazy"
          alt={alt}
          onError={() => setBroken(true)}
        />
      )}
      {broken && (
        <span className="project-card__fallback" aria-hidden="true">
          {getInitials(title)}
        </span>
      )}
    </motion.a>
  );
}

export default function ProjectCards({ items }: Props) {
  const card = useDecorativeCard();
  const stagger = useStaggerContainer();

  return (
    <motion.div
      className="project-cards"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {items.map((item) => (
        <motion.article className="project-card" key={item.slug} variants={card}>
          <div className="project-card__text">
            <h3 className="project-card__title">{item.title}</h3>
            <p className="project-card__description">{item.description}</p>
            <div className="project-card__tags">
              {item.tags.map((tag) => (
                <span className="project-card__tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-card__links">
              {item.links.map((link) => (
                <a key={link.href} className="project-card__link" href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                  {link.icon === 'github' ? <GitHubIcon /> : <ExternalLinkIcon />}
                </a>
              ))}
            </div>
          </div>
          <ProjectImage slug={item.slug} title={item.title} alt={item.imageAlt} primaryLink={item.links[0]} />
        </motion.article>
      ))}
    </motion.div>
  );
}
