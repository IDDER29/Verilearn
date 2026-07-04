import { redirect } from "next/navigation";

/**
 * Deep-link guard (REVIEW-02, commit-before-reveal). A revealed answer is only
 * legitimate once a confidence level has been committed in a live session, so a
 * bare `/review/reveal` deep-link has no honest state to show. Route back to the
 * interactive loop, which enforces the commit gate before revealing anything.
 */
export default function ReviewRevealPage() {
  redirect("/review");
}
