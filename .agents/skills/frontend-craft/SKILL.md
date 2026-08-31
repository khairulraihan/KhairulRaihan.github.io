---
name: frontend-craft
description: >-
  Standardized guidelines for modern, human-crafted, bespoke frontend web development.
  Use when designing or refactoring web interfaces to eliminate generic AI aesthetic tropes
  (anti-AI slop), ensuring clean typography, intentional negative space, authentic voice,
  and high-end product design standards.
---

# Frontend Craftsmanship & Anti-AI Design Guidelines

This skill provides design standards and rules to create web interfaces that feel bespoke, authentic, intentional, and human-crafted—avoiding generic, over-decorated "AI-generated" tropes.

---

## 1. Anti-AI Aesthetic Principles (Eliminate AI Slop)

| AI-Generated Trope | Bespoke Human Craft |
| :--- | :--- |
| **Overdone Neon / Multi-Color Glows**: Cyan + Purple + Pink gradients splashed on every card and background. | **Restrained, Curated Palette**: Obsidian/Charcoal (`#0a0c10`, `#11141c`) with subtle 1px neutral borders (`rgba(255,255,255,0.08)`) and a single, purposeful accent color (e.g., Cobalt Blue `#2563eb` or Emerald `#10b981`). |
| **Distracting Particle / Starfield Canvases**: Heavy constellation lines or floating bubbles moving constantly. | **Quiet Atmosphere & Intentional Lighting**: Subtle, soft ambient radial lighting or clean solid backgrounds that let typography and content take center stage. |
| **Arbitrary Skill Percentage Sliders**: "Python 92%", "SQL 88%" progress bars that look like cheap templates. | **Contextual Stack Taxonomy**: Group tools by workflow (Core Languages, ML & Modeling, BI & Dashboards, Engineering) with practical library tags. |
| **Pompous Buzzword Fluff**: "Harnessing synergistic cutting-edge neural pipelines...". | **Clear, Grounded Technical Voice**: Concise, direct problem statements, real datasets, concrete metrics (e.g. 92.4% accuracy on 12K comments), and business tradeoffs. |
| **Floating Sticker Overload**: Random badge bubbles obscuring pictures and layout grids. | **Structured Editorial Hierarchy**: Clean visual grids (Swiss/Linear/Vercel style), generous padding, and aligned metadata. |

---

## 2. Typographic Rules

1. **Hierarchy**: Max 2 font families (1 expressive heading font + 1 clean neutral sans-serif body font + optional monospaced font for code/data).
2. **Readability**:
   - Body font line-height: `1.6` - `1.75` for continuous prose.
   - Headings: Tight letter-spacing (`-0.02em` to `-0.03em`) and line-height `1.15` - `1.25`.
   - Content measure: Limit paragraph text blocks to `65` - `75` characters per line (`max-width: 680px`).
3. **Contrast**: Clear distinctions between Primary text (`#f8fafc`), Secondary text (`#94a3b8`), and Muted metadata (`#64748b`).

---

## 3. Layout, Grid & Negative Space

1. **Generous Padding**: Minimum `5rem` to `7rem` vertical padding between sections.
2. **Subtle Elevation**: Use `1px` subtle borders (`rgba(255, 255, 255, 0.07)`) and soft box-shadows (`0 4px 20px rgba(0, 0, 0, 0.3)`) rather than harsh outer glows.
3. **Interactive Restraint**: Micro-interactions should be subtle (`transform: translateY(-2px)` or opacity transition), lasting `150ms` - `250ms` with smooth cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 4. Authentic Data Science Case Study Structure

For technical portfolios (Data Science, NLP, Machine Learning, BI):
- **Title & Domain**: Clean name, dataset origin, and objective.
- **Problem Statement**: What real friction or gap existed?
- **Methodology & Architecture**: Specific algorithms compared, data cleaning techniques, pipeline stages.
- **Concrete Results & Metrics**: Real numbers (Accuracy, F1-score, data records processed, processing latency).
- **Business Impact**: How this assists decision makers or end users.
