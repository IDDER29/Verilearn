#!/usr/bin/env node
// Assembles docs/prd/*.md (lexical order) into docs/PRD.md with a generated TOC.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("./prd/", import.meta.url).pathname;
const files = readdirSync(DIR).filter((f) => f.endsWith(".md")).sort();

const slug = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

const sections = [];
for (const f of files) {
  const body = readFileSync(join(DIR, f), "utf8").trimEnd();
  const h2 = body.match(/^##\s+(.+)$/m);
  sections.push({ file: f, title: h2 ? h2[1].trim() : f, body });
}

const toc = sections
  .map((s, i) => `${i + 1}. [${s.title}](#${slug(s.title)})`)
  .join("\n");

const header = `# VeriLearn — Product Requirements Document

> A verification-first learning platform. This PRD was produced through a structured product-discovery process: persona discovery, per-domain user-story development, adversarial senior-PM critique across seven lenses, prioritization, requirements traceability, and a completeness self-review.

**Contents**

${toc}

---
`;

const out = header + "\n" + sections.map((s) => s.body).join("\n\n---\n\n") + "\n";
writeFileSync(new URL("./PRD.md", import.meta.url).pathname, out);

const words = out.split(/\s+/).length;
console.log(`Assembled ${sections.length} sections → docs/PRD.md (~${words.toLocaleString()} words)`);
for (const s of sections) console.log(`  • ${s.file} — ${s.title}`);
