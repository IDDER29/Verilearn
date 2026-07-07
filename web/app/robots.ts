import type { MetadataRoute } from "next";

/**
 * robots.txt (App Router metadata convention). VeriLearn is mostly a private,
 * authenticated app, so we keep the app surfaces and the API out of search
 * indexes and leave only the genuinely public pages crawlable — the marketing
 * pages (`/login`, `/signup`, `/pricing`, `/demo`), the ban-appeal entry
 * (`/appeal`), and the public certificate-verify pages (`/verify/*`), which we
 * *want* discoverable so a shared verify link resolves for anyone.
 *
 * Crawlers hitting a private path are redirected to `/login` by the middleware
 * anyway; disallowing them here just avoids wasted crawl budget and stray
 * index entries.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/api/",
        "/admin",
        "/settings",
        "/topics",
        "/tests",
        "/review",
        "/gap-map",
        "/reports",
        "/my-tasks",
        "/conflicts",
        "/notifications",
        "/upgrade",
        "/new-topic",
        "/pipeline",
        "/welcome",
        "/logout",
      ],
    },
  };
}
