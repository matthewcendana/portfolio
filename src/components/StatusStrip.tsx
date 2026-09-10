import './StatusStrip.css';

// Shared "pipeline: healthy | cluster: us-west-1 | dialect: postgresql"
// pill shown above the code editor window on both the landing page and the
// querying screen.
export default function StatusStrip() {
  return (
    <div className="status-strip">
      <span className="status-strip__dot" aria-hidden="true" />
      <span>pipeline: healthy</span>
      <span className="status-strip__sep" aria-hidden="true">
        |
      </span>
      <span>cluster: us-west-1</span>
      <span className="status-strip__sep" aria-hidden="true">
        |
      </span>
      <span>dialect: postgresql</span>
    </div>
  );
}
