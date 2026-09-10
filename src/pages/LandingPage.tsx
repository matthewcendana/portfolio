import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import DatabaseSelector from "../components/DatabaseSelector";
import CodeEditorWindow, {
  type EditorLine,
} from "../components/CodeEditorWindow";
import BackgroundArt from "../components/BackgroundArt";
import StatusStrip from "../components/StatusStrip";
import { tableName, type Section } from "../config/sections";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePageTransition, useDecorativeEntrance } from "../config/motion";
import "./LandingPage.css";

// Ported from index.astro's inline <script>. That script owned: the mini
// editor's ghost-preview/commit text and status, plus a 600ms delay between
// "commit" and handing off to the full-screen querying transition. All of
// that is now local component state instead of textContent/innerHTML
// mutation and a bare setTimeout.
type LineState = "idle" | "previewing" | "committed";

interface Props {
  onCommit: (section: Section) => void;
}

export default function LandingPage({ onCommit }: Props) {
  usePageTitle("Matthew Cendana Portfolio");

  const [lineState, setLineState] = useState<LineState>("idle");
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [statusRight, setStatusRight] = useState("Idle");
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A user navigating away mid-commit-delay must not leave this timer
  // firing onCommit() after the page is gone.
  useEffect(() => {
    return () => {
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    };
  }, []);

  function clearCommitTimer() {
    if (commitTimerRef.current) {
      clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
  }

  function handlePreview(section: Section | null) {
    if (section) {
      clearCommitTimer();
      setLineState("previewing");
      setActiveSection(section);
      setStatusRight("Idle");
    } else if (lineState !== "committed") {
      // Closing the menu or moving off an option shouldn't erase an actual
      // commit — only an in-progress (uncommitted) hover preview.
      setLineState("idle");
    }
  }

  function handleSelect(section: Section) {
    clearCommitTimer();
    setLineState("committed");
    setActiveSection(section);
    setStatusRight("Executing...");
    commitTimerRef.current = setTimeout(() => {
      onCommit(section);
    }, 600);
  }

  const previewLineText =
    lineState === "idle" || !activeSection ? (
      ""
    ) : lineState === "previewing" ? (
      `SELECT * FROM ${tableName(activeSection.table)};`
    ) : (
      <>
        <span className="sql-kw">SELECT * FROM</span>{" "}
        <span className="sql-id">{tableName(activeSection.table)}</span>
        <span className="sql-semi">;</span>
      </>
    );

  const editorLines: EditorLine[] = [
    {
      id: "comment",
      text: "-- Select a database to query...",
      tone: "dim",
      cursor: true,
    },
    {
      id: "hint",
      text: "-- (Press or click any database table on the left)",
      tone: "faint",
      italic: true,
      size: "sm",
      collapseOnXs: true,
    },
    {
      id: "preview",
      text: previewLineText,
      tone: lineState === "committed" ? "normal" : "dim",
    },
    { id: "filler-4", text: "", tone: "dim", collapseOnXs: true },
    { id: "filler-5", text: "", tone: "dim", collapseOnXs: true },
  ];

  const item = useDecorativeEntrance();

  return (
    <motion.main
      id="main-content"
      className="landing"
      aria-label="Landing"
      variants={usePageTransition()}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <BackgroundArt />
      <div className="landing__left">
        <motion.h1 className="landing__heading" variants={item}>
          Hi! I&rsquo;m Matthew
        </motion.h1>
        <motion.p className="landing__subtitle" variants={item}>
          An Aspiring Software &amp; Data Engineer
        </motion.p>
        <motion.div variants={item}>
          <DatabaseSelector onPreview={handlePreview} onSelect={handleSelect} />
        </motion.div>
      </div>
      <motion.div className="landing__right" variants={item}>
        <StatusStrip />
        <CodeEditorWindow
          tabTitle="query.sql"
          statusLeft="PostgreSQL 16  UTF-8"
          statusRight={statusRight}
          lines={editorLines}
        />
      </motion.div>
    </motion.main>
  );
}
