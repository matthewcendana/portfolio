// Shared by Nav (clicking a pill while already on the scrollable sections
// page) and SectionsPage (the instant jump on initial mount for a direct
// URL visit) so both agree on exactly how a section is brought into view.
export function scrollToSection(anchorId: string, behavior: ScrollBehavior): void {
  document.getElementById(anchorId)?.scrollIntoView({ behavior, block: 'start' });
}
